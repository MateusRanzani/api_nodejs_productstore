const express = require("express");
const productsRoute = require("./routes/productsRoute.tsx");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/products", productsRoute);

app.listen(4001, () => console.log("Connect server on por 4001"));
