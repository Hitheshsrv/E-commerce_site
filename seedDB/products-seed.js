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
    // First, delete all existing categories and products
    console.log("Deleting existing categories and products...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("All existing categories and products deleted!");

    // Create categories
    console.log("Creating categories...");
    const categories = await Category.create([
      {
        title: "Batteries",
        description: "High-performance drone batteries",
        imageUrl: "/images/batteries.jpg"
      },
      {
        title: "Drones",
        description: "Ready-to-fly and custom drones",
        imageUrl: "/images/drones.jpg"
      },
      {
        title: "Electronics",
        description: "Flight controllers, ESCs, and other electronics",
        imageUrl: "/images/electronics.jpg"
      },
      {
        title: "Frames",
        description: "Drone frames and accessories",
        imageUrl: "/images/frames.jpg"
      },
      {
        title: "Motors & Propellers",
        description: "High-performance motors and propellers",
        imageUrl: "/images/motors-propellers.jpg"
      },
      {
        title: "Radios & Receivers",
        description: "Radio transmitters and receivers",
        imageUrl: "/images/radios-receivers.jpg"
      },
      {
        title: "VTXs & Goggles",
        description: "Video transmitters and FPV goggles",
        imageUrl: "/images/vtxs-goggles.jpg"
      }
    ]);
    console.log("Categories created successfully!");

    // Get categories after they've been created
    console.log("Fetching updated categories...");
    const categoriesList = await Category.find({});
    if (categoriesList.length === 0) {
      throw new Error("No categories found! Run category-seed.js first.");
    }
    console.log(`Found ${categoriesList.length} categories`);
    
    // Function to find category by title
    const findCategoryByTitle = (title) => {
      return categoriesList.find(cat => cat.title === title);
    };

    // Products data
    console.log("Adding new products...");
    const products = [
      // Drones Category
      {
        productCode: generateProductCode(),
        title: "iFlight Nazgul5 V3 HD",
        description: "Professional 5-inch freestyle drone with DJI O3 digital FPV system. Perfect for aerial cinematography and freestyle flying.",
        imagePath: "https://i.imgur.com/RTABFSI.jpeg",
        price: 499.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "BETAFPV Beta75X HD Whoop",
        description: "Ultralight 3S HD Digital VTX drone with 75mm wheelbase, perfect for indoor flying.",
        imagePath: "https://i.imgur.com/rWoqGNH.jpeg",
        price: 249.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Flywoo Firefly Baby Quad",
        description: "Compact 80mm micro quadcopter with HD camera system.",
        imagePath: "https://i.imgur.com/zE4ygpm.jpeg",
        price: 199.99,
        category: findCategoryByTitle("Drones"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "TBS Source One V5",
        description: "Open source 5-inch freestyle frame with optimal weight distribution.",
        imagePath: "https://i.imgur.com/SKU5g0T.jpeg",
        price: 49.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "ImpulseRC Apex Frame",
        description: "Premium 5-inch frame designed for HD digital FPV systems.",
        imagePath: "https://i.imgur.com/XcBlvUs.jpeg",
        price: 89.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Armattan Marmotte Frame",
        description: "Durable 5-inch freestyle frame with lifetime warranty.",
        imagePath: "https://i.imgur.com/tkEdfk0.jpeg",
        price: 94.99,
        category: findCategoryByTitle("Frames"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "DJI Goggles 2",
        description: "High-performance digital FPV goggles with ultra-low latency HD transmission.",
        imagePath: "https://i.imgur.com/92hALbc.png",
        price: 649.99,
        category: findCategoryByTitle("VTXs & Goggles"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Skyzone SKY04X Pro",
        description: "OLED display analog goggles with 1920x1080 resolution and SteadyView receiver.",
        imagePath: "https://i.imgur.com/ERCgl4x.jpeg",
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
        imagePath: "https://i.imgur.com/Alb5ZjK.jpeg",
        price: 79.99,
        category: findCategoryByTitle("Electronics"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "DJI O3 Air Unit",
        description: "Digital HD FPV transmission system with ultra-low latency.",
        imagePath: "https://i.imgur.com/S01lhF0.jpeg",
        price: 229.99,
        category: findCategoryByTitle("Electronics"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "XING-E 2207 Motor",
        description: "High-performance 2750KV brushless motor for freestyle.",
        imagePath: "https://i.imgur.com/ZhuzsVa.jpeg",
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
        imagePath: "https://i.imgur.com/Neq48vy.jpeg",
        price: 21.99,
        category: findCategoryByTitle("Motors & Propellers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "Tattu R-Line 6S 1300mAh",
        description: "High-discharge LiPo battery for maximum performance.",
        imagePath: "https://i.imgur.com/oTKx7Or.jpeg",
        price: 44.99,
        category: findCategoryByTitle("Batteries"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "CNHL Black Series 4S",
        description: "Reliable 1500mAh LiPo with 100C discharge rate.",
        imagePath: "https://i.imgur.com/EfPkVaF.jpeg",
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
        imagePath: "https://i.imgur.com/QFDUOl2.jpeg",
        price: 199.99,
        category: findCategoryByTitle("Radios & Receivers"),
        available: true,
        createdAt: Date.now()
      },
      {
        productCode: generateProductCode(),
        title: "TBS Crossfire Nano",
        description: "Long-range RC receiver with reliable connection.",
        imagePath: "https://i.imgur.com/7q6qK8P.jpeg",
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
