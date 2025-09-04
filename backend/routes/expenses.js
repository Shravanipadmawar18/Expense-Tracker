const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();

/**
 * Get all categories
 */
router.get("/categories", authenticateToken, (req, res) => {
  db.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

/**
 * Add new expense
 */
router.post("/", authenticateToken, (req, res) => {
  const { category_id, amount, description, expense_date } = req.body;
  
  if (!category_id || !amount || !expense_date) {
    return res
      .status(400)
      .json({ message: "category_id, amount, and expense_date are required" });
  }

  const sql = `
    INSERT INTO expenses (user_id, category_id, amount, description, expense_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [req.user.user_id, category_id, amount, description || "", expense_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({ message: "Expense added", expense_id: result.insertId });
    }
  );
});

/**
 * Get expenses (with filters: from, to, category_id, q)
 */
router.get("/", authenticateToken, (req, res) => {
  const { from, to, category_id, q } = req.query;

  let sql = `
    SELECT e.expense_id, e.user_id, e.category_id, c.category_name,
           e.amount, e.description, e.expense_date
    FROM expenses e
    JOIN categories c ON e.category_id = c.category_id
    WHERE e.user_id = ?
  `;

  const params = [req.user.user_id];

  if (from) {
    sql += " AND e.expense_date >= ?";
    params.push(from);
  }
  if (to) {
    sql += " AND e.expense_date <= ?";
    params.push(to);
  }
  if (category_id) {
    sql += " AND e.category_id = ?";
    params.push(category_id);
  }
  if (q) {
    sql += " AND e.description LIKE ?";
    params.push(`%${q}%`);
  }

  sql += " ORDER BY e.expense_date DESC, e.expense_id DESC";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

/**
 * Update expense
 */
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { category_id, amount, description, expense_date } = req.body;

  const sql = `
    UPDATE expenses
    SET category_id = ?, amount = ?, description = ?, expense_date = ?
    WHERE expense_id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [category_id, amount, description || "", expense_date, id, req.user.user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Expense not found" });
      res.json({ message: "Expense updated" });
    }
  );
});

/**
 * Delete expense
 */
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM expenses WHERE expense_id = ? AND user_id = ?",
    [id, req.user.user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Expense not found" });
      res.json({ message: "Expense deleted" });
    }
  );
});

module.exports = router;
