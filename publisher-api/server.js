
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 10000;

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH,
  ADMIN_PASSWORD,
  SESSION_SECRET,
  ALLOWED_ORIGIN
} = process.env;

const required = [
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH,
  ADMIN_PASSWORD,
  SESSION_SECRET,
  ALLOWED_ORIGIN
];

if (required.some(value => !value)) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const SESSION_DURATION = 8 * 60 * 60 * 1000;

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  if (origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, OPTIONS"
    );
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// CREATE TOKEN
function createToken() {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + SESSION_DURATION
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

// VERIFY TOKEN
function verifyToken(token) {
  if (typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;

  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return Number.isFinite(data.exp) && data.exp > Date.now();
  } catch {
    return false;
  }
}

// LOGIN PROTECTION
function requireLogin(req, res, next) {
  const authorization = req.headers.authorization || "";

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!verifyToken(token)) {
    return res.status(401).json({
      error: "Session expired. Please login again."
    });
  }

  next();
}

// GITHUB SETTINGS
const githubHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
};

const githubFileUrl =
  `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/posts.json`;

// HOME
app.get("/", (req, res) => {
  res.json({
    status: "Mandar Lekhani Publisher API is running."
  });
});

// ADMIN LOGIN
app.post("/api/login", (req, res) => {
  const password = req.body?.password;

  if (typeof password !== "string") {
    return res.status(401).json({
      error: "Incorrect password."
    });
  }

  const input = Buffer.from(password);
  const expected = Buffer.from(ADMIN_PASSWORD);

  if (
    input.length !== expected.length ||
    !crypto.timingSafeEqual(input, expected)
  ) {
    return res.status(401).json({
      error: "Incorrect password."
    });
  }

  const token = createToken();

  res.json({
    success: true,
    token,
    message: "Login successful."
  });
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out."
  });
});

// CHECK SESSION
app.get("/api/session", requireLogin, (req, res) => {
  res.json({
    authenticated: true
  });
});

// LOAD POSTS
app.get("/api/posts", requireLogin, async (req, res) => {
  try {
    const response = await fetch(githubFileUrl, {
      headers: githubHeaders
    });

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const file = await response.json();

    const posts = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf8")
    );

    if (!Array.isArray(posts)) {
      throw new Error("Invalid posts.json format.");
    }

    res.json({ posts });

  } catch (error) {
    console.error("LOAD ERROR:", error.message);

    res.status(500).json({
      error: "Could not load posts from GitHub."
    });
  }
});

// PUBLISH POSTS
app.put("/api/posts", requireLogin, async (req, res) => {
  try {
    const posts = req.body?.posts;

    if (!Array.isArray(posts)) {
      return res.status(400).json({
        error: "Posts must be an array."
      });
    }

    for (const post of posts) {
      if (
        !post ||
        typeof post.id !== "string" ||
        typeof post.title !== "string" ||
        typeof post.category !== "string" ||
        typeof post.date !== "string" ||
        typeof post.author !== "string" ||
        !Array.isArray(post.content)
      ) {
        return res.status(400).json({
          error: "Invalid article fields."
        });
      }
    }

    const existingResponse = await fetch(githubFileUrl, {
      headers: githubHeaders
    });

    if (!existingResponse.ok) {
      throw new Error(
        `GitHub read failed: ${existingResponse.status}`
      );
    }

    const existingFile = await existingResponse.json();

    const content = Buffer.from(
      JSON.stringify(posts, null, 2),
      "utf8"
    ).toString("base64");

    const updateResponse = await fetch(githubFileUrl, {
      method: "PUT",
      headers: {
        ...githubHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Publish blog posts from Mandar Lekhani Admin",
        content,
        sha: existingFile.sha,
        branch: GITHUB_BRANCH
      })
    });

    const result = await updateResponse.json();

    if (!updateResponse.ok) {
      console.error("GITHUB ERROR:", result);

      throw new Error(
        "GitHub could not update posts.json."
      );
    }

    res.json({
      success: true,
      message: "Posts published successfully.",
      commit: result.commit?.sha
    });

  } catch (error) {
    console.error("PUBLISH ERROR:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Publisher API running on port ${PORT}`
  );
});
