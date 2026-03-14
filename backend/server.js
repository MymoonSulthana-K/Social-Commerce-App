const express = require("express")
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express()

app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

app.use("/images", express.static("public/images"));

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});