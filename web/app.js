const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("dotenv").config();
const PORT = process.env.PORT || 8080; 

const connectDB = require("../server/db"); 
const Customer = require("../server/customerModel"); 

// Connect to MongoDB before handling requests
connectDB();

// Set up Handlebars
app.set("views", path.join(__dirname, "../templets/views"));
app.set("view engine", "hbs");

// Register partials
hbs.registerPartials(path.join(__dirname, "../templets/partials"));

// Static Files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/detail", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Incomplete data provided" });
    }

    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();

    const successMessage =
      '<script>alert("Thank you for your response"); window.history.back();</script>';
    res.status(200).send(successMessage);
  } catch (error) {
    console.error("Error saving customer:", error);
    const errorMessage =
      '<script>alert("An error occurred while saving the customer"); window.history.back();</script>';
    res.status(500).send(errorMessage);
  }
});

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("oops");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
