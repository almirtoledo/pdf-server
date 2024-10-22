import { existsSync } from "fs";
import { extname, join } from "path";
import puppeteer from "puppeteer";

const generatePDF = async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto("http://localhost:3000", {
    waitUntil: "load",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
};

const serveStaticFile = (filePath: any) => {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
  } as const;

  if (existsSync(filePath)) {
    const file = Bun.file(filePath);
    const extension = extname(filePath).toLowerCase();

    const contentType =
      mimeTypes[extension as keyof typeof mimeTypes] ||
      "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } else {
    return new Response("Arquivo não encontrado", { status: 404 });
  }
};

Bun.serve({
  hostname: "0.0.0.0",
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const filePath = join("public", url.pathname);

    if (url.pathname === "/") {
      const file = Bun.file("public/index.html");
      return new Response(file, {
        headers: { "Content-Type": "text/html" },
      });
    } else if (url.pathname === "/pdf") {
      try {
        const pdfBuffer = await generatePDF();
        return new Response(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=classificados.pdf",
          },
        });
      } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        return new Response("Erro ao gerar o PDF", { status: 500 });
      }
    } else {
      return serveStaticFile(filePath);
    }
  },
});
