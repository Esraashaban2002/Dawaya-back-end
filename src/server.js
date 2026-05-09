const app = require("./app");
const connection = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

connection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});