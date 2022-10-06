const express = require("express");
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const getUserByEmail = require('./helpers');

const app = express();
const PORT = 8080;
const urlIdLength = 6;
const userIdLength = 4;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieSession({
  name: 'session',
  keys: ['n456efsa']
}))


const generateRandomString = (length) => {
  let randNum = Math.random();
  let string = randNum.toString(36);
  return string.slice(2, length + 2);
};

const filterUrlsBy = (id) => {
  const output = {};
  
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      output[url] = urlDatabase[url];
    }
  }

  return output;
};


const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "asd123",
  },
  "9sm5xK": {
    longURL: "https://www.google.ca",
    userID: "asd123",
  },
};


// Test user for development; still contains plain text password
const users = {
  asd123: {
    id: "asd123",
    email: "c@rud.ca",
    password: bcrypt.hashSync("1234"),
  },
};
 



/*  /login  &  /logout  */

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);

  if (!user) {
    return res.status(403).send('Invalid email and/or password');
  }
  
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(403).send('Invalid email and/or password');
  }

  req.session.user_id = (user.id);
  res.redirect('/urls');
});


app.get('/login', (req, res) => {

  if (req.session.user_id) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('login', templateVars);
});





/*  /urls_new  */

app.get('/urls/new', (req, res) => {

  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render('urls_new', templateVars);
});






/*  /urls/:id  */


app.post('/urls/:id/delete', (req, res) => {

  if (!urlDatabase[req.params.id]) {
    return res.send('Requested TinyURL does not exist\n');
  }

  if (!req.session.user_id) {
    return res.send('You must be logged in to delete this TinyURL\n');
  }

  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send('You are not the owner of this TinyURL\n');
  }

  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete];
  res.redirect('/urls');
});


// Route to edit existing TinyURL
app.post('/urls/:id', (req, res) => {

  if (!urlDatabase[req.params.id]) {
    return res.send('Requested TinyURL does not exist\n');
  }

  if (!req.session.user_id) {
    return res.send('You must be logged in to edit this TinyURL\n');
  }

  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send('You are not the owner of this TinyURL\n');
  }

  urlDatabase[req.params.id].longURL = req.body.newLongURL;
  res.redirect('/urls');
});


app.get('/urls/:id', (req, res) => {
  
  const templateVars = {
    id: req.params.id,
    urlOwner: urlDatabase[req.params.id].userID,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id],
  };

  res.render('urls_show', templateVars);
});






/*  /u/:id  */

app.get('/u/:id', (req, res) => {

  if (!(req.params.id in urlDatabase)) {
    return res.send('Requested TinyURL does not exist');
  }

  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});





/*  /urls.json   */

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});





/*  /register  */

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Please provide a valid email and password');
  }
  
  if (getUserByEmail(req.body.email, users))  {
    return res.status(400).send('Email already in use');
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const newId = generateRandomString(userIdLength);
  users[newId] = {
    id: newId,
    email: req.body.email,
    password: hashedPassword,
  };

  req.session.user_id = (newId);
  res.redirect('/urls');
});

app.get('/register', (req, res) => {

  if (req.session.user_id) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('register', templateVars);
});





/*  /urls  */
// Route for create new button
app.post('/urls', (req, res) => {
  
  if (!req.session.user_id) {
    return res.send('You must be logged in to create a TinyURL\n');
  }
  
  const newID = generateRandomString(urlIdLength);

  urlDatabase[newID] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };

  const templateVars = {
    id: newID,
    urlOwner: req.session.user_id,
    longURL: req.body.longURL,
    user: users[req.session.user_id],
  };
  res.render('urls_show', templateVars);
});


app.get("/urls", (req, res) => {

  const filteredUrlDb = filterUrlsBy(req.session.user_id);

  const templateVars = {
    urls: filteredUrlDb,
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});







/*  /hello  */

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
  res.send("Hello");
});







app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});