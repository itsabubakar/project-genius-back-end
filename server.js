import express from "express";
import router from "./route/index";

const cors = require('cors');
const PORT = process.env.PORT || 1245;
const app = express();

app.use(cors({
  origin: '*', // Allow all origins (you can restrict this later) 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH',  'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // Handle preflight requests

app.use(express.json());

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});

module.exports = app;

