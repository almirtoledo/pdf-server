import { content } from "./content.js";

const createCardHTML = (title, body, isSuper) => {
  return `
    <div class="card">
      <h1>${isSuper ? "*" : ""}${title}</h1>
      <p>${body}</p>
    </div>
  `;
};

const renderPages = () => {
  const maxPageHeight = 297;
  const maxHeightPx = (maxPageHeight * 96) / 25.4;
  const pagesSection = document.querySelector(".pages-section");

  let currentPage = document.createElement("section");
  currentPage.classList.add("page-config");

  let currentGrid = document.createElement("div");
  currentGrid.classList.add("grid");

  currentPage.appendChild(currentGrid);
  pagesSection.appendChild(currentPage);

  content.forEach((item) => {
    const newCardHTML = createCardHTML(item.title, item.body, item.super);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newCardHTML;
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);
    const cardHeight = tempDiv.getBoundingClientRect().height;

    const currentHeightUsed = currentGrid.getBoundingClientRect().height;

    if (currentHeightUsed + cardHeight > maxHeightPx) {
      currentPage = document.createElement("section");
      currentPage.classList.add("page-config");

      currentGrid = document.createElement("div");
      currentGrid.classList.add("grid");

      currentPage.appendChild(currentGrid);
      pagesSection.appendChild(currentPage);
    }

    currentGrid.innerHTML += newCardHTML;

    document.body.removeChild(tempDiv);
  });
};

renderPages();
