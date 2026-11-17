require("dotenv").config();

const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// READ: Get all gym members
app.get("/api/members", (req, res) => {
  const sql = "SELECT * FROM members ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ message: "Could not retrieve members." });
    }
    res.json(results);
  });
});

// CREATE: Add a new gym member
app.post("/api/members", (req, res) => {
  const { name, email, phone, membership_type, join_date, status } = req.body;

  if (!name || !email || !phone || !membership_type || !join_date || !status) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  const sql = `
    INSERT INTO members (name, email, phone, membership_type, join_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, membership_type, join_date, status], (err, result) => {
    if (err) {
      console.error("Create error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "This email address is already registered." });
      }
      return res.status(500).json({ message: "Could not add member." });
    }
    res.status(201).json({ message: "Member added successfully.", id: result.insertId });
  });
});

// UPDATE: Edit an existing gym member
app.put("/api/members/:id", (req, res) => {
  const { name, email, phone, membership_type, join_date, status } = req.body;
  const { id } = req.params;

  if (!name || !email || !phone || !membership_type || !join_date || !status) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  const sql = `
    UPDATE members
    SET name = ?, email = ?, phone = ?, membership_type = ?, join_date = ?, status = ?
    WHERE id = ?
  `;

  db.query(sql, [name, email, phone, membership_type, join_date, status, id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "This email address is already registered." });
      }
      return res.status(500).json({ message: "Could not update member." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found." });
    }
    res.json({ message: "Member updated successfully." });
  });
});

// DELETE: Remove a gym member
app.delete("/api/members/:id", (req, res) => {
  db.query("DELETE FROM members WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Could not delete member." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found." });
    }
    res.json({ message: "Member deleted successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`Gym Member Management is running at http://localhost:${PORT}`);
});
