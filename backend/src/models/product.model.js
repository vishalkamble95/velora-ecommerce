import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      default: null,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value) {
          return value === null || value <= this.price;
        },
        message: "Discount price cannot exceed product price",
      },
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },

    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
      maxlength: 100,
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product owner is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Product search index
productSchema.index({
  name: "text",
  description: "text",
});

// Category and price filtering index
productSchema.index({
  category: 1,
  price: 1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
