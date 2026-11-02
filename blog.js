(function () {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  function addText(parent, tag, value, className) {
    const el = document.createElement(tag);
    el.textContent = value || "";
    if (className) el.className = className;
    parent.appendChild(el);
    return el;
  }

  fetch("./posts.json")
    .then(response => {
      if (!response.ok) throw new Error("Posts file not found");
      return response.json();
    })
    .then(posts => {
      if (!Array.isArray(posts)) throw new Error("Invalid posts format");

      const list = document.getElementById("posts-list");
      if (list) {
        list.replaceChildren();

        if (posts.length === 0) {
          addText(list, "p", "सध्या कोणतेही लेख प्रकाशित नाहीत.");
          return;
        }

        [...posts].reverse().forEach(post => {
          const card = document.createElement("article");
          card.className = "post-card";

          addText(card, "div", post.category, "post-meta");
          addText(card, "h2", post.title);
          addText(card, "div",
            (post.date || "") + " · " + (post.author || "मंदार कारंडे"),
            "post-meta"
          );
          addText(card, "p", post.excerpt);

          const link = document.createElement("a");
          link.className = "read-link";
          link.textContent = "पूर्ण लेख वाचा";
          link.href = "./blog-post.html?id=" + encodeURIComponent(post.id);
          card.appendChild(link);

          list.appendChild(card);
        });
      }

      const article = document.getElementById("article");
      if (article) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const post = posts.find(item => item.id === id);

        article.replaceChildren();

        if (!post) {
          const error = document.createElement("div");
          error.className = "article-error";
          error.textContent = "हा लेख सापडला नाही. कृपया ब्लॉग यादीतून लेख निवडा.";
          article.appendChild(error);
          return;
        }

        addText(article, "div", post.category, "article-meta");
        addText(article, "h1", post.title);
        addText(
          article,
          "div",
          (post.date || "") + " · लेखक: " + (post.author || "मंदार कारंडे"),
          "article-meta"
        );

        if (post.image) {
          const img = document.createElement("img");
          img.className = "article-image";
          img.src = post.image;
          img.alt = post.title;
          article.appendChild(img);
        }

        const content = document.createElement("div");
        content.className = "article-content";

        (Array.isArray(post.content) ? post.content : []).forEach(paragraph => {
          addText(content, "p", paragraph);
        });

        article.appendChild(content);

        const back = document.createElement("a");
        back.href = "./blog.html";
        back.textContent = "← सर्व लेखांकडे परत जा";
        article.appendChild(back);
      }
    })
    .catch(error => {
      console.error(error);
      const list = document.getElementById("posts-list");
      const article = document.getElementById("article");
      const message = "लेख लोड करता आले नाहीत. posts.json फाइल आणि JSON स्वरूप तपासा.";
      if (list) {
        list.replaceChildren();
        addText(list, "p", message, "blog-error");
      }
      if (article) {
        article.replaceChildren();
        addText(article, "p", message, "article-error");
      }
    });
})();
