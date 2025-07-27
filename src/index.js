const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { PORT } = require("./utils/secrets/secrets.js");
const { errorMiddleware } = require("./middlewares/error/error.middleware.js");
const { all_routers } = require("./routes/index.js");
const { connectDB } = require("./utils/configs/config.db.js");

const app = express();
void connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Welcome to the Vocabulary Project Backend!");
});

all_routers.forEach(({ path, router }) => {
  app.use(path, router);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
