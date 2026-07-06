(async function () {
  const catalog = document.querySelector("[data-catalog]");
  const futureList = document.querySelector("[data-future-list]");

  function createCard(simulator, dictionary) {
    const text = dictionary.simulators[simulator.id];
    const article = document.createElement("article");
    article.className = "sim-card";
    article.innerHTML = `
      <img class="sim-thumb" src="${simulator.thumbnail}" alt="${text.title}" loading="lazy">
      <div class="sim-card-body">
        <span class="badge">${text.badge}</span>
        <h3>${text.title}</h3>
        <p>${text.description}</p>
        <div class="meta-row">
          <span>${dictionary.catalog.level}: ${simulator.level}</span>
          <span>${dictionary.catalog.topics}: ${simulator.topics.length}</span>
        </div>
        <a class="button primary" href="${simulator.url}">${dictionary.catalog.open}</a>
      </div>
    `;
    return article;
  }

  function renderFutureLabs(dictionary) {
    if (!futureList) return;
    futureList.innerHTML = "";
    dictionary.future.items.forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      futureList.appendChild(chip);
    });
  }

  await window.PhysicsI18n.init({
    basePath: "",
    onReady: async (dictionary) => {
      const response = await fetch("data/simulators.json");
      const simulators = await response.json();
      catalog.innerHTML = "";
      simulators.forEach((simulator) => catalog.appendChild(createCard(simulator, dictionary)));
      renderFutureLabs(dictionary);
    }
  });
})();
