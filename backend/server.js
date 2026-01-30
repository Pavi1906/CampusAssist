const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CampusAssist backend running" });
});

// Emergency endpoint (mock)
app.post("/api/emergency", (req, res) => {
  res.json({
    status: "Emergency received",
    timestamp: new Date().toISOString(),
    payload: req.body
  });
});

// Assistance endpoint (mock)
app.post("/api/assistance", (req, res) => {
  res.json({
    status: "Request logged",
    timestamp: new Date().toISOString(),
    payload: req.body
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

