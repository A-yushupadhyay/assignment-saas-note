"use client";

import { useState, useEffect } from "react";
import UpgradeButton from "./upgrade-button";
import Navbar from "./navbar";
import { motion } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchNotes() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("fetchNotes error:", data);
        setNotes([]);
        if (res.status === 403) setLimitReached(true);
        return;
      }

      // ✅ normalize so id, title, content are always strings
      if (Array.isArray(data)) {
        const normalized: Note[] = data.map(
          (n: { id?: string; _id?: string; title?: string; content?: string }) => ({
            id: n.id || n._id || "",
            title: n.title || "",
            content: n.content || "",
          })
        );
        setNotes(normalized);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Network error fetching notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!newNote.trim()) {
      alert("Note cannot be empty");
      return;
    }

    const firstLine = newNote.split("\n")[0].trim();
    const title =
      firstLine ? firstLine.slice(0, 50) : newNote.slice(0, 50) || "Untitled Note";

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content: newNote }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 403) {
          setLimitReached(true);
          alert(data.error || "Free plan limit reached");
          return;
        }

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        console.error("addNote server error:", data);
        alert(data.error || "Failed to add note");
        return;
      }

      setNewNote("");
      await fetchNotes();
    } catch (err: unknown) {
      console.error("Network error while adding note:", err);
      alert("Network error. Check server terminal for details.");
    }
  }

  async function deleteNote(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("deleteNote error:", data);
        alert(data.error || "Failed to delete note");
        return;
      }

      await fetchNotes();
    } catch (err) {
      console.error("Network error deleting note:", err);
      alert("Network error. Check server terminal for details.");
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        📒 Your Notes
      </motion.h1>

      {limitReached && (
        <div className="mb-6">
          <p className="text-red-600 font-medium mb-2">
            You’ve reached the free plan limit.
          </p>
          <UpgradeButton />
        </div>
      )}

      <form onSubmit={addNote} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-5 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          Add
        </motion.button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Start writing!</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <motion.li
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div>
                <div className="font-medium text-gray-800 truncate max-w-xs">
                  {note.title || note.content}
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
