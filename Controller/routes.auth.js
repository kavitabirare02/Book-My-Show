const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../Model/model.user");
const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
    res.render("login");
})
authRoutes.get("/signup", (req, res) => {
    res.render("signup");
})

// REGISTER

authRoutes.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        // Hash the password
        const hashpassword = await bcrypt.hash(password, 3); // Use 10 rounds for better security

        // Create a new user
        const newUser = new user({ name, email, password: hashpassword });

        // Save the new user
        await newUser.save();

        // Send a success response
        res.status(201).json({ msg: "User registered successfully" });

    } catch (error) {
        console.log("User can not added ", error);
    }
})

// LOGIN

authRoutes.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, loginpassword } = req.body;
    const checkuser = await user.findOne({ email });
    console.log(checkuser);
    if (!checkuser) {
        res.status(400).json({ msg: "wrong credentials" })
    } else {
        const matchedPass = await bcrypt.compare(loginpassword, checkuser.password);
        if (matchedPass) {
            let token = jwt.sign({ course: "node" }, "node");
            console.log(token, "token");
            res.status(401).json({ msg: "Login Succesfull" });
        } else {
            res.status(200).json({ msg: "Invalid Password" });
        }
    }
    res.status(201).json({ msg: "User Login successfully" });
})

module.exports = authRoutes;

