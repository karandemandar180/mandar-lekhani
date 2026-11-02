const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3000;

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

const COOKIE_NAME = "mandar_publisher_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  if (origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

function createSession() {
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

function verifySession(token) {
  if (!token || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");

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
      Buffer.from(payload, "base64url").toString()
    );

    return data.exp > Date.now();
  } catch {
    return false;
  }
}

function requireLogin(req, res, next) {
  const cookies = req.headers.cookie || "";

  const sessionCookie = cookies
    .split(";")
    .map(item => item.trim())
    .find(item => item.startsWith(COOKIE_NAME + "="));

  const token = sessionCookie
    ? decodeURIComponent(sessionCookie.split("=").slice(1).join("="))
    : "";

  if (!verifySession(token)) {
    return res.status(401).json({ error: "Please login first." });
  }

  next();
}

const githubHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
};

const githubFileUrl =
  `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/posts.json`;

app.get("/", (req, res) => {
  res.json({ status: "Mandar Lekhani Publisher API is running." });
});

app.post("/api/login", (req, res) => {
  const password = req.body?.password;

  if (
    typeof password !== "string" ||
    password.length !== ADMIN_PASSWORD.length ||
    !crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(ADMIN_PASSWORD)
    )
  ) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const session = createSession();

  res.cookie(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/"
  });

  res.json({ success: true, message: "Login successful." });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  res.json({ success: true });
});

app.get("/api/session", requireLogin, (req, res) => {
  res.json({ authenticated: true });
});

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

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load posts from GitHub." });
  }
});

app.put("/api/posts", requireLogin, async (req, res) => {
  try {
    const posts = req.body;

    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: "Posts must be an array." });
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
          error: "One or more articles have invalid fields."
        });
      }
    }

    const existingResponse = await fetch(githubFileUrl, {
      headers: githubHeaders
    });

    if (!existingResponse.ok) {
      throw new Error("Could not read existing posts.json from GitHub.");
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
      console.error(result);
      throw new Error("GitHub could not update posts.json.");
    }

    res.json({
      success: true,
      message: "Posts published to GitHub. Render auto-deploy will start.",
      commit: result.commit?.sha
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Publisher API running on port ${PORT}`);
});
