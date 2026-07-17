const { port } = require("./src/config/env");
const connectDatabase = require("./src/config/database");
const app = require("./src/app");

connectDatabase();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
