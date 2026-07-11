"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  let ignore = false;

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      if (!ignore) {
        setTasks(data);
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  };

  loadTasks();

  return () => {
    ignore = true;
  };
}, []);

  const refreshTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

 const addTask = async () => {
  if (!title.trim()) return;
  setError("");
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error();
    setTitle("");
    refreshTasks();
  } catch (err) {
    console.error("Erreur ajout:", err);
    setError("Impossible d'ajouter la tâche, réessaie.");
  }
};

  const toggleTask = async (id: number, done: boolean) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    refreshTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    refreshTasks();
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6">📝 Todo App</h1>

      <div className="flex gap-2 mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between py-2">
            <span
              onClick={() => toggleTask(task.id, task.done)}
              className={`cursor-pointer ${
                task.done ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}