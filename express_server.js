const express = require("express");
const morgan = require('morgan');
const app = express();
const PORT = 8080;
const shortIdLength = 6;

function generateRandomString(length) {
  let randNum = Math.random();
  let string = randNum.toString(36);
  return string.slice(2, length + 2);
};


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "asdasd": "http://www.example.com/"
};





app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect('/urls');
});



app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete];
  res.redirect('/urls');
});


// Route to create new TinyURL
app.post('/urls', (req, res) => {
  const newID = generateRandomString(shortIdLength);
  urlDatabase[newID] = req.body.longURL;

  const templateVars = { id: newID, longURL: req.body.longURL };
  res.render('urls_show', templateVars);
});


app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});


app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/", (req, res) => {
  res.send("Hello");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});