const express = require("express")
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express()

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/api/health", async (req, res) => {
    try {
        await connectDB();
        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({
            message: `Database connection failed: ${error.message}`,
        });
    }
});

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/referral", require("./routes/referralRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(5000, () => {
                console.log("Server running on port 5000");
            });
        })
        .catch((error) => {
            console.error("Database connection failed:", error.message);
        });
} else {
    connectDB().catch((error) => {
        console.error("Database connection failed:", error.message);
    });
}

module.exports = app;
