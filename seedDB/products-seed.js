const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const connectDB = require("./../config/db");

// Function to generate a random product code
function generateProductCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
         Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function seedDB() {
  try {
    // First, delete all existing products
    console.log("Deleting existing products...");
    await Product.deleteMany({});
    console.log("All existing products deleted!");

    // Get categories after they've been updated
    console.log("Fetching updated categories...");
    const categories = await Category.find({});
    if (categories.length === 0) {
      throw new Error("No categories found! Run category-seed.js first.");
    }
    console.log(`Found ${categories.length} categories`);
    
    // Function to find category by title
    const findCategoryByTitle = (title) => {
      return categories.find(cat => cat.title === title);
    };

    // Products data
    console.log("Adding new products...");
    const products = [
      // Drones Category
      {
        productCode: generateProductCode(),
        title: "iFlight Nazgul5 V3 HD",
        description: "Professional 5-inch freestyle drone with DJI O3 digital FPV system. Perfect for aerial cinematography and freestyle flying.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/iflight-nazgul5-v3-5-6s-w-dji-o3-hd-camera-system_1_700x.jpg",
        price: 499.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "BETAFPV Beta75X HD Whoop",
        description: "Ultralight 3S HD Digital VTX drone with 75mm wheelbase, perfect for indoor flying.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/betafpv-beta75x-2-3s-brushless-whoop-micro-drone-frsky_1_700x.jpg",
        price: 249.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Flywoo Firefly Baby Quad",
        description: "Compact 80mm micro quadcopter with HD camera system.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/flywoo-firefly-1-6inch-4s-micro-quad-analog_1_700x.jpg",
        price: 199.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "TBS Source One V5",
        description: "Open source 5-inch freestyle frame with optimal weight distribution.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/tbs-source-one-v3-5in-frame-kit_1_700x.jpg",
        price: 49.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "ImpulseRC Apex Frame",
        description: "Premium 5-inch frame designed for HD digital FPV systems.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/impulserc-apex-5-freestyle-frame_1_700x.jpg",
        price: 89.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Armattan Marmotte Frame",
        description: "Durable 5-inch freestyle frame with lifetime warranty.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/armattan-marmotte-5-fpv-frame_1_700x.jpg",
        price: 94.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "DJI Goggles 2",
        description: "High-performance digital FPV goggles with ultra-low latency HD transmission.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/files/DJI_Goggles_2_700x.jpg",
        price: 649.99,
        category: findCategoryByTitle("VTXs & Goggles"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Skyzone SKY04X Pro",
        description: "OLED display analog goggles with 1920x1080 resolution and SteadyView receiver.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/skyzone-sky04x-pro-oled-diversity-fpv-goggles_1_700x.jpg",
        price: 499.99,
        category: findCategoryByTitle("VTXs & Goggles"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "TBS Unify Pro32 DP",
        description: "High-quality video transmitter with MMCX connector and smart audio.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/tbs-unify-pro32-nano-5g8-video-transmitter_1_700x.jpg",
        price: 39.99,
        category: findCategoryByTitle("VTXs & Goggles"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "SucceX-E F7 FC",
        description: "Advanced F7 flight controller with OSD and Blackbox logging.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/iflight-succex-e-f7-twing-flight-controller_1_700x.jpg",
        price: 59.99,
        category: findCategoryByTitle("Electronics"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "SucceX 45A 4-in-1 ESC",
        description: "BLHeli_32 4-in-1 ESC for optimal motor control.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/iflight-succex-e-45a-4-in-1-esc_1_700x.jpg",
        price: 79.99,
        category: findCategoryByTitle("Electronics"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "DJI O3 Air Unit",
        description: "Digital HD FPV transmission system with ultra-low latency.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/files/DJI_O3_Air_Unit_700x.jpg",
        price: 229.99,
        category: findCategoryByTitle("Electronics"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "XING-E 2207 Motor",
        description: "High-performance 2750KV brushless motor for freestyle.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/iflight-xing-e-2207-fpv-motor_1_700x.jpg",
        price: 24.99,
        category: findCategoryByTitle("Motors & Propellers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "HQProp ETHiX S3",
        description: "Durable and efficient 5-inch tri-blade props.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/ethix-s3-watermelon-props_1_700x.jpg",
        price: 3.99,
        category: findCategoryByTitle("Motors & Propellers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "T-Motor F40 Pro",
        description: "Premium 2400KV motor for racing and freestyle.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/t-motor-f40-pro-motor_1_700x.jpg",
        price: 21.99,
        category: findCategoryByTitle("Motors & Propellers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Tattu R-Line 6S 1300mAh",
        description: "High-discharge LiPo battery for maximum performance.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/tattu-r-line-version-3-0-1300mah-6s-120c-lipo-battery_1_700x.jpg",
        price: 44.99,
        category: findCategoryByTitle("Batteries"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "CNHL Black Series 4S",
        description: "Reliable 1500mAh LiPo with 100C discharge rate.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/cnhl-black-series-1500mah-4s-100c-lipo-battery_1_700x.jpg",
        price: 29.99,
        category: findCategoryByTitle("Batteries"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "GNB 6S 1100mAh",
        description: "Lightweight racing LiPo with high voltage stability.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/gnb-6s-1100mah-130c-lipo-battery_1_700x.jpg",
        price: 32.99,
        category: findCategoryByTitle("Batteries"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "RadioMaster TX16S MKII",
        description: "Multi-protocol radio with Hall sensor gimbals and color display.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/radiomaster-tx16s-mark-ii-radio-controller_1_700x.jpg",
        price: 199.99,
        category: findCategoryByTitle("Radios & Receivers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "TBS Crossfire Nano",
        description: "Long-range RC receiver with reliable connection.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/tbs-crossfire-nano-rx_1_700x.jpg",
        price: 29.99,
        category: findCategoryByTitle("Radios & Receivers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "ExpressLRS EP2 RX",
        description: "High-performance 2.4GHz RC receiver system.",
        imagePath: "https://cdn.shopify.com/s/files/1/0027/2708/4144/products/betafpv-elrs-ep2-rx_1_700x.jpg",
        price: 19.99,
        category: findCategoryByTitle("Radios & Receivers"),
        available: true,
        createdAt: Date.now()
      }
    ];

    // Insert all products
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} products!`);
    
    await mongoose.disconnect();
    console.log("Database connection closed.");
    
  } catch (error) {
    console.log("Error seeding products:", error);
    await mongoose.disconnect();
  }
}

// Connect to database and run seeder
console.log("Connecting to database...");
connectDB().then(() => {
  seedDB();
});
