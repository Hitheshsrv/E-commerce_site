const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')
const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Category = require("../models/category");

AdminJS.registerAdapter(AdminJSMongoose)

const express = require("express");
const app = express();

const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    companyName: "BestBags",
    logo: "/images/shop-icon.png",
    favicon: "/images/shop-icon.png"
  },
  resources: [
    {
      resource: Product,
      options: {
        navigation: {
          name: "Admin Content",
          icon: "Inventory"
        },
        properties: {
          description: {
            type: "richtext",
            isVisible: { list: false, filter: true, show: true, edit: true }
          },
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          title: {
            isTitle: true
          },
          price: {
            type: "number"
          },
          imagePath: {
            isVisible: { list: false, filter: false, show: true, edit: true }
          }
        }
      }
    },
    {
      resource: User,
      options: {
        navigation: {
          name: "User Content",
          icon: "User"
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          username: {
            isTitle: true
          }
        }
      }
    },
    {
      resource: Order,
      options: {
        navigation: {
          name: "User Content",
          icon: "User"
        },
        properties: {
          user: {
            isTitle: true
          },
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          paymentId: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          address: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false }
          },
          cart: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: Category,
      options: {
        navigation: {
          name: "Admin Content",
          icon: "Categories"
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          slug: {
            isVisible: { list: false, filter: false, show: false, edit: false }
          },
          title: {
            isTitle: true
          }
        }
      }
    }
  ],
  locale: {
    translations: {
      labels: {
        loginWelcome: "Admin Panel Login"
      },
      messages: {
        loginWelcome: "Please enter your credentials to log in and manage your website contents"
      }
    }
  }
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD
};

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN;
    }
    return null;
  },
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD
});

module.exports = router;
