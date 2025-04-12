const express = require("express");
const csrf = require("csurf");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middleware = require("../middleware");
const Project = require('../models/project');
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
    
    const categories = await Category.find({}).sort('title');
    const products = await Product.find({})
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");
    
    const count = await Product.countDocuments();
    const pages = Math.ceil(count / perPage);
    
    res.render("shop/index", { 
      pageName: "Home", 
      products,
      categories,
      successMsg: req.flash("success"),
      errorMsg: req.flash("error"),
      current: page,
      pages: pages,
      home: "/?",
      searchTerm: '',
      currentCategory: null,
      login: req.isAuthenticated(),
      session: req.session
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error loading products');
    res.redirect("/");
  }
});

// GET: add a product to the shopping cart
router.get("/add-to-cart/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if ((req.user && !user_cart && req.session.cart) || (!req.user && req.session.cart)) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
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

    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    
    res.json({
      success: true,
      totalQty: cart.totalQty,
      message: "Item added to the shopping cart"
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart"
    });
  }
});

// GET: view shopping cart
router.get("/shopping-cart", async (req, res) => {
  try {
    let cart_user;
    if (req.user) {
      cart_user = await Cart.findOne({ user: req.user._id });
    }
    if (req.user && cart_user) {
      req.session.cart = cart_user;
      return res.render("shop/shopping-cart", {
        cart: cart_user,
        pageName: "Shopping Cart",
        products: await productsFromCart(cart_user),
        csrfToken: req.csrfToken()
      });
    }
    if (!req.session.cart) {
      return res.render("shop/shopping-cart", {
        cart: null,
        pageName: "Shopping Cart",
        products: null,
        csrfToken: req.csrfToken()
      });
    }
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

// GET: checkout
router.get("/checkout", middleware.isLoggedIn, async (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  cart = await Cart.findById(req.session.cart._id);

  res.render("shop/checkout", {
    total: cart.totalCost,
    csrfToken: req.csrfToken(),
    errorMsg: req.flash("error")[0],
    pageName: "Checkout",
  });
});

// POST: handle checkout
router.post("/checkout", middleware.isLoggedIn, async (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = await Cart.findById(req.session.cart._id);

  try {
    const order = await razorpay.orders.create({
      amount: cart.totalCost * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

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

// POST: verify payment
router.post("/payment/verify", middleware.isLoggedIn, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Shipping address is required" });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    try {
      const cart = await Cart.findById(req.session.cart._id);
      const order = new Order({
        user: req.user,
        cart: {
          totalQty: cart.totalQty,
          totalCost: cart.totalCost,
          items: cart.items,
        },
        address: address,
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

// Projects Section
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({}).sort("-createdAt");
    res.render("shop/projects", {
      pageName: "Projects & Kits",
      projects,
      successMsg: req.flash("success")[0],
      errorMsg: req.flash("error")[0],
      login: req.isAuthenticated(),
      session: req.session
    });
  } catch (error) {
    console.log('Error in projects route:', error);
    res.redirect("/");
  }
});

// Get project details
router.get("/projects/:projectCode", async (req, res) => {
  try {
    const project = await Project.findOne({ projectCode: req.params.projectCode });
    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect("/projects");
    }

    res.render("shop/project-details", {
      pageName: project.title,
      project,
      successMsg: req.flash("success")[0],
      errorMsg: req.flash("error")[0],
      login: req.isAuthenticated(),
      session: req.session
    });
  } catch (error) {
    console.log('Error in project details route:', error);
    res.redirect("/projects");
  }
});

// Add project to cart
router.get("/add-to-cart/project/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if ((req.user && !user_cart && req.session.cart) || (!req.user && req.session.cart)) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    const project = await Project.findById(projectId);
    const itemIndex = cart.items.findIndex((p) => p.productId == projectId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * project.price;
      cart.totalQty++;
      cart.totalCost += project.price;
    } else {
      cart.items.push({
        productId: projectId,
        qty: 1,
        price: project.price,
        title: project.title,
        productCode: project.projectCode,
      });
      cart.totalQty++;
      cart.totalCost += project.price;
    }

    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    
    req.flash("success", "Item added to the shopping cart");
    res.redirect("/projects");
  } catch (err) {
    console.log(err.message);
    req.flash("error", err.message);
    res.redirect("/projects");
  }
});

// Helper function to get products from cart
async function productsFromCart(cart) {
  let products = [];
  for (const item of cart.items) {
    let foundProduct = (await Product.findById(item.productId).populate("category")).toObject();
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}

module.exports = router;
