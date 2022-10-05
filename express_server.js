const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
const shortIdLength = 6;
const userIdLength = 4;

function generateRandomString(length) {
  let randNum = Math.random();
  let string = randNum.toString(36);
  return string.slice(2, length + 2);
};

const checkUserByEmail = (email) => {
  for (user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
  return null;
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "asdasd": "http://www.example.com/"
};

const users = {
  qwe123: {
    id: "qwe123",
    email: "v@rad.ca",
    password: "vrad",
  },
  asd123: {
    id: "asd123",
    email: "c@rud.ca",
    password: "crud",
  },
};
 



/*  /login  &  /logout  */


app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// WILL NEED UPDATING USERNAME COOKIE NO LONGER USED -------------------------------
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});




/*  /urls/:id  */

app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect('/urls');
});





/*  /u/:id  */


app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});



/*  /urls_new  */

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    user: users[req.cookies.user_id], 
  };
  res.render('urls_show', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



/*  /register  */

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Please provide a valid email and password');
  }
  
  if (checkUserByEmail(req.body.email))  {
    return res.status(400).send('Email already in use');
  }

  const newId = generateRandomString(userIdLength);
  users[newId] = {
    id: newId,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie('user_id', newId);
  res.redirect('/urls'); 
});

app.get('/register', (req, res) => {
  res.render('register');
});



/*  /urls  */

// Route to create new TinyURL
app.post('/urls', (req, res) => {
  const newID = generateRandomString(shortIdLength);
  urlDatabase[newID] = req.body.longURL;
  const templateVars = { id: newID, 
    longURL: req.body.longURL, 
    user: users[req.cookies.user_id], 
  };
  res.render('urls_show', templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies.user_id],     
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
  console.log(`Example app listening on port ${PORT}`);
});