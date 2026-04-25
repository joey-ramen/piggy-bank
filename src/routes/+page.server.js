import { SHEET_ID, GOOGLE_API_KEY } from '$env/static/private';

function parseNumber(str) {
  return parseFloat(String(str).replace(/,/g, '')) || 0;
}

async function fetchRange(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API error ${res.status} for range "${range}"`);
  const json = await res.json();
  return json.values || [];
}

export async function load() {
  try {
    const [savedRows, wishlistTotalRows, incomeRows, wishlistRows] = await Promise.all([
      fetchRange('piggy_bank!B2'),
      fetchRange('piggy_bank!B3'),
      fetchRange('piggy_bank!A6:B8'),
      fetchRange('piggy_bank!A12:B'),
    ]);

    const saved        = parseNumber((savedRows[0]         || [])[0]);
    const wishlistTotal = parseNumber((wishlistTotalRows[0] || [])[0]);

    const income = incomeRows.map(([description, amount]) => ({
      description,
      amount: parseNumber(amount),
    }));

    const wishlist = wishlistRows.map(([item, price]) => ({
      item,
      price: parseNumber(price),
    }));

    return { summary: { saved, total: wishlistTotal }, income, wishlist };

  } catch (err) {
    console.error('Failed to load data from Google Sheets:', err);
    return {
      error: err.message,
      summary: { saved: 0, total: 0 },
      income: [],
      wishlist: [],
    };
  }
}
