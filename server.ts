import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Garrett Ranking Statistical Processing Endpoint
  // (Simulating Cloud Functions for heavy processing if needed)
  app.post("/api/process-garrett", (req, res) => {
    const { factors, rankings } = req.body;
    
    // Garrett Ranking Logic
    // 1. Calculate Percent Position for each rank
    // 2. Map Percent Position to Garrett Value (using a lookup table or approximation)
    // 3. Calculate Mean Score for each factor
    
    // For now, we'll return a placeholder or implement a basic version
    // In a real app, we'd use a more robust statistical library or a large lookup table
    
    res.json({ message: "Processing successful", results: {} });
  });

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
