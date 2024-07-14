const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

let guess = [];

let requestCount = 0;



function getRandIntYo(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // Maths to make each end of the range inclusive of the given integer!
}

let randomInt = getRandIntYo(0, 25);
console.log(randomInt);


// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({ extended: true })); // used to set up parser, will parse through incoming requests essentially in req.body, data expected from HTML form

app.use(express.json()); // needed for parsing!!!

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static("server/public"));

// GET & POST Routes go here

app.get("/randint", (req, res) => {
  res.json({randomInt}); // send random int to our client yo
});

app.get("/guess", (req, res) => {
  console.log(`Guesses retrieved, total reqs: ${requestCount} times`);
  res.send(guess);
});

app.get("/count", (req, res) => {
  res.json({ count: requestCount });
});

app.post("/guess", (req, res) => {
  const newItem = req.body; // make body be parsed with json

  guess.push(newItem);
  requestCount++;
  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
