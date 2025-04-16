import express from "express";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Project from "../models/project.js";
import CustomProjectRequest from "../models/custom-project-request.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Register the mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Create admin instance with custom configuration
const admin = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: {
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  password: await bcrypt.hash(request.payload.password, 10),
                };
              }
              return request;
            },
          },
        },
      },
    },
    Product,
    Order,
    Project,
    CustomProjectRequest,
  ],
  branding: {
    companyName: "ElectroHub Admin",
    logo: false,
  },
  locale: {
    language: "en",
    translations: {
      labels: {
        User: "Users",
        Product: "Products",
        Order: "Orders",
        Project: "Projects",
        CustomProjectRequest: "Custom Project Requests",
      },
    },
  },
});

// Create router with authentication
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (user && user.isAdmin) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: process.env.ADMIN_COOKIE_SECRET || "default-secret",
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

// Mount admin routes
router.use(admin.options.rootPath, adminRouter);

export default router;