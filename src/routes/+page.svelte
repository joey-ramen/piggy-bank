<script>
  import { enhance } from '$app/forms';

  export let data;
  export let form;

  function formatCurrency(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  }

  $: summary = data.summary ?? { saved: 0, total: 0 };
  $: income = data.income ?? [];
  $: wishlist = data.wishlist ?? [];
  $: percent = summary.total > 0 ? Math.min((summary.saved / summary.total) * 100, 100) : 0;
  $: incomeTotal = income.reduce((sum, row) => sum + row.amount, 0);
</script>

<svelte:head>
  <title>My Piggy Bank</title>
</svelte:head>

<!-- ── PIN Screen ──────────────────────────────────────────────────────────── -->
{#if !data.authenticated}
  <div class="gate">
    <img src="/piggy-bank.png" alt="Piggy bank" class="pig-img" />

    <h1 class="gate-title">My Piggy Bank</h1>
    <p class="gate-subtitle">Enter your secret PIN</p>

    <form method="POST" use:enhance>
      <input
        type="password"
        name="pin"
        inputmode="numeric"
        placeholder="••••"
        maxlength="10"
        autocomplete="current-password"
        autofocus
      />
      {#if form?.incorrect}
        <p class="pin-error">Wrong PIN, try again!</p>
      {/if}
      <button type="submit" class="btn-open">Open!</button>
    </form>
  </div>

<!-- ── Main Content ────────────────────────────────────────────────────────── -->
{:else}
  <header class="pig-header">
    <img src="/piggy-bank.png" alt="Piggy bank" class="pig-img" />
    <h1 class="app-title">My Piggy Bank</h1>
  </header>

  <section class="summary-box">
    {#if data.error}
      <p class="error">{data.error}</p>
    {:else}
      <p class="summary-text">
        Saved: <span>{formatCurrency(summary.saved)}</span>
        &nbsp;/&nbsp;
        <span>{formatCurrency(summary.total)}</span> total
      </p>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: {percent.toFixed(2)}%"></div>
      </div>
      <p class="progress-label">{percent.toFixed(0)}% of wishlist goal</p>
    {/if}
  </section>

  <main class="panels">
    <section class="panel">
      <h2>Income</h2>
      <table>
        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>
          {#if income.length === 0}
            <tr><td colspan="2" class="empty">No income yet!</td></tr>
          {:else}
            {#each income as row}
              <tr>
                <td>{row.description}</td>
                <td class="amount-cell">{formatCurrency(row.amount)}</td>
              </tr>
            {/each}
            <tr class="total-row">
              <td>Total</td>
              <td class="amount-cell">{formatCurrency(incomeTotal)}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </section>

    <section class="panel">
      <h2>Wishlist</h2>
      <table>
        <thead><tr><th>Item</th><th>Price</th></tr></thead>
        <tbody>
          {#if wishlist.length === 0}
            <tr><td colspan="2" class="empty">Wishlist is empty!</td></tr>
          {:else}
            {#each wishlist as row}
              <tr>
                <td>{row.item}</td>
                <td class="amount-cell">{formatCurrency(row.price)}</td>
              </tr>
            {/each}
            <tr class="total-row">
              <td>Total</td>
              <td class="amount-cell">{formatCurrency(summary.total)}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </section>
  </main>
{/if}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; }

  :global(body) {
    font-family: 'Nunito', sans-serif;
    background-color: #fff5f8;
    color: #5a3d4a;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  :global(h1, h2) { font-family: 'Fredoka One', cursive; margin: 0; }

  /* ── Gate (PIN + Welcome screens) ── */
  .gate {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 0.75rem;
    padding: 2rem;
  }

  .gate-title {
    font-size: 2.2rem;
    color: #e75480;
    letter-spacing: 1px;
  }

  .gate-subtitle {
    margin: 0;
    font-size: 1rem;
    color: #b05070;
  }

  .gate form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }

  .gate input[type="password"] {
    font-family: 'Nunito', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.4em;
    text-align: center;
    width: 180px;
    padding: 0.6rem 1rem;
    border: 2px solid #ffb6c1;
    border-radius: 14px;
    background: white;
    color: #5a3d4a;
    outline: none;
  }

  .gate input[type="password"]:focus {
    border-color: #e75480;
    box-shadow: 0 0 0 3px rgba(231, 84, 128, 0.15);
  }

  .pin-error {
    margin: 0;
    font-size: 0.85rem;
    color: #e75480;
    font-weight: 700;
  }

  .btn-open {
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem;
    background: linear-gradient(135deg, #ff85a1, #ff4d79);
    color: white;
    border: none;
    border-radius: 999px;
    padding: 0.7rem 2.5rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255, 77, 121, 0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    margin-top: 0.25rem;
  }

  .btn-open:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(255, 77, 121, 0.45);
  }

  .btn-open:active { transform: scale(0.97); }

  /* ── Main content ── */
  .pig-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0 0.75rem;
    gap: 0.6rem;
  }

  .pig-img {
    width: 160px;
    height: 160px;
    object-fit: contain;
    filter: drop-shadow(0 6px 14px rgba(255, 100, 140, 0.25));
    transition: transform 0.2s ease;
  }

  .pig-img:hover { transform: scale(1.05) rotate(-2deg); }


  .app-title {
    font-size: 2.4rem;
    color: #e75480;
    letter-spacing: 1px;
  }

  .summary-box {
    max-width: 480px;
    margin: 1.5rem auto;
    background: #fff0f5;
    border: 2px solid #ffb6c1;
    border-radius: 20px;
    padding: 1.4rem 1.75rem;
    text-align: center;
    box-shadow: 0 4px 16px rgba(255, 105, 150, 0.13);
  }

  .summary-text {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.85rem;
  }

  .summary-text span { color: #e75480; }

  .progress-bar-track {
    background: #ffd6e4;
    border-radius: 999px;
    height: 24px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff85a1, #ff4d79);
    border-radius: 999px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .progress-label {
    margin: 0.45rem 0 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #b05070;
  }

  .error { color: red; font-size: 0.9rem; }

  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    max-width: 750px;
    margin: 0 auto 3rem;
    padding: 0 1rem;
  }

  @media (max-width: 600px) {
    .panels { grid-template-columns: 1fr; }
  }

  .panel {
    background: #fff0f5;
    border: 2px solid #ffb6c1;
    border-radius: 20px;
    padding: 1.25rem 1.25rem 1.5rem;
    box-shadow: 0 4px 14px rgba(255, 105, 150, 0.10);
  }

  .panel :global(h2) {
    color: #e75480;
    font-size: 1.5rem;
    margin-bottom: 0.9rem;
  }

  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }

  th {
    background: #ffd6e4;
    color: #8b3a5a;
    padding: 0.55rem 0.65rem;
    text-align: left;
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  th:first-child { border-radius: 10px 0 0 10px; }
  th:last-child  { border-radius: 0 10px 10px 0; }

  td {
    padding: 0.5rem 0.65rem;
    border-bottom: 1px solid #ffe0ec;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tbody tr:nth-child(even) { background: rgba(255, 240, 245, 0.6); }
  tbody tr:hover { background: #ffe8f0; }

  .amount-cell { text-align: right; }

  .total-row td {
    font-weight: 700;
    color: #e75480;
    border-top: 2px solid #ffb6c1;
    border-bottom: none;
  }

  .empty { text-align: center; color: #b05070; }
</style>
