const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const { uploadImage } = require("../services/imagekit.service");
const { validationResult } = require('express-validator');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const createProduct = [
    upload.array('images', 7), // Allow up to 10 images
    async (req, res) => {
        try {
            // Check validation errors
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return res.status(400).json({ errors: errors.array() });
            // }

            const { title, description, currency } = req.body;
            const seller = req.user.id; // Assuming auth middleware sets req.user

            let images = [];
            if (req.files && req.files.length > 0) {
                // Upload each image to ImageKit
                for (const file of req.files) {
                    const uploaded = await uploadImage({
                        buffer: file.buffer,
                        fileName: file.originalname,
                        folder: '/products'
                    });
                    images.push(uploaded);
                }
            }

            // Create product
            const product = new productModel({
                title,
                description,
                currency,
                seller,
                images
            });

            await product.save();

            res.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

async function getProducts(req, res) {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

    const filter = {};

    if (q) {
        filter.$text = { $search: q };
    }

    if (minprice) {
        filter['price.amout'] = { ...filter['price.amout'], $gte: Number(minprice) }
    }

    if (maxprice) {
        filter['price.amout'] = { ...filter['price.amout'], $lte: Number(maxprice) }
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Number(limit));

    return res.status(201).json({ data: products })

}

async function getproductbyid(req, res) {
    const id = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "No Product found"
        })
    }

    return res.status(201).json({ product: product })
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        // 1️⃣ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // 2️⃣ Find product that belongs to the logged-in seller
        const product = await productModel.findOne({
            _id: id,
            seller: req.user.id
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        // 3️⃣ Allowed fields to update (currency added)
        const allowedUpdates = ['title', 'description', 'price', 'currency'];

        // 4️⃣ Pick only allowed fields from req.body
        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // 5️⃣ Check if there is something valid to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        // 6️⃣ Apply updates
        Object.assign(product, updates);

        // 7️⃣ Save (schema validation will run, including enum for currency)
        await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        // 1️⃣ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // 2️⃣ Find and delete product owned by the logged-in seller
        const product = await productModel.findOneAndDelete({
            _id: id,
            seller: req.user.id
        });

        // 3️⃣ If product not found or user not owner
        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized"
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            message: "Product deleted successfully",
            deletedProductId: product._id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getMyProducts(req, res) {
    try {
        const sellerId = req.user.id;

        // 1️⃣ Fetch all products created by the logged-in seller
        const products = await productModel.find({
            seller: sellerId
        }).sort({ createdAt: -1 }); // latest first (optional)

        // 2️⃣ If no products found
        if (!products || products.length === 0) {
            return res.status(200).json({
                message: "No products found",
                products: []
            });
        }

        // 3️⃣ Success response
        return res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = { createProduct, getProducts, getproductbyid , updateProduct , deleteProduct, getMyProducts};