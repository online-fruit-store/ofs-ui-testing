const express = require("express");
import routes from "./routes";
const app = express();

app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
