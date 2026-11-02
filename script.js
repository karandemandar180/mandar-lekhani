
// MANDAR LEKHANI WEBSITE JAVASCRIPT

// 1. Current Year in Footer
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// 2. Smooth Navigation
document.querySelectorAll('nav a').forEach(function(link) {

    link.addEventListener('click', function() {

        const target = document.querySelector(
            link.getAttribute('href')
        );

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }

    });

});

// 3. Welcome Message
console.log("Welcome to Mandar Lekhani Website!");

// 4. Book Link Safety
document.querySelectorAll('.book a').forEach(function(link) {

    link.setAttribute('rel', 'noopener noreferrer');

});
