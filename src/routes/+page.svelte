<script>
  export let data;

  const { summary, income, wishlist, error } = data;

  function formatCurrency(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  }

  const percent = summary.total > 0
    ? Math.min((summary.saved / summary.total) * 100, 100)
    : 0;

  const incomeTotal = income.reduce((sum, row) => sum + row.amount, 0);
</script>

<svelte:head>
  <title>My Piggy Bank</title>
</svelte:head>

<!-- Header -->
<header class="pig-header">
  <svg id="pig-face" viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="52" cy="62" rx="28" ry="36" fill="#f9a8c9" transform="rotate(-20, 52, 62)" />
    <ellipse cx="52" cy="64" rx="16" ry="22" fill="#ffc8dc" transform="rotate(-20, 52, 64)" />
    <ellipse cx="148" cy="62" rx="28" ry="36" fill="#f9a8c9" transform="rotate(20, 148, 62)" />
    <ellipse cx="148" cy="64" rx="16" ry="22" fill="#ffc8dc" transform="rotate(20, 148, 64)" />
    <circle cx="100" cy="115" r="80" fill="#ffb6c1" />
    <circle cx="62" cy="138" r="18" fill="#ff9bb3" opacity="0.45" />
    <circle cx="138" cy="138" r="18" fill="#ff9bb3" opacity="0.45" />
    <circle cx="76" cy="100" r="14" fill="white" />
    <circle cx="78" cy="101" r="7" fill="#3d2b1f" />
    <circle cx="81" cy="98" r="2.5" fill="white" />
    <circle cx="124" cy="100" r="14" fill="white" />
    <circle cx="126" cy="101" r="7" fill="#3d2b1f" />
    <circle cx="129" cy="98" r="2.5" fill="white" />
    <ellipse cx="100" cy="140" rx="36" ry="26" fill="#f48fb1" />
    <ellipse cx="88" cy="142" rx="7" ry="5" fill="#c2185b" opacity="0.6" />
    <ellipse cx="112" cy="142" rx="7" ry="5" fill="#c2185b" opacity="0.6" />
    <path d="M 82 158 Q 100 172 118 158" stroke="#c2185b" stroke-width="3" fill="none" stroke-linecap="round" />
  </svg>
  <h1 class="app-title">My Piggy Bank</h1>
</header>

<!-- Summary Box -->
<section class="summary-box">
  {#if error}
    <p class="error">{error}</p>
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

<!-- Panels -->
<main class="panels">

  <!-- Income -->
  <section class="panel">
    <h2>Income</h2>
    <table>
      <thead>
        <tr><th>Description</th><th>Amount</th></tr>
      </thead>
      <tbody>
        {#if income.length === 0}
          <tr><td colspan="2" class="empty">No income yet!</td></tr>
        {:else}
          {#each income as row}
            <tr>
              <td>{row.description}</td>
              <td>{formatCurrency(row.amount)}</td>
            </tr>
          {/each}
          <tr class="total-row">
            <td>Total</td>
            <td>{formatCurrency(incomeTotal)}</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </section>

  <!-- Wishlist -->
  <section class="panel">
    <h2>Wishlist</h2>
    <table>
      <thead>
        <tr><th>Item</th><th>Price</th></tr>
      </thead>
      <tbody>
        {#if wishlist.length === 0}
          <tr><td colspan="2" class="empty">Wishlist is empty!</td></tr>
        {:else}
          {#each wishlist as row}
            <tr>
              <td>{row.item}</td>
              <td>{formatCurrency(row.price)}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </section>

</main>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; }

  :global(body) {
    font-family: 'Nunito', sans-serif;
    background-color: #fff5f8;
    color: #5a3d4a;
    margin: 0;
    padding: 1rem 1rem 3rem;
    min-height: 100vh;
  }

  :global(h1, h2) { font-family: 'Fredoka One', cursive; margin: 0; }

  /* Header */
  .pig-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0 0.75rem;
    gap: 0.6rem;
  }

  #pig-face {
    filter: drop-shadow(0 6px 14px rgba(255, 100, 140, 0.25));
    transition: transform 0.2s ease;
  }

  #pig-face:hover { transform: scale(1.05) rotate(-2deg); }

  .app-title {
    font-size: 2.4rem;
    color: #e75480;
    letter-spacing: 1px;
  }

  /* Summary */
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

  /* Panels */
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    max-width: 900px;
    margin: 0 auto;
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

  /* Tables */
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

  .total-row td {
    font-weight: 700;
    color: #e75480;
    border-top: 2px solid #ffb6c1;
    border-bottom: none;
  }

  .empty { text-align: center; color: #b05070; }
</style>
