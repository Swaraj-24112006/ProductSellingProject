const cartModel = require('../models/cart.model')

async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        // 1️⃣ Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // 2️⃣ Validate quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }

        // 3️⃣ Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 4️⃣ Find user's cart
        let cart = await cartModel.findOne({ userId });

        // 5️⃣ If cart does not exist, create one
        if (!cart) {
            cart = await cartModel.create({
                userId,
                items: [{ productId, quantity }]
            });

            return res.status(201).json({
                message: "Product added to cart",
                cart
            });
        }

        // 6️⃣ Check if product already exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            // 7️⃣ If exists, increase quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // 8️⃣ If not, add new product
            cart.items.push({ productId, quantity });
        }

        // 9️⃣ Save cart
        await cart.save();

        return res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {addToCart}