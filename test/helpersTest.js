const { assert } = require('chai');
const { getUserByEmail, generateRandomString, filterUrlsBy } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "asd123",
  },
  "9sm5xK": {
    longURL: "https://www.google.ca",
    userID: "qwe456",
  },
};


describe('getUserByEmail', function() {
  
  it('should return a user that matches email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it('should return null if no users match email', function () {
    const user = getUserByEmail("not@registered.com", testUsers)
    const expectedUser = null;
    assert.strictEqual(user, expectedUser);
  })

  it('should return null if passed an invalid email', function () {
    const user = getUserByEmail("", testUsers)
    const expectedUser = null;
    assert.strictEqual(user, expectedUser);
  })

});

describe('generateRandomString', function() {
  
  it('should return a random string of correct length', function() {
    const expectedLength = 8;
    const length = generateRandomString(8).length;
    assert.strictEqual(length, expectedLength);
  });

});

describe('filterUrlsBy', function() {
  
  it('should return only url objects that match the user id', function() {
    const expectedUrl = {
      "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "asd123",
      }
    };
    const url = filterUrlsBy('asd123', urlDatabase);
    assert.deepEqual(url, expectedUrl);
  });

  it('should return an empty object if no urls match the user id', function() {
    const expectedUrl = {};
    const url = filterUrlsBy('asd12', urlDatabase);
    assert.deepEqual(url, expectedUrl);
  });

});

