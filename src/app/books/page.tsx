"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, BookOpen, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

export default function BooksPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", totalPages: "" });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({});
  const [bookToDelete, setBookToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/books").then((r) => r.json()).then((d) => {
      if (d.success) setBooks(d.books);
      setLoading(false);
    });
  }, []);

  const addBook = async () => {
    if (isSubmitting || !form.title.trim() || !form.totalPages) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          totalPages: Number(form.totalPages)
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) => [...prev, data.book]);
        setForm({ title: "", totalPages: "" });
        setShowAdd(false);
      }
    } catch (err) {
      console.error("Error adding book:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePage = async (bookId: string) => {
    const newPage = pageInputs[bookId];
    if (!newPage) return;
    const res = await fetch("/api/books", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, currentPage: Number(newPage) }),
    });
    const data = await res.json();
    if (data.success) {
      setBooks((prev) => prev.map((b) => b._id === bookId ? data.book : b));
      setUpdatingId(null);
      setPageInputs((prev) => { const n = { ...prev }; delete n[bookId]; return n; });
    }
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/books?id=${bookToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
        setBookToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete book:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Long press handlers
  const handlePressStart = (book: any) => {
    timerRef.current = setTimeout(() => {
      setBookToDelete(book);
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">📖 Book Tracker</h1>
          <p className="text-muted-foreground text-sm">Read at least one page every single day. <span className="hidden sm:inline italic text-xs">(Long-press card to delete)</span></p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Book
        </button>
      </header>

      {/* Delete Confirmation Dialog */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/40 p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center glass">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">Delete Duplicate/Unwanted Book?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{bookToDelete.title}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDeleteBook}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
              </button>
              <button
                onClick={() => setBookToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 glass border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <Card className="glass mb-6 border-primary/30">
          <CardHeader><CardTitle className="text-lg">Add New Book</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Book Title</label>
              <input
                placeholder="e.g. Spoken English"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Total Pages</label>
              <input
                type="number"
                placeholder="e.g. 350"
                value={form.totalPages}
                onChange={(e) => setForm({ ...form, totalPages: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addBook}
                disabled={isSubmitting || !form.title.trim() || !form.totalPages}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Add Book"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 glass border border-primary/20 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {books.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <BookOpen size={48} className="text-primary/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No books yet</h2>
          <p className="text-muted-foreground mb-4">Add your first book to start tracking your reading journey!</p>
          <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold">Add Your First Book</button>
        </div>
      ) : (
        <div className="space-y-5">
          {books.map((book) => {
            const pct = Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100);
            return (
              <Card
                key={book._id}
                onTouchStart={() => handlePressStart(book)}
                onTouchEnd={handlePressEnd}
                onMouseDown={() => handlePressStart(book)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                className="glass shadow-sm border-primary/20 transition-all select-none hover:border-primary/40 relative group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Page {book.currentPage} of {book.totalPages}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${pct === 100 ? "bg-emerald-500" : "bg-primary/20 text-primary"} text-sm px-3 py-1`}>
                        {pct === 100 ? "✅ Finished!" : `${pct}%`}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookToDelete(book);
                        }}
                        title="Delete Book"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <Progress value={pct} className="h-3 mb-4" />

                  {pct < 100 && (
                    updatingId === book._id ? (
                      <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          placeholder={`Current page (max ${book.totalPages})`}
                          value={pageInputs[book._id] || ""}
                          onChange={(e) => setPageInputs({ ...pageInputs, [book._id]: e.target.value })}
                          className="flex-1 glass border border-primary/20 rounded-xl px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50"
                        />
                        <button onClick={() => updatePage(book._id)} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold">Save</button>
                        <button onClick={() => setUpdatingId(null)} className="px-3 py-2 glass border border-primary/20 rounded-xl text-sm">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUpdatingId(book._id);
                        }}
                        className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mt-1"
                      >
                        Update progress <ChevronRight size={14} />
                      </button>
                    )
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-10 italic">
        "Read one page a day. One page is better than none." 📖
      </p>
    </div>
  );
}

