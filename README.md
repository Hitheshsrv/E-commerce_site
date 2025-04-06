PNBK FPV store

## Table of contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [Database Models](#database)
- [Color Palette](#colors)
- [License](#license)

## Introduction

A virtual ecommerce website using Node js, Express js, and Mongoose.

NOTE: Please read the RUN section before opening an issue.

## Demo

The website resembles a real store and you can add products to your cart and pay for them. The payment is processed using Razorpay. Please <u><b>DO NOT</b></u> provide real payment information during testing.

In order to access the admin panel on "/admin" you need to provide the admin email and password.

## Run

To run this application, you have to set your own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables with the help of dotenv package. Below are the variables that you need to set in order to run the application:

- MONGO_URI: this is the connection string of your MongoDB Atlas database.

- SESSION_SECRET: a secret message for the session. You can use any string here.

- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET: the Razorpay package is used to process payment in the checkout route. To get these, you should set up a Razorpay account and put your API keys here.

- GMAIL_EMAIL, GMAIL_PASSWORD: the email and password given to nodemailer to send/receive the email. Please put a real email and password here because you will receive the messages sent from the contact us form on this email.

- ADMIN_EMAIL, ADMIN_PASSWORD: the email and password used to log into the admin panel using AdminBro. You can put any email and password here.

- ADMIN_COOKIE_NAME, ADMIN_COOKIE_PASSWORD: the cookie name and password used in the AdminBro authentication method. You can put any strings here.

After you've set these environmental variables in the .env file at the root of the project, you need to navigate to the "seedDB" folder and run "node category-seed.js" and "node products-seed.js" to fill your empty MongoDB Atlas database.

Now you can run "npm start" in the terminal and the application should work.

## Technology

The application is built with:

- Node.js version 12.16.3
- MongoDB version 4.2.0
- Express version 4.16.1
- Bootstrap version 4.4.1
- FontAwesome version 5.13.0
- Razorpay API: used for payment in the checkout page
- Mapbox API: used to show the map in the about us page
- AdminBro: used and customized to implement the admin panel
- Nodemailer: used to send emails from the contact us form
- Passport: used for authentication
- Express Validator: used for form validation

## Features

The application displays a virtual bags store that contains virtual products and contact information.

Users can do the following:

- Create an account, login or logout
- Browse available products added by the admin
- Add products to the shopping cart
- Delete products from the shopping cart
- Display the shopping cart
- To checkout, a user must be logged in
- Checkout information is processed using Razorpay and the payment is send to the admin
- The profile contains all the orders a user has made

Admins can do the following:

- Login or logout to the admin panel
- View all the information stored in the database. They can view/add/edit/delete orders, users, products and categories. The cart model cannot be modified by an admin because a cart is either modified by the logged in user before the purchase or deleted after the purchase.

## Database

All the models can be found in the models directory created using mongoose.

### User Schema:

- username (String)
- email (String)
- password (String)

### Category Schema:

- title (String)
- slug (String)

### Product Schema:

- productCode (String)
- title (String)
- imagePath (String)
- description (String)
- price (Number)
- category (ObjectId - a reference to the category schema)
- manufacturer (String)
- available (Boolean)
- createdAt (Date)

### Cart Schema:

- items (Array of items)
- totalQty (Number)
- totalCost (Number)
- user (ObjectId - a reference to the user schema)

### Order Schema:

- user (ObjectId - a reference to the user schema)
- cart (Object containing items, totalQty, and totalCost)
- address (String)
- paymentId (String)
- createdAt (Date)
- Delivered (Boolean)

## Colors

The application uses a specific color palette:

- Dark Blue: #1a237e
- Light Blue: #478ba2
- Dark Orange: #e9765b
- Green: #b6e3d4
- Ivory: #f8f1e9
- Black: #1a1a1a


