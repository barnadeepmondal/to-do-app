import { useState, useMemo } from "react";


const initialRows = [];

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}-${m}-${y}`;
}

export default function App() {
  const [rows, setRows] = useState(initialRows);
  const [form, setForm] = useState({
    name: "",
    income: "",
    bonus: "",
    advance: "",
    date: "",
  });

  const grandTotal = useMemo(
    () => rows.reduce((sum, r) => sum + r.total, 0),
    [rows]
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    const income = parseFloat(form.income) || 0;
    const bonus = parseFloat(form.bonus) || 0;
    const advance = parseFloat(form.advance) || 0;
    const total = income + bonus - advance;

    setRows((r) => [
      ...r,
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        income,
        bonus,
        advance,
        date: form.date,
        total,
      },
    ]);
    setForm({ name: "", income: "", bonus: "", advance: "", date: "" });
  }

  function handleDelete(id) {
    setRows((r) => r.filter((row) => row.id !== id));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="page">
      <style>{css}</style>

      <div className="ledger">
        <header className="ledger-head">
          <div className="coin-stack" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="40" height="40">
              <ellipse cx="32" cy="46" rx="24" ry="8" fill="#c99a3d" stroke="#8a6a24" strokeWidth="2" />
              <ellipse cx="32" cy="38" rx="24" ry="8" fill="#dcb04f" stroke="#8a6a24" strokeWidth="2" />
              <ellipse cx="32" cy="30" rx="24" ry="8" fill="#e8c565" stroke="#8a6a24" strokeWidth="2" />
              <ellipse cx="32" cy="22" rx="24" ry="8" fill="#f3d97e" stroke="#8a6a24" strokeWidth="2" />
              <text x="32" y="26" textAnchor="middle" fontSize="12" fill="#7a5c1e" fontWeight="700">
                ₹
              </text>
            </svg>
          </div>
          <div>
            <h1>Employee Salary Ledger</h1>
            <p className="subtitle">Track daily wages, bonuses & advances</p>
          </div>
        </header>

        <section className="entry-card">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Employee name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="income">Per-day Income</label>
            <div className="prefixed">
              <span>₹</span>
              <input
                id="income"
                name="income"
                type="number"
                placeholder="0"
                value={form.income}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="bonus">Bonus</label>
            <div className="prefixed">
              <span>₹</span>
              <input
                id="bonus"
                name="bonus"
                type="number"
                placeholder="0"
                value={form.bonus}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="advance">Advance</label>
            <div className="prefixed">
              <span>₹</span>
              <input
                id="advance"
                name="advance"
                type="number"
                placeholder="0"
                value={form.advance}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="add-btn" onClick={handleAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Entry
          </button>
        </section>

        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Per-day Income</th>
                <th>Bonus</th>
                <th>Advance</th>
                <th>Date</th>
                <th>Total Salary</th>
                <th className="del-col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr className="empty-row">
                  <td colSpan={7}>
                    <div className="empty-state">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      No entries yet — add your first row above.
                    </div>
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="name-cell">{row.name}</td>
                  <td>₹{row.income.toLocaleString("en-IN")}</td>
                  <td>₹{row.bonus.toLocaleString("en-IN")}</td>
                  <td className={row.advance ? "advance-neg" : ""}>
                    {row.advance ? `-₹${row.advance.toLocaleString("en-IN")}` : "₹0"}
                  </td>
                  <td>{formatDate(row.date)}</td>
                  <td className="total-cell">₹{row.total.toLocaleString("en-IN")}</td>
                  <td className="del-col">
                    <button
                      className="del-btn"
                      onClick={() => handleDelete(row.id)}
                      aria-label={`Delete ${row.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="grand-label">
                  Grand Total
                </td>
                <td className="grand-value">₹{grandTotal.toLocaleString("en-IN")}</td>
                <td className="del-col">—</td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --ink: #1f2937;
  --navy: #17223b;
  --brass: #c99a3d;
  --brass-dark: #8a6a24;
  --cream: #f6f1e6;
  --paper: #fffdf8;
  --rule: #e4dcc8;
  --danger: #b5453c;
}

* { box-sizing: border-box; }

.page {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at 15% 10%, rgba(201,154,61,0.10), transparent 45%),
    radial-gradient(circle at 90% 90%, rgba(23,34,59,0.08), transparent 50%),
    var(--cream);
  font-family: 'Inter', sans-serif;
  color: var(--ink);
  padding: 40px 20px 80px;
  display: flex;
  justify-content: center;
}

.ledger {
  width: 100%;
  max-width: 1100px;
}

.ledger-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.coin-stack {
  flex-shrink: 0;
  filter: drop-shadow(0 3px 4px rgba(138,106,36,0.35));
}

.ledger-head h1 {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(24px, 4vw, 34px);
  margin: 0;
  color: var(--navy);
  letter-spacing: -0.01em;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b6152;
}

.entry-card {
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 14px;
  padding: 22px;
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: 14px;
  align-items: end;
  box-shadow: 0 4px 18px rgba(23,34,59,0.06);
  margin-bottom: 28px;
}

.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.field label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a7f68;
}

.field input {
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}

.field input:focus {
  border-color: var(--brass);
  box-shadow: 0 0 0 3px rgba(201,154,61,0.18);
}

.prefixed {
  display: flex;
  align-items: center;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.prefixed:focus-within {
  border-color: var(--brass);
  box-shadow: 0 0 0 3px rgba(201,154,61,0.18);
}

.prefixed span {
  padding: 10px 0 10px 12px;
  color: #a89a78;
  font-size: 14px;
}

.prefixed input {
  border: none;
  box-shadow: none !important;
  padding-left: 4px;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.1s;
}

.add-btn:hover { background: #223052; }
.add-btn:active { transform: scale(0.97); }

.table-wrap {
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(23,34,59,0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead th {
  background: var(--navy);
  color: #f3ead4;
  text-align: left;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink);
}

tbody tr:hover { background: rgba(201,154,61,0.06); }

.name-cell { font-weight: 600; color: var(--navy); }
.total-cell { font-weight: 700; color: var(--brass-dark); }
.advance-neg { color: var(--danger); font-weight: 500; }

.del-col { text-align: center; width: 60px; }

.del-btn {
  background: transparent;
  border: none;
  color: #a35a52;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  transition: background 0.15s, color 0.15s;
}

.del-btn:hover { background: rgba(181,69,60,0.1); color: var(--danger); }

.empty-row td { padding: 40px 16px; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #a89a78;
  font-size: 14px;
}

tfoot td {
  padding: 16px;
  background: #f1ead9;
  font-weight: 700;
  color: var(--navy);
  border-top: 2px solid var(--brass);
}

.grand-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 13px;
}

.grand-value { font-size: 16px; color: var(--brass-dark); }

@media (max-width: 900px) {
  .entry-card {
    grid-template-columns: 1fr 1fr;
  }
  .add-btn { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .entry-card { grid-template-columns: 1fr; }
  .table-wrap { overflow-x: auto; }
  table { min-width: 700px; }
}
`;
