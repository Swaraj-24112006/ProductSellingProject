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

module.exports = { createProduct };