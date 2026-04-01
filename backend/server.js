const express = require("express")
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express()

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/images", express.static("public/images"));


app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/referral", require("./routes/referralRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});
