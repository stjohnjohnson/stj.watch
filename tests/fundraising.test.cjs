const {test} = require('node:test');
const assert = require('node:assert/strict');
const {calculate, update} = require('../js/fundraising.js');
const history = [4752, 7116, 9660, 16336, 21841, 28783];
test('adds the live total once to finalized prior years', () => {
    assert.equal(typeof calculate, 'function', 'fundraising calculation is available');
    const result = calculate(history, 15000, 25000);
    assert.equal(result.lifetime, 103488);
    assert.equal(result.scale, 30000);
    assert.equal(result.heights[6], 50);
    assert.equal(result.goalHeight, 25000 / 30000 * 100);
});

function renderDonation(amount, t) {
    const previousDocument = global.document;
    t.after(() => { global.document = previousDocument; });
    const node = () => ({style: {}, dataset: {}, textContent: '', classList: {toggle() {}}});
    const elements = Object.fromEntries(['.lifetime-total', '.lifetime-context', '.ongoing', '.goal-marker', '.goal-marker span'].map(selector => [selector, node()]));
    const bars = history.concat(0).map((amount, index) => {
        const label = node();
        return {style: {}, dataset: {amount, year: 2020 + index},
            querySelector: () => label, setAttribute() {}};
    });
    global.document = {getElementById: () => ({dataset: {goal: 25000},
        querySelector: selector => elements[selector], querySelectorAll: () => bars})};
    update({sumDonations: amount});
    return {elements, bars};
}

test('rounds visible amounts while preserving cents in bar proportions and totals', t => {
    const {elements, bars} = renderDonation(26753.95, t);
    assert.equal(elements['.lifetime-total'].textContent, '$115,242');
    assert.equal(bars[6].querySelector('.amount').textContent, '$26,754');
    assert.equal(bars[6].style.height, (26753.95 / 30000 * 100) + '%');
    assert.equal(calculate(history, 26753.95, 25000).lifetime, 115241.95);
});

test('acknowledges the goal beneath the year when the actual amount reaches it', t => {
    const {elements} = renderDonation(25000, t);
    assert.equal(elements['.ongoing'].textContent, '$25k goal reached ✓');
});

test('does not claim the goal from rounding up a below-goal amount', t => {
    const {elements} = renderDonation(24999.95, t);
    assert.equal(elements['.ongoing'].textContent, 'ongoing');
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
