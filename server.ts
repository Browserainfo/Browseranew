import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "leads_db.json");

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ leads: [], activities: [] }, null, 2));
}

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, returning default schema", err);
    return { leads: [], activities: [] };
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

app.use(express.json());

// API Routes
app.get("/api/leads-data", (req, res) => {
  const db = readDB();
  res.json(db);
});

app.post("/api/leads-data", (req, res) => {
  const { leads, activities } = req.body;
  if (!Array.isArray(leads) || !Array.isArray(activities)) {
    return res.status(400).json({ error: "Invalid data format" });
  }
  writeDB({ leads, activities });
  res.json({ success: true });
});

// Vite Integration middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-Stack CRM Server running on http://localhost:${PORT}`);
  });
}

setupVite();
