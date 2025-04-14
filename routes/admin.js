const express = require("express");
const router = express.Router();
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const Project = require("../models/project");
const CustomProjectRequest = require("../models/custom-project-request");
const nodemailer = require("nodemailer");

(async () => {
  // Dynamically import AdminJS
  const AdminJS = (await import("adminjs")).default;

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
})();

module.exports = router;
