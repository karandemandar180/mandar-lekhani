
(function () {
  "use strict";

  // ----------------------------------
  // ELEMENTS
  // ----------------------------------

  const year = document.getElementById("year");
  const list = document.getElementById("posts-list");
  const searchInput = document.getElementById("blog-search");
  const categoryFilter = document.getElementById("category-filter");
  const article = document.getElementById("article");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  let allPosts = [];

  // ----------------------------------
  // HELPER FUNCTION
  // ----------------------------------

  function addText(parent, tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value || "";

    if (className) {
      element.className = className;
    }

    parent.appendChild(element);
    return element;
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase();
  }

  // ----------------------------------
  // DISPLAY BLOG POSTS
  // ----------------------------------

  function renderPosts() {
    if (!list) return;

    const searchText = normalize(
      searchInput ? searchInput.value : ""
    );

    const selectedCategory = normalize(
      categoryFilter ? categoryFilter.value : ""
    );

    const filteredPosts = [...allPosts]
      .reverse()
      .filter(function (post) {

        const searchableText = [
          post.title,
          post.category,
          post.author,
          post.excerpt,
          ...(Array.isArray(post.content) ? post.content : [])
        ].join(" ");

        const matchesSearch =
          normalize(searchableText).includes(searchText);

        const matchesCategory =
          selectedCategory === "" ||
          normalize(post.category) === selectedCategory;

        return matchesSearch && matchesCategory;
      });

    list.replaceChildren();

    if (filteredPosts.length === 0) {
      addText(
        list,
        "p",
        "या शोधानुसार कोणतेही लेख सापडले नाहीत.",
        "no-results"
      );
      return;
    }

    filteredPosts.forEach(function (post) {

      const card = document.createElement("article");
      card.className = "post-card";

      addText(card, "div", post.category, "post-meta");

      addText(card, "h2", post.title);

      addText(
        card,
        "div",
        (post.date || "") +
          " · " +
          (post.author || "मंदार कारंडे"),
        "post-meta"
      );

      addText(card, "p", post.excerpt);

      const link = document.createElement("a");

      link.className = "read-link";
      link.textContent = "पूर्ण लेख वाचा";

      link.href =
        "./blog-post.html?id=" +
        encodeURIComponent(post.id);

      card.appendChild(link);
      list.appendChild(card);
    });
  }

  // ----------------------------------
  // CATEGORY FILTER
  // ----------------------------------

  function setupCategories(posts) {
    if (!categoryFilter) return;

    const previousValue = categoryFilter.value;

    const categories = [
      ...new Set(
        posts
          .map(function (post) {
            return String(post.category || "").trim();
          })
          .filter(Boolean)
      )
    ].sort();

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "सर्व विषय";

    categoryFilter.appendChild(allOption);

    categories.forEach(function (category) {

      const option = document.createElement("option");

      option.value = category;
      option.textContent = category;

      categoryFilter.appendChild(option);
    });

    const matchingOption = Array.from(
      categoryFilter.options
    ).find(function (option) {
      return normalize(option.value) === normalize(previousValue);
    });

    if (matchingOption) {
      categoryFilter.value = matchingOption.value;
    }
  }

  // ----------------------------------
  // SEARCH EVENTS
  // ----------------------------------

  if (searchInput) {
    searchInput.addEventListener("input", renderPosts);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", renderPosts);
  }

  // ----------------------------------
  // SINGLE ARTICLE PAGE
  // ----------------------------------

  function renderArticle(posts) {
    if (!article) return;

    const params = new URLSearchParams(
      window.location.search
    );

    const id = params.get("id");

    const post = posts.find(function (item) {
      return item.id === id;
    });

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
      (post.date || "") +
        " · लेखक: " +
        (post.author || "मंदार कारंडे"),
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

    const paragraphs = Array.isArray(post.content)
      ? post.content
      : [];

    paragraphs.forEach(function (paragraph) {
      addText(content, "p", paragraph);
    });

    article.appendChild(content);

    const back = document.createElement("a");

    back.href = "./blog.html";
    back.textContent = "← सर्व लेखांकडे परत जा";

    article.appendChild(back);
  }

  // ----------------------------------
  // LOAD POSTS FROM JSON
  // ----------------------------------

  fetch("./posts.json")
    .then(function (response) {

      if (!response.ok) {
        throw new Error("Posts file not found");
      }

      return response.json();
    })
    .then(function (posts) {

      if (!Array.isArray(posts)) {
        throw new Error("Invalid posts format");
      }

      allPosts = posts;

      setupCategories(allPosts);

      renderPosts();

      renderArticle(allPosts);
    })
    .catch(function (error) {

      console.error("Blog Error:", error);

      const message =
        "लेख लोड करता आले नाहीत. कृपया posts.json फाइल तपासा.";

      if (list) {
        list.replaceChildren();

        addText(
          list,
          "p",
          message,
          "blog-error"
        );
      }

      if (article) {
        article.replaceChildren();

        addText(
          article,
          "p",
          message,
          "article-error"
        );
      }
    });

})();
