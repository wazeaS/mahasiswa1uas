require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Panggil koneksi Neon

const app = express();
const PORT = process.env.PORT || 3001;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({ ok: true, service: "vendor-a-api" });
});

// === Vendor A API Route: Semua nilai dikembalikan sebagai STRING ===
app.get("/products", async (req, res, next) => {
  try {
    // SQL aman dan bersih
    const sql = `
      SELECT kd_produk, nm_brg, hrg, ket_stok
      FROM products_vendor_a
      ORDER BY kd_produk ASC
    `;

const result = await db.query(sql);

    const legacyData = result.rows.map(row => ({
      kd_produk: String(row.kd_produk),
      nm_brg: String(row.nm_brg),
      hrg: String(row.hrg),
      ket_stok: String(row.ket_stok)
    }));

    res.json(legacyData);

  } catch (err) {
    console.error("Error fetching data from Vendor A DB:", err);
    next(err);
  }
});

// === FALLBACK & ERROR HANDLING ===
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error("[SERVER ERROR M1]", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server M1" });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server M1 aktif di http://localhost:${PORT}`);

});