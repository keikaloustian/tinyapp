const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return null;
};

const generateRandomString = (length) => {
  let randNum = Math.random();
  let string = randNum.toString(36);
  return string.slice(2, length + 2);
};

const filterUrlsBy = (id, database) => {
  const output = {};
  for (let url in database) {
    if (id === database[url].userID) {
      output[url] = database[url];
    }
  }
  return output;
};


module.exports = { getUserByEmail, generateRandomString, filterUrlsBy };