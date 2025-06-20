import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { ClientSession } from "mongoose";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  let session: ClientSession | null = null;

  try {
    const { book: bookId, quantity, dueDate } = req.body;

    if (!bookId || !quantity || !dueDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
      return;
    }

    session = await Book.startSession();
    session.startTransaction();

    const borrowData = await Borrow.create(
      [
        {
          book: bookId,
          quantity,
          dueDate: new Date(dueDate),
        },
      ],
      { session }
    );

    await Book.borrowBook(bookId, quantity);

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowData,
    });
  } catch (error: any) {
    console.log(error);

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    res.status(500).json({
      success: false,
      message: error.messgae || "Failed to borrow book",
      error,
    });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const result = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "working",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to borrow book",
      error,
    });
  }
});
