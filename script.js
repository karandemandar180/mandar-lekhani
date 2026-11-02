
document.addEventListener("DOMContentLoaded", function () {

  const languageButton = document.getElementById("languageToggle");

  if (!languageButton) {
    console.error("Language button not found!");
    return;
  }

  let currentLanguage = "mr";

  function changeLanguage(language) {

    currentLanguage = language;

    document.documentElement.lang = language;

    const elements = document.querySelectorAll("[data-mr][data-en]");

    elements.forEach(function (element) {
      element.textContent = element.getAttribute("data-" + language);
    });

    languageButton.textContent =
      language === "mr" ? "English" : "मराठी";

    console.log("Language changed to:", language);
  }

  languageButton.addEventListener("click", function () {

    if (currentLanguage === "mr") {
      changeLanguage("en");
    } else {
      changeLanguage("mr");
    }

  });

  changeLanguage("mr");

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});
