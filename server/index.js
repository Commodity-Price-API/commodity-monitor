const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.COMMODITY_API_KEY;
const BASE_URL = "https://api.commoditypriceapi.com/v2";

// Latest prices
app.get("/api/latest", async (req, res) => {
  const symbols = req.query.symbols;

  const response = await fetch(
    `${BASE_URL}/rates/latest?symbols=${symbols}`,
    {
      headers: { "x-api-key": API_KEY }
    }
  );

  const data = await response.json();
  res.json(data);
});

// Fluctuation monitoring
app.get("/api/fluctuation", async (req, res) => {
  const { symbols, startDate, endDate } = req.query;

  const response = await fetch(
    `${BASE_URL}/rates/fluctuation?symbols=${symbols}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { "x-api-key": API_KEY }
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});
