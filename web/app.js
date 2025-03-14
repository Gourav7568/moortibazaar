const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("dotenv").config();
const PORT = process.env.PORT || 8080; 

const connectDB = require("../server/db"); 
const Customer = require("../server/customerModel"); 

(async () => {
  try {
    await connectDB(); // Ensure DB is connected before handling requests
    console.log("✅ MongoDB connected before handling requests.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

// Set up Handlebars
app.set("views", path.join(__dirname, "../templets/views"));
app.set("view engine", "hbs");

// Register partials
hbs.registerPartials(path.join(__dirname, "../templets/partials"));

// Static Files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// Middleware to prevent long requests (timeout after 9s)
app.use((req, res, next) => {
  res.setTimeout(9000, () => {
    res.status(503).json({ error: "Server timeout. Try again later." });
  });
  next();
});

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
    
    // Set a timeout to prevent 504 errors
    const savePromise = newCustomer.save();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database save timeout")), 9000)
    );

    await Promise.race([savePromise, timeoutPromise]);

    const successMessage =
      '<script>alert("Thank you for your response"); window.history.back();</script>';
    res.status(200).send(successMessage);
  } catch (error) {
    console.error("❌ Error saving customer:", error);
    res.status(500).json({ error: "Database error or timeout. Try again later." });
  }
});

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("oops");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
