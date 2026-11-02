document.addEventListener("DOMContentLoaded", function () {
  const languageButton = document.getElementById("languageToggle");

  if (!languageButton) return;

  let currentLanguage = "mr";

  function changeLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-mr][data-en]").forEach(function (element) {
      element.textContent = element.getAttribute("data-" + language);
    });

    languageButton.textContent =
      language === "mr" ? "English" : "मराठी";
  }

  languageButton.addEventListener("click", function () {
    changeLanguage(currentLanguage === "mr" ? "en" : "mr");
  });

  changeLanguage("mr");

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
