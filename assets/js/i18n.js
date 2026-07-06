(function () {
  const supportedLanguages = ["es", "en"];
  const defaultLanguage = "es";

  function getStoredLanguage() {
    const stored = localStorage.getItem("physicsLabLanguage");
    return supportedLanguages.includes(stored) ? stored : null;
  }

  function detectLanguage() {
    const browserLanguage = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (browserLanguage.startsWith("en")) return "en";
    if (browserLanguage.startsWith("es")) return "es";
    return defaultLanguage;
  }

  function resolveLanguage() {
    return getStoredLanguage() || detectLanguage();
  }

  function getValue(dictionary, path) {
    return path.split(".").reduce((value, key) => value && value[key], dictionary);
  }

  async function loadTranslations(basePath, lang) {
    const response = await fetch(`${basePath}i18n/${lang}.json`);
    if (!response.ok) throw new Error(`Missing language file: ${lang}`);
    return response.json();
  }

  function translateStaticNodes(dictionary) {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = getValue(dictionary, node.dataset.i18n);
      if (typeof value === "string") node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      const value = getValue(dictionary, node.dataset.i18nTitle);
      if (typeof value === "string") node.title = value;
    });
  }

  function setDocumentMeta(dictionary, titlePath) {
    const title = getValue(dictionary, titlePath) || dictionary.meta.siteTitle;
    const description = dictionary.meta.siteDescription;
    document.documentElement.lang = dictionary.__lang;
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
  }

  window.PhysicsI18n = {
    supportedLanguages,
    defaultLanguage,
    resolveLanguage,
    getValue,
    translateStaticNodes,
    setDocumentMeta,
    async init(options = {}) {
      const basePath = options.basePath || "";
      const titlePath = options.titlePath || "meta.siteTitle";
      const lang = resolveLanguage();
      const dictionary = await loadTranslations(basePath, lang);
      dictionary.__lang = lang;
      translateStaticNodes(dictionary);
      setDocumentMeta(dictionary, titlePath);

      const selector = document.querySelector("[data-language-select]");
      if (selector) {
        selector.value = lang;
        selector.addEventListener("change", async (event) => {
          localStorage.setItem("physicsLabLanguage", event.target.value);
          window.location.reload();
        });
      }

      if (typeof options.onReady === "function") options.onReady(dictionary, lang);
      return { dictionary, lang };
    }
  };
})();
