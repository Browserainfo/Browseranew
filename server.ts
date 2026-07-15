import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "leads_db.json");

// Default Staff and Admin accounts
const DEFAULT_STAFF = [
  { id: 'staff-1', name: 'John Doe', username: 'john', password: '123', avatar: 'JD', color: 'bg-indigo-100 text-indigo-700', role: 'staff' },
  { id: 'staff-2', name: 'Sarah Smith', username: 'sarah', password: '123', avatar: 'SS', color: 'bg-emerald-100 text-emerald-700', role: 'staff' },
  { id: 'staff-3', name: 'Michael Chen', username: 'michael', password: '123', avatar: 'MC', color: 'bg-amber-100 text-amber-700', role: 'staff' },
  { id: 'staff-4', name: 'Emily Davis', username: 'emily', password: '123', avatar: 'ED', color: 'bg-rose-100 text-rose-700', role: 'staff' },
];

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  name: "Super Admin",
  role: "admin"
};

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ 
    leads: [], 
    activities: [],
    staff: DEFAULT_STAFF,
    admin: DEFAULT_ADMIN
  }, null, 2));
}

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    // Ensure compatibility if old DB is missing fields
    if (!parsed.staff) parsed.staff = DEFAULT_STAFF;
    if (!parsed.admin) parsed.admin = DEFAULT_ADMIN;
    return parsed;
  } catch (err) {
    console.error("Error reading database file, returning default schema", err);
    return { leads: [], activities: [], staff: DEFAULT_STAFF, admin: DEFAULT_ADMIN };
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
  const { leads, activities, staff, settings } = req.body;
  if (!Array.isArray(leads) || !Array.isArray(activities)) {
    return res.status(400).json({ error: "Invalid data format" });
  }
  const db = readDB();
  db.leads = leads;
  db.activities = activities;
  if (Array.isArray(staff)) {
    db.staff = staff;
  }
  if (settings) {
    db.settings = settings;
  }
  writeDB(db);
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
