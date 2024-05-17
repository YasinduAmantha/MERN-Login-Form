const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const collection = require("./config");

const app = express();

// Convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static("public"));

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if HTTPS is enabled
}));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobilenumber: req.body.mobilenumber,
        email: req.body.email,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/');
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            return res.send("User name cannot found");
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Wrong Password");
        } else {
            req.session.email = check.email;
            req.session.firstname = check.firstname;
            req.session.lastname = check.lastname;
            req.session.mobilenumber = check.mobilenumber;
            res.redirect("/home");
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong Details");
    }
});

app.get("/home", (req, res) => {
    if (!req.session.email) {
        return res.redirect("/");
    }
    res.render("home", {
        firstname: req.session.firstname,
        lastname: req.session.lastname,
        mobilenumber: req.session.mobilenumber
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
