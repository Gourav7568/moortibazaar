const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();
const PORT = process.env.PORT || 8080;

const Customer = require('../server/db');

// Paths for directories
const viewsPath = path.join(__dirname, '../templets/views');
const partialsPath = path.join(__dirname, '../templets/partials');
const publicPath = path.join(__dirname, '../public');

// Set view engine and paths
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Middleware for static files
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/detail', async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(400).json({ error: 'Incomplete data provided' });
    }

    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    await newCustomer.save();
    const successMessage =
      '<script>alert("Thank you for your response"); window.history.back();</script>';
    res.status(200).send(successMessage);
  } catch (error) {
    console.error('Error saving customer:', error);
    const errorMessage =
      '<script>alert("An error occurred while saving the customer"); window.history.back();</script>';
    res.status(500).send(errorMessage);
  }
});

// Catch-all for undefined routes (404 handler)
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for could not be found.',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
