const express = require("express")
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express()

app.use(cors());
app.use(express.json());

app.use("/images", express.static("public/images"));


app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/referral", require("./routes/referralRoutes"));

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});