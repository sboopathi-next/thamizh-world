"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, BookOpen, ChevronRight } from "lucide-react";

export default function BooksPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", totalPages: "" });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/books").then((r) => r.json()).then((d) => {
      if (d.success) setBooks(d.books);
      setLoading(false);
    });
  }, []);

  const addBook = async () => {
    if (!form.title || !form.totalPages) return;
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { setBooks((prev) => [...prev, data.book]); setForm({ title: "", totalPages: "" }); setShowAdd(false); }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">📖 Book Tracker</h1>
          <p className="text-muted-foreground">Read at least one page every single day.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Book
        </button>
      </header>

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
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Total Pages</label>
              <input
                type="number"
                placeholder="e.g. 350"
                value={form.totalPages}
                onChange={(e) => setForm({ ...form, totalPages: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={addBook} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90">Add Book</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 glass border border-primary/20 rounded-xl text-sm">Cancel</button>
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
              <Card key={book._id} className="glass shadow-sm border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Page {book.currentPage} of {book.totalPages}</p>
                    </div>
                    <Badge className={`${pct === 100 ? "bg-emerald-500" : "bg-primary/20 text-primary"} text-sm px-3 py-1`}>
                      {pct === 100 ? "✅ Finished!" : `${pct}%`}
                    </Badge>
                  </div>

                  <Progress value={pct} className="h-3 mb-4" />

                  {pct < 100 && (
                    updatingId === book._id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          placeholder={`Current page (max ${book.totalPages})`}
                          value={pageInputs[book._id] || ""}
                          onChange={(e) => setPageInputs({ ...pageInputs, [book._id]: e.target.value })}
                          className="flex-1 glass border border-primary/20 rounded-xl px-3 py-2 text-sm bg-white/50"
                        />
                        <button onClick={() => updatePage(book._id)} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold">Save</button>
                        <button onClick={() => setUpdatingId(null)} className="px-3 py-2 glass border border-primary/20 rounded-xl text-sm">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setUpdatingId(book._id)}
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
