var generateName = require("sillyname");

const generateUsername = () => {
  const min = 10;
  const max = 99;
  const number = Math.floor(Math.random() * (max - min + 1)) + min;
  const username = generateName().replace(" ", "_") + number;
  return username;
};

export default generateUsername;