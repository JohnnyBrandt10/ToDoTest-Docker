import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Erreur DB:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Le titre est requis" });
    }
    const [result] = await pool.query(
      "INSERT INTO tasks (title, done) VALUES (?, false)",
      [title]
    );
    res.status(201).json({ id: (result as any).insertId, title, done: false });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de la tâche" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { done } = req.body;
    await pool.query("UPDATE tasks SET done = ? WHERE id = ?", [done, req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;