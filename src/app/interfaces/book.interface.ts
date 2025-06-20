import { Model } from "mongoose";

export enum BookGenre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

export interface IBook {
  title: string;
  author: string;
  genre: BookGenre;
  isbn: string;
  description?: string;
  copies: number;
  available?: boolean;
}

export interface BookInstanceMethods {
  canBorrow(quantity: number): boolean;
}

export interface BookStaticMethods {
  borrowBook(bookId: string, quantity: number): Promise<IBook>;
}

export type BookModel = Model<IBook, {}, BookInstanceMethods> &
  BookStaticMethods;
