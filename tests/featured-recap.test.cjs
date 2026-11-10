const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const build = process.env.WATCH_BUILD_DIR || path.join(__dirname, '../_site');
const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');

test('featured game breakdown renders readable game names and figures as HTML', () => {
    if (process.env.WATCH_FEATURED === 'false') {
        assert.ok(!html.includes('id="featured-games"'));
        return;
    }
    const recap = html.match(/<section id="featured-games"[\s\S]*?<\/section>/)?.[0];
    assert.ok(recap, 'native game breakdown is present');
    const games = [...recap.matchAll(/data-game-name="([^"]+)" data-percent="([^"]+)"[\s\S]*?<span class="recap-game-duration">([^<]+)<\/span>/g)]
        .map(m => [m[1], m[2], m[3]]);
    assert.deepEqual(games, [
        ['Big Walk', '29.9', '7.48 h'], ['Enshrouded', '23.6', '5.91 h'],
        ['Escape Simulator 2', '11.4', '2.85 h'], ['Finals Week', '9.9', '2.47 h'],
        ['Gamble With Your Friends', '7.6', '1.89 h'], ['PlateUp!', '4.4', '1.09 h'],
        ['Minecraft', '3.9', '59 min'], ['S.O.N.A.R.', '3.2', '48 min'],
        ['Ultimate Chicken Horse', '2.6', '39 min'], ['Tricky Towers', '1.8', '27 min'],
        ['Goat Simulator 3', '1.7', '26 min']
    ]);
    assert.ok(!recap.includes('Just Chatting'));
    assert.equal((recap.match(/class="recap-game-card /g) || []).length, 2);
    assert.equal((recap.match(/class="recap-game-row"/g) || []).length, 9);
});

test('ranked bar lengths reflect unrounded game durations on one common scale', () => {
    if (process.env.WATCH_FEATURED === 'false') return;
    const rows = [...html.matchAll(/class="recap-game-row"[\s\S]*?class="recap-game-bar" style="width: ([\d.]+)%"/g)];
    assert.equal(rows.length, 9);
    assert.equal(Number(rows[0][1]), 100);
    assert.ok(Math.abs(Number(rows[1][1]) - 86.77) < 0.02);
    assert.ok(Math.abs(Number(rows[8][1]) - 15.23) < 0.02);
});
