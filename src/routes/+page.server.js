import { SHEET_ID, GOOGLE_API_KEY, PIGGY_PIN } from '$env/static/private';
import { dev } from '$app/environment';
import { fail } from '@sveltejs/kit';

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

async function loadSheetData() {
  const [savedRows, incomeRows, wishlistRows] = await Promise.all([
    fetchRange('piggy_bank!B2'),
    fetchRange('piggy_bank!A6:B8'),
    fetchRange('piggy_bank!A12:B'),
  ]);

  const saved = parseNumber((savedRows[0] || [])[0]);

  const income = incomeRows.map(([description, amount]) => ({
    description,
    amount: parseNumber(amount),
  }));

  const wishlist = wishlistRows.map(([item, price]) => ({
    item,
    price: parseNumber(price),
  }));

  const wishlistTotal = wishlist.reduce((sum, row) => sum + row.price, 0);

  return { summary: { saved, total: wishlistTotal }, income, wishlist };
}

export async function load({ cookies }) {
  const auth = cookies.get('piggy_auth');

  if (auth !== 'true') {
    return { authenticated: false };
  }

  try {
    const data = await loadSheetData();
    return { authenticated: true, ...data };
  } catch (err) {
    console.error('Failed to load data from Google Sheets:', err);
    return {
      authenticated: true,
      error: err.message,
      summary: { saved: 0, total: 0 },
      income: [],
      wishlist: [],
    };
  }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const pin = formData.get('pin');

    if (pin !== PIGGY_PIN) {
      return fail(401, { incorrect: true });
    }

    cookies.set('piggy_auth', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'strict',
      secure: !dev,
    });
  }
};
