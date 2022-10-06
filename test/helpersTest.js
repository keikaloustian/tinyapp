const { assert } = require('chai');
const { getUserByEmail } = require('../helpers');

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