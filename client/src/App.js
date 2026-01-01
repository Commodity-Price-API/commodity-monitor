import { useEffect, useState } from "react";

// Symbols you want to track
const SYMBOLS = ["XAU", "WTIOIL-FUT", "XAG"];
const ALERT_THRESHOLD = 2; // percent threshold for alerts

export default function App() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadFluctuations();

    // Refresh every 60 seconds
    const timer = setInterval(loadFluctuations, 60000);
    return () => clearInterval(timer);
  }, []);

  async function loadFluctuations() {
    try {
      // Fetch latest fluctuation data from backend
      // ✅ Correct: relative URL
const res = await fetch(
  `/api/fluctuation?symbols=${SYMBOLS.join(",")}&startDate=2025-12-01&endDate=2025-12-31`
);


      if (!res.ok) {
        console.error("Failed to fetch fluctuation data", res.status);
        return;
      }

      const json = await res.json();

      // Map JSON data to table rows
      const rows = Object.entries(json.rates || {}).map(([symbol, values]) => ({
        symbol,
        startRate: values.startRate,
        endRate: values.endRate,
        change: values.change,
        changePercent: values.changePercent
      }));

      setData(rows);

      // Filter alerts based on threshold
      const triggered = rows.filter(
        (r) => Math.abs(r.changePercent) >= ALERT_THRESHOLD
      );

      setAlerts(triggered);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Commodity Price Monitor</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Start</th>
            <th>End</th>
            <th>Change</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.symbol}>
              <td>{row.symbol}</td>
              <td>{row.startRate}</td>
              <td>{row.endRate}</td>
              <td>{row.change}</td>
              <td>{row.changePercent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {alerts.length > 0 && (
        <>
          <h2 style={{ color: "red" }}>⚠ Alerts</h2>
          <ul>
            {alerts.map((a) => (
              <li key={a.symbol}>
                {a.symbol} moved {a.changePercent.toFixed(2)}%
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
