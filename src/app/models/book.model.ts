import { model, Schema } from "mongoose";
import {
  BookInstanceMethods,
  BookModel,
  IBook,
} from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, BookModel, BookInstanceMethods>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "{VALUE} is not supported.",
      },
      uppercase: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: [true, "Duplicate ISBN book number"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },

    copies: {
      type: Number,
      required: [true, "Copies count is required"],
      min: [0, "Copies cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Instance method to check availability
bookSchema.methods.canBorrow = function (quantity: number): boolean {
  return this.available && this.copies >= quantity ? true : false;
};

// Static method to handle borrowing
bookSchema.statics.borrowBook = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) throw new Error("Book not found");

  if (!book.canBorrow(quantity)) {
    throw new Error("Not enough copies available");
  }

  book.copies -= quantity;
  if (book.copies === 0) {
    book.available = false;
  }

  await book.save();
  return book;
};

export const Book = model<IBook, BookModel>("Book", bookSchema);
