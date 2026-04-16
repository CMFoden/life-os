// ===========================================
// FILE: app/api/custody/route.js
// Google Sheets Custody Sync
// ===========================================
// 
// HOW TO SET UP:
// 1. Open your custody Google Sheet
// 2. Format it like this (columns A-I):
//    Row 1 headers: Week Start | Sun | Mon | Tue | Wed | Thu | Fri | Sat | Sun
//    Row 2: 2026-04-13 | N | N | N | N | N | N | N | K
//    Row 3: 2026-04-20 | K | K | K | K | K | K | K | N
//    (N = Newlands, K = Kommetjie)
// 3. File → Share → Publish to web → CSV → Publish
// 4. Copy the URL
// 5. Add to .env.local: CUSTODY_SHEET_URL=your_url_here
// ===========================================

export async function GET() {
  const sheetUrl = process.env.CUSTODY_SHEET_URL;

  if (!sheetUrl) {
    return Response.json({ error: 'No CUSTODY_SHEET_URL configured' }, { status: 400 });
  }

  try {
    const res = await fetch(sheetUrl);
    const csv = await res.text();
    const rows = csv.trim().split('\n').map(r => r.split(',').map(c => c.trim().replace(/"/g, '')));

    // Skip header row
    if (rows.length < 2) {
      return Response.json({ error: 'Sheet has no data rows' }, { status: 400 });
    }

    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - dayOfWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    let thisWeek = null;
    let nextWeek = null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 9) continue;
      const weekStart = new Date(row[0]);
      weekStart.setHours(0, 0, 0, 0);

      const days = [];
      for (let d = 0; d < 8; d++) {
        const loc = (row[d + 1] || '').toUpperCase().startsWith('N') ? 'N' : 'K';
        days.push({ day: dayLetters[d], loc });
      }

      const diff = Math.round((weekStart - startOfThisWeek) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7 && !thisWeek) thisWeek = days;
      else if (diff >= 7 && diff < 14 && !nextWeek) nextWeek = days;
    }

    // Fallback: if we can't find matching weeks, use the first two rows
    if (!thisWeek && rows.length >= 2) {
      thisWeek = dayLetters.map((d, i) => ({ day: d, loc: (rows[1][i + 1] || 'N').toUpperCase().startsWith('N') ? 'N' : 'K' }));
    }
    if (!nextWeek && rows.length >= 3) {
      nextWeek = dayLetters.map((d, i) => ({ day: d, loc: (rows[2][i + 1] || 'K').toUpperCase().startsWith('N') ? 'N' : 'K' }));
    }

    return Response.json({
      thisWeek: thisWeek || dayLetters.map(d => ({ day: d, loc: 'N' })),
      nextWeek: nextWeek || dayLetters.map(d => ({ day: d, loc: 'K' })),
      synced: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: 'Failed to fetch sheet: ' + err.message }, { status: 500 });
  }
}
