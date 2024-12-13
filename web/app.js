const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
require("dotenv").config();
const Port = process.env.Port || 8080;

const Customer = require('../server/db');
const { now } = require('mongoose');
const { error } = require('console');

app.set('views', path.join(__dirname, '../templets/views'));
app.set('view engine', 'hbs');
app.set('templets', path.join(__dirname, '../templets'));

const pathreg = path.join(__dirname, '../templets/partials');
const staticpath = path.join(__dirname, '../public');

app.use('/photos', express.static('photos'));
app.use(express.static(staticpath));
app.use(express.urlencoded({ extended: true }));
app.use((req, res) => {
  res.status(404).render('404')
}); 

hbs.registerPartials(pathreg)

app.get("/", (req, res) => {
    res.render("index");
});


app.get("/about", (req, res) => {
    res.render("about");
});

app.post('/detail', async(req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.phone) {
            // Check if any of the required fields are missing
            return res.status(400).json({ error: 'Incomplete data provided' });
          }
 
        const newCustomer = new Customer({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        });
    
        // Save the new customer to the database
        await newCustomer.save();
        
        // Optionally, you can send a response back to the client
        const successMessage = '<script>alert("Thank you for your response"); window.history.back();</script>';
        res.status(200).send(successMessage);
      } catch (error) {
        console.error("Error saving customer:", error);
        
        // Handle the error and send an appropriate response
        const errorMessage = '<script>alert("An error occurred while saving the customer"); window.history.back();</script>';
        res.status(500).send(errorMessage);
      }
})
// app.get("/viewcart",(req,res)=>{

// })
app.get('*', (req, res) => {
    res.status(404).render(
        'oops')
});

app.listen(Port, () => {
    console.log(`server is listening on port ${Port}`);
});

