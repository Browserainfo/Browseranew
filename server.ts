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

// Enable CORS middleware so external websites can submit leads directly
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// API Routes
app.get("/api/leads-data", (req, res) => {
  const db = readDB();
  res.json(db);
});

// Website Form Integration endpoint (Receives direct submissions from external public website)
app.post("/api/submit-lead", (req, res) => {
  const { name, phone, email, notes, source } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required to submit a lead." });
  }

  const db = readDB();
  const leadId = `lead-${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  const newLead = {
    id: leadId,
    name: name.trim(),
    phone: phone ? phone.trim() : "",
    email: email ? email.trim() : "",
    source: source ? source.trim() : "Website Form",
    status: "new",
    notes: notes ? notes.trim() : "Prospect registered directly via online website form integration.",
    followUpDate: "",
    createdBy: "Website Integration",
    updatedBy: "Website Integration",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const newActivity = {
    id: `act-${Date.now()}`,
    leadId: leadId,
    leadName: name.trim(),
    staffName: "Website Integration",
    action: "create",
    details: `Prospect lead submitted directly from website form (Channel: ${newLead.source})`,
    date: new Date().toISOString().split("T")[0],
    timestamp: timestamp
  };

  db.leads = [newLead, ...db.leads];
  db.activities = [newActivity, ...db.activities];
  writeDB(db);

  res.json({ success: true, leadId: leadId });
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
