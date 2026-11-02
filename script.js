
// MANDAR LEKHANI WEBSITE

let currentLanguage = "mr";

const languageToggle = document.getElementById("languageToggle");

function setLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang = language;

  // Change all translated text
  document.querySelectorAll("[data-mr][data-en]").forEach(function(element) {
    element.textContent = element.getAttribute("data-" + language);
  });

  // Update language button
  languageToggle.textContent = language === "mr" ? "English" : "मराठी";

  // Save selected language
  try {
    localStorage.setItem("mandarLekhaniLanguage", language);
  } catch (error) {
    // Website still works if browser storage is unavailable
  }
}

// Language button click
languageToggle.addEventListener("click", function() {
  const newLanguage = currentLanguage === "mr" ? "en" : "mr";
  setLanguage(newLanguage);
});

// Restore previously selected language
try {
  const savedLanguage = localStorage.getItem("mandarLekhaniLanguage");

  if (savedLanguage === "en" || savedLanguage === "mr") {
    setLanguage(savedLanguage);
  } else {
    setLanguage("mr");
  }
} catch (error) {
  setLanguage("mr");
}

// Current year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

console.log("Welcome to Mandar Lekhani Website!");
