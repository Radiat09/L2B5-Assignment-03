import { Model, model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.pre("save", function () {
  if (this.quantity <= 0) {
    throw new Error("Quantity must be at least 1");
  }
});

export const Borrow: Model<IBorrow> = model<IBorrow>("Borrow", borrowSchema);
