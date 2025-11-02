document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const filterSelect = document.getElementById("filter-guides");
  const sortSelect = document.getElementById("sort-guides");
  const guideGrid = document.getElementById("guide-grid");
  const guideCards = Array.from(guideGrid.getElementsByClassName("guide-card"));

  const updateGuides = () => {
    const searchTerm = searchBar.value.toLowerCase();
    const currentFilter = filterSelect.value;

    guideCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category;

      const matchesSearch = title.includes(searchTerm);
      const matchesFilter =
        currentFilter === "all" || category === currentFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  };

  const sortGuides = () => {
    const sortValue = sortSelect.value;
    const sortedCards = [...guideCards].sort((a, b) => {
      const titleA = a.dataset.title.toLowerCase();
      const titleB = b.dataset.title.toLowerCase();

      if (sortValue === "alpha-asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    sortedCards.forEach((card) => {
      guideGrid.appendChild(card);
    });
  };

  const applyFilterFromHash = () => {
    const hash = window.location.hash.substring(1);
    const validFilters = ["hero", "kingdom", "economy"];

    if (validFilters.includes(hash)) {
      filterSelect.value = hash;
      updateGuides();
    }
  };

  searchBar.addEventListener("input", updateGuides);
  filterSelect.addEventListener("change", updateGuides);

  sortSelect.addEventListener("change", () => {
    sortGuides();
    updateGuides();
  });

  sortGuides();
  applyFilterFromHash();
  document.dispatchEvent(new CustomEvent('calculatorReady'));
});
