
(function () {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const list = document.getElementById("posts-list");
  const searchInput = document.getElementById("blog-search");
  const categoryFilter = document.getElementById("category-filter");
  const article = document.getElementById("article");

  let allPosts = [];

  function addText(parent, tag, value, className) {
    const el = document.createElement(tag);
    el.textContent = value || "";
    if (className) el.className = className;
    parent.appendChild(el);
    return el;
  }

  function renderPosts() {
    if (!list) return;

    const searchText = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const selectedCategory = categoryFilter
      ? categoryFilter.value
      : "";

    const filteredPosts = [...allPosts].reverse().filter(post => {
      const searchableText = [
        post.title,
        post.category,
        post.author,
        post.excerpt,
        ...(Array.isArray(post.content) ? post.content : [])
      ].join(" ").toLowerCase();

      const matchesSearch = searchableText.includes(searchText);
      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    list.replaceChildren();

    if (filteredPosts.length === 0) {
      addText(list, "p", "या शोधानुसार कोणतेही लेख सापडले नाहीत.", "no-results");
      return;
    }

    filteredPosts.forEach(post => {
      const card = document.createElement("article");
      card.className = "post-card";

      addText(card, "div", post.category, "post-meta");
      addText(card, "h2", post.title);
      addText(
        card,
        "div",
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

  function setupCategories(posts) {
    if (!categoryFilter) return;

    const categories = [...new Set(
      posts.map(post => post.category).filter(Boolean)
    )].sort();

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "सर्व विषय";
    categoryFilter.appendChild(allOption);

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function renderArticle(posts) {
    if (!article) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const post = posts.find(item => item.id === id);

    article.replaceChildren();

    if (!post) {
      addText(
        article,
        "div",
        "हा लेख सापडला नाही. कृपया ब्लॉग यादीतून लेख निवडा.",
        "article-error"
      );
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

  fetch("./posts.json")
    .then(response => {
      if (!response.ok) throw new Error("Posts file not found");
      return response.json();
    })
    .then(posts => {
      if (!Array.isArray(posts)) {
        throw new Error("Invalid posts format");
      }

      allPosts = posts;

      setupCategories(posts);
      renderPosts();
      renderArticle(posts);

      if (searchInput) {
        searchInput.addEventListener("input", renderPosts);
      }

      if (categoryFilter) {
        categoryFilter.addEventListener("change", renderPosts);
      }
    })
    .catch(error => {
      console.error(error);

      const message =
        "लेख लोड करता आले नाहीत. posts.json फाइल आणि JSON स्वरूप तपासा.";

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
