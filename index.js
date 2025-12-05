require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Status API
app.get("/status", (req, res) => {
  res.json({ ok: true, service: "vendor-a-api" });
});

// Products
app.get("/products", async (req, res, next) => {
  try {
    const sql = `
      SELECT product_code, product_name, price, stock_status
      FROM products_vendor_a
      ORDER BY product_code ASC
    `;

    const result = await db.query(sql);

    const legacyData = result.rows.map(row => ({
      kd_produk: String(row.product_code),
      nm_brg: String(row.product_name),
      hrg: String(row.price),
      ket_stok: String(row.stock_status)
    }));

    res.json(legacyData);

  } catch (err) {
    console.error("Error fetching data from Vendor A DB:", err);
    next(err);
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR M1]", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server M1" });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server M1 aktif di http://localhost:${PORT}`);

});

module.exports = app;
