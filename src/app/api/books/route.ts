import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Book from "@/models/Book";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const books = await Book.find({ user: user._id });
  return NextResponse.json({ success: true, books });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const { title, totalPages } = await req.json();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const book = await Book.create({ user: user._id, title, totalPages: Number(totalPages), currentPage: 0 });
  return NextResponse.json({ success: true, book });
}

export async function PUT(req: Request) {
  await connectToDatabase();
  const { bookId, currentPage } = await req.json();
  const book = await Book.findByIdAndUpdate(bookId, { currentPage: Number(currentPage) }, { new: true });
  return NextResponse.json({ success: true, book });
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  let bookId = searchParams.get("id");
  if (!bookId) {
    try {
      const body = await req.json();
      bookId = body.bookId;
    } catch {}
  }
  if (!bookId) return NextResponse.json({ error: "Book ID required" }, { status: 400 });

  await Book.findByIdAndDelete(bookId);
  return NextResponse.json({ success: true, deletedId: bookId });
}
