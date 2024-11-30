const express = require("express");
require('dotenv').config()
const ejs = require("ejs");
const app = express();
const cookiParser = require("cookie-parser");
const path = require("path");
app.set("view engine", "ejs");
const port = process.env.PORT;

const connection = require("./Connection/db");
const movieRoutes = require("./Controller/routes.movie");
const userRoutes = require("./Controller/routes.auth")
const movieModel = require("./Model/model.movie");

app.use(express.urlencoded({ extended: true }))

app.use(express.json());
app.use(cookiParser());

app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/movie", movieRoutes);
app.use("/auth", userRoutes);

app.get('/', async (req, res) => {
    let allMovies = await movieModel.find();
    console.log(allMovies);
    res.render("home", {
        movies: allMovies
    });
})

app.listen(port, async () => {
    try {
        await connection;
        console.log("Server is Running at port ", port);
    } catch (error) {
        console.log("Something Went Wrong ", error);
    }
})