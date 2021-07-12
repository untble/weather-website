const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlesbars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup directory to serve
app.use(express.static(publicDirectory));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Vitalii Dvorskyi",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Vitalli Dvorskyi",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Vitalli Dvorskyi",
  });
});

app.get("/weather", (request, response) => {
  if (!request.query.address) {
    return response.send({
      error: "No address is provided",
    });
  }

  geocode(
    request.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return response.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return response.send({ error });
        }

        response.send({
          forecast: forecastData,
          location,
          address: request.query.address,
        });
      });
    }
  );

  
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    errorMessage: "Help article not found!",
    title: "404",
    name: "Vitalli Dvorskyi",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    errorMessage: "Page not found",
    title: "404",
    name: "Vitalli Dvorskyi",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
