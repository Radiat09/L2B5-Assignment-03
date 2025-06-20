import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
export const bookRoutes = express.Router();

// *1. Create Book
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const book = req.body;

    const result = await Book.create(book);

    res.status(200).json({
      succes: true,
      message: "Book created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Book creation failed!",
      error,
    });
  }
});

// *2. Get All Books
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { filter, sortBy, sort = "asc", limit } = req.query;

    const query: any = {};

    if (filter) {
      query.genre = filter;
    }

    const sortDirection = sort === "asc" ? 1 : -1;

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortDirection;

    const data = await Book.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Book retrivation failed!",
      error,
    });
  }
});

// *3. Get Book by ID
bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const data = await Book.findById(bookId).exec();

    if (!data || data === null) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Book retrievation failed!",
      error,
    });
  }
});

// *4. Update Book
bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updateBody = req.body;

    const data = await Book.findByIdAndUpdate(bookId, updateBody, {
      new: true,
    });

    if (!data || data === null) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Book updating failed!",
      error,
    });
  }
});

// *5. Delete Book
bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const data = await Book.findByIdAndDelete(bookId);

    if (!data || data === null) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Book deleting failed!",
      error,
    });
  }
});
