const express = require("express");
const csrf = require("csurf");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middleware = require("../middleware");
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CSRF protection
const csrfProtection = csrf();
router.use(csrfProtection);

// Error handling for CSRF
router.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Invalid form submission');
    return res.redirect('back');
  }
  next(err);
});

// GET: home page
router.get("/", async (req, res) => {
  try {
    const perPage = 8;
    let page = parseInt(req.query.page) || 1;
    
    // First ensure we have default categories
    const categories = await Category.find({}).sort({ title: 1 });
    if (categories.length === 0) {
      const defaultCategories = [
        { title: "Electronics" },
        { title: "Clothing" },
        { title: "Home & Living" }
      ];
      
      for (const cat of defaultCategories) {
        const category = new Category(cat);
        await category.save();
      }
    }

    // Now fetch products and updated categories with pagination
    const products = await Product.find({})
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");
    
    const count = await Product.countDocuments();
    const pages = Math.ceil(count / perPage);
    
    const updatedCategories = await Category.find({}).sort({ title: 1 });
    
    

    res.render("shop/index", { 
      pageName: "Home", 
      products: products || [], 
      categories: updatedCategories,
      successMsg: req.flash("success"),
      errorMsg: req.flash("error"),
      current: page,
      pages: pages,
      home: "/?"
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error loading products');
    res.redirect("/");
  }
});

// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/add-to-cart/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    // add the product to the cart
    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item
      cart.items.push({
        productId: productId,
        qty: 1,
        price: product.price,
        title: product.title,
        productCode: product.productCode,
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }

    // if the user is logged in, store the user's id and save cart to the db
    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: view shopping cart contents
router.get("/shopping-cart", async (req, res) => {
  try {
    // find the cart, whether in session or in db based on the user state
    let cart_user;
    if (req.user) {
      cart_user = await Cart.findOne({ user: req.user._id });
    }
    // if user is signed in and has cart, load user's cart from the db
    if (req.user && cart_user) {
      req.session.cart = cart_user;
      return res.render("shop/shopping-cart", {
        cart: cart_user,
        pageName: "Shopping Cart",
        products: await productsFromCart(cart_user),
        csrfToken: req.csrfToken()
      });
    }
    // if there is no cart in session and user is not logged in, cart is empty
    if (!req.session.cart) {
      return res.render("shop/shopping-cart", {
        cart: null,
        pageName: "Shopping Cart",
        products: null,
        csrfToken: req.csrfToken()
      });
    }
    // otherwise, load the session's cart
    return res.render("shop/shopping-cart", {
      cart: req.session.cart,
      pageName: "Shopping Cart",
      products: await productsFromCart(req.session.cart),
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: reduce one from an item in the shopping cart
router.get("/reduce/:id", async function (req, res, next) {
  // if a user is logged in, reduce from the user's cart and save
  // else reduce from the session's cart
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }

    // find the item with productId
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      // find the product to find its price
      const product = await Product.findById(productId);
      // if product is found, reduce its qty
      cart.items[itemIndex].qty--;
      cart.items[itemIndex].price -= product.price;
      cart.totalQty--;
      cart.totalCost -= product.price;
      // if the item's qty reaches 0, remove it from the cart
      if (cart.items[itemIndex].qty <= 0) {
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
      req.session.cart = cart;
      //save the cart it only if user is logged in
      if (req.user) {
        await cart.save();
      }
      //delete cart if qty is 0
      if (cart.totalQty <= 0) {
        req.session.cart = null;
        await Cart.findByIdAndRemove(cart._id);
      }
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: remove all instances of a single product from the cart
router.get("/removeAll/:id", async function (req, res, next) {
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }
    //fnd the item with productId
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      //find the product to find its price
      cart.totalQty -= cart.items[itemIndex].qty;
      cart.totalCost -= cart.items[itemIndex].price;
      await cart.items.remove({ _id: cart.items[itemIndex]._id });
    }
    req.session.cart = cart;
    //save the cart it only if user is logged in
    if (req.user) {
      await cart.save();
    }
    //delete cart if qty is 0
    if (cart.totalQty <= 0) {
      req.session.cart = null;
      await Cart.findByIdAndRemove(cart._id);
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: checkout form with csrf token
router.get("/checkout", middleware.isLoggedIn, async (req, res) => {
  const errorMsg = req.flash("error")[0];

  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  //load the cart with the session's cart's id from the db
  cart = await Cart.findById(req.session.cart._id);

  const errMsg = req.flash("error")[0];
  res.render("shop/checkout", {
    total: cart.totalCost,
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Checkout",
  });
});

// POST: handle checkout logic and payment using Razorpay
router.post("/checkout", middleware.isLoggedIn, async (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = await Cart.findById(req.session.cart._id);

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: cart.totalCost * 100, // Amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // Send order details to client
    res.json({
      key_id: process.env.RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create payment order");
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST: verify Razorpay payment
router.post("/payment/verify", middleware.isLoggedIn, async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    address
  } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Shipping address is required" });
  }

  // Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    try {
      // Get cart and create order
      const cart = await Cart.findById(req.session.cart._id);
      const order = new Order({
        user: req.user,
        cart: {
          totalQty: cart.totalQty,
          totalCost: cart.totalCost,
          items: cart.items,
        },
        address: address, // Use the address from the request
        paymentId: razorpay_payment_id,
      });

      await order.save();
      await Cart.findByIdAndDelete(cart._id);
      req.flash("success", "Successfully purchased");
      req.session.cart = null;
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process order" });
    }
  } else {
    res.status(400).json({ error: "Invalid payment signature" });
  }
});

// create products array to store the info of each product in the cart
async function productsFromCart(cart) {
  let products = []; // array of objects
  for (const item of cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}

// B2B Client Portal
router.get("/b2b", async (req, res) => {
  try {
    res.render("pages/b2b", {
      pageName: "B2B Client Portal",
      successMsg: req.flash("success")[0],
      errorMsg: req.flash("error")[0],
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Custom Projects
router.get("/custom-projects", async (req, res) => {
  try {
    res.render("pages/custom-projects", {
      pageName: "Custom Projects",
      successMsg: req.flash("success")[0],
      errorMsg: req.flash("error")[0],
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
// Helper function to validate payment signature
function validatePaymentSignature(razorpay_signature, sign) {
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");
  return razorpay_signature === expectedSign;
}

// Helper function to process order
async function processOrder(req, cart, razorpay_payment_id) {
  const order = new Order({
    user: req.user,
    cart: {
      totalQty: cart.totalQty,
      totalCost: cart.totalCost, 
      items: cart.items
    },
    address: req.body.address,
    paymentId: razorpay_payment_id
  });

  await order.save();
  await cart.save();
  await Cart.findByIdAndDelete(cart._id);
  req.flash("success", "Successfully purchased");
  req.session.cart = null;
}
