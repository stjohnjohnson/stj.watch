const {test} = require('node:test');
const assert = require('node:assert/strict');
const {calculate} = require('../js/fundraising.js');
const history = [4752, 7116, 9660, 16336, 21841, 28783];
test('adds the live total once to finalized prior years', () => {
    assert.equal(typeof calculate, 'function', 'fundraising calculation is available');
    const result = calculate(history, 15000, 25000);
    assert.equal(result.lifetime, 103488);
    assert.equal(result.scale, 30000);
    assert.equal(result.heights[6], 50);
    assert.equal(result.goalHeight, 25000 / 30000 * 100);
});
test('zero current donations preserves the historical total', () => {
    assert.equal(calculate(history, 0, 25000).lifetime, 88488);
    assert.equal(calculate(history, 0, 25000).heights[6], 0);
});
test('above-goal donations expand the scale for all bars and the goal', () => {
    const result = calculate(history, 42000, 25000);
    assert.equal(result.lifetime, 130488);
    assert.equal(result.scale, 45000);
    assert.ok(result.heights.every(height => height >= 0 && height <= 100));
    assert.equal(result.goalHeight, 25000 / 45000 * 100);
    assert.equal(result.heights[0], 4752 / 45000 * 100);
});
test('rejects missing, negative, nonnumeric and nonfinite current totals', () => {
    for (const amount of [undefined, null, '', '15000', NaN, Infinity, -1]) {
        assert.equal(calculate(history, amount, 25000), null);
    }
});
