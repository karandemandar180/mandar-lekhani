
document.addEventListener("DOMContentLoaded", function () {

  // LANGUAGE SWITCH

  const languageButton = document.getElementById("languageToggle");

  let currentLanguage = "mr";

  function changeLanguage(language) {

    currentLanguage = language;

    document.documentElement.lang = language;

    const elements = document.querySelectorAll("[data-mr][data-en]");

    elements.forEach(function (element) {

      element.textContent =
        element.getAttribute("data-" + language);

    });

    if (languageButton) {

      languageButton.textContent =
        language === "mr" ? "English" : "मराठी";

    }

  }

  if (languageButton) {

    languageButton.addEventListener("click", function () {

      changeLanguage(
        currentLanguage === "mr" ? "en" : "mr"
      );

    });

  }

  changeLanguage("mr");


  // MOBILE MENU

  const menuToggle = document.getElementById("menuToggle");

  const navigation = document.getElementById("mainNavigation");

  if (menuToggle && navigation) {

    menuToggle.addEventListener("click", function () {

      const isOpen = navigation.classList.toggle("active");

      menuToggle.textContent = isOpen ? "✕" : "☰";

      menuToggle.setAttribute("aria-expanded", String(isOpen));

    });

    const navLinks = navigation.querySelectorAll("a");

    navLinks.forEach(function (link) {

      link.addEventListener("click", function () {

        navigation.classList.remove("active");

        menuToggle.textContent = "☰";

        menuToggle.setAttribute("aria-expanded", "false");

      });

    });

  }


  // CURRENT YEAR

  const year = document.getElementById("year");

  if (year) {

    year.textContent = new Date().getFullYear();

  }

});
