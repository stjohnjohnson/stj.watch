const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const build = process.env.WATCH_BUILD_DIR || path.join(__dirname, '../_site');
const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');

test('watch navigation is between when and donate', () => {
    const nav = html.match(/<nav>[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map(m => m[1]),
        ['what', 'who', 'why', 'when', 'watch', 'donate']);
});

test('all seven years retain the user-selected clips without duplicate players', () => {
    const years = [...html.matchAll(/<article[^>]*data-year="(\d+)"[\s\S]*?<\/article>/g)];
    assert.deepEqual(years.map(m => [Number(m[1]), [...m[0].matchAll(/data-clip-id=/g)].length]),
        [[2026,7],[2025,3],[2024,2],[2023,2],[2022,2],[2021,3],[2020,3]]);
    assert.equal((html.match(/id="watch-player"/g) || []).length, 1);
    assert.ok(html.includes('EagerOptimisticPlumberDerp-Mv7UHLkKcUVF-_FX'));
});

test('poster previews exist only for 2026 and 2025 and their files are available', () => {
    const posters = [...html.matchAll(/<img[^>]*data-recap-poster[^>]*src="([^"]+)"/g)];
    assert.equal(posters.length, 2);
    for (const [,src] of posters) assert.ok(fs.existsSync(path.join(build, src)), src);
});

test('campaign rollover retires the feature without retiring the archive', () => {
    assert.equal(html.includes('id="featured-recap"'), process.env.WATCH_FEATURED !== 'false');
    assert.ok(html.includes('id="watch-archive"'));
    assert.ok(html.includes('data-year="2026"'));
});

test('the closing stream clip finishes the 2026 playlist', () => {
    const year = html.match(/<article[^>]*data-year="2026"[\s\S]*?<\/article>/)[0];
    const ids = [...year.matchAll(/data-clip-id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.at(-1), 'JazzyPleasantWaspDBstyle--jrGiJAil3ueUZvx');
});

test('the end-of-stream clip also finishes the 2024 playlist', () => {
    const year = html.match(/<article[^>]*data-year="2024"[\s\S]*?<\/article>/)[0];
    const ids = [...year.matchAll(/data-clip-id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.at(-1), 'BetterHungryCrabBuddhaBar-fxSd8ZOmHs4ujeXg');
});

test('archive shows finalized annual results without claiming an unknown 2026 total', () => {
    const year2025 = html.match(/<article[^>]*data-year="2025"[\s\S]*?<\/article>/)[0];
    assert.ok(year2025.includes('$28,783'));
    const year2026 = html.match(/<article[^>]*data-year="2026"[\s\S]*?<\/article>/)[0];
    if (process.env.WATCH_FEATURED === 'false') {
        assert.ok(!year2026.includes('data-campaign-total'));
    } else {
        assert.match(year2026, /data-campaign-total[^>]*hidden/);
    }
});
