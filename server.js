import express from "express";
import router from "./route/index";

const cors = require('cors');
const port = 1245;
const app = express();

app.use(cors({
  origin: '*', // Allow all origins (you can restrict this later)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/", router);
app.listen(port, () => {
  console.log(`Server is running and listening on http://localhost:${port}`);
});

module.exports = app;
