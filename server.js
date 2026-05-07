const express = require("express");
const cors = require("cors");
const productRouter = require("./routers/product.routes");
const authRouter = require("./routers/auth.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json);

//// Router  ////
app.use(productRouter);
app.use(authRouter);

app.listen(PORT);
