const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Category = require("../models/category");
const mongoose = require("mongoose");
const connectDB = require("./../config/db");
connectDB();

async function seedDB() {
  try {
    // First, delete all existing categories
    console.log("Deleting existing categories...");
    await Category.deleteMany({});
    console.log("All existing categories deleted!");

    async function seedCateg(titleStr) {
      try {
        const categ = await new Category({ title: titleStr });
        await categ.save();
        console.log(`Added category: ${titleStr}`);
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    async function closeDB() {
      console.log("CLOSING CONNECTION");
      await mongoose.disconnect();
    }

    // Seed new drone-related categories
    console.log("Adding new categories...");
    await seedCateg("Drones");
    await seedCateg("Frames");
    await seedCateg("VTXs & Goggles");
    await seedCateg("Electronics");
    await seedCateg("Motors & Propellers");
    await seedCateg("Batteries");
    await seedCateg("Radios & Receivers");
    await seedCateg("More");
    
    console.log("All categories added successfully!");
    await closeDB();
  } catch (error) {
    console.log("Error seeding categories:", error);
    await mongoose.disconnect();
  }
}

seedDB();
