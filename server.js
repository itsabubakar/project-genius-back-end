import express from "express";
import router from "./route/index";

const port = 1245;
const app = express();

app.use(express.json());
app.use("/", router);
app.listen(port, () => {
  console.log(`Server is running and listening on http://localhost:${port}`);
});

module.exports = app;
