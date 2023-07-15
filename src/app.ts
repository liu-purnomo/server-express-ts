if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares";
import router from "./routers";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
