const cartModel = require('../models/cart.model')

async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        

        // Find user's cart
        let cart = await cartModel.findOne({ userId });

        // If cart does not exist, create one
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

        //  Check if product already exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            //  If exists, increase quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            //  If not, add new product
            cart.items.push({ productId, quantity });
        }

        // Save cart
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

async function updateCartItemQuantity(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        //  Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        //  Validate quantity
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer"
            });
        }

        //  Find user's cart
        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        //  Find item in cart
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        //  If quantity is 0 → remove product from cart
        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            //  Otherwise update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        //  Save cart
        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getMyCart(req, res) {
    try {
        const userId = req.user.id;

        //  Find cart for logged-in user
        const cart = await cartModel
            .findOne({ userId })
            .populate({
                path: 'items.productId',
                select: 'title price currency images'
            });

        // If cart does not exist
        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                items: []
            });
        }

        // Return cart items
        return res.status(200).json({
            cartId: cart._id,
            totalItems: cart.items.length,
            items: cart.items,
            updatedAt: cart.updatedAt
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function removeFromCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // 1️⃣ Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // 2️⃣ Find user's cart
        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // 3️⃣ Check if product exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // 4️⃣ Remove product from cart
        cart.items.splice(itemIndex, 1);

        // 5️⃣ Save updated cart
        await cart.save();

        return res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function clearCart(req, res) {
    try {
        const userId = req.user.id;

        // 1️⃣ Find user's cart
        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // 2️⃣ Clear all items
        cart.items = [];

        // 3️⃣ Save cart
        await cart.save();

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {addToCart,updateCartItemQuantity,getMyCart,removeFromCart,clearCart}