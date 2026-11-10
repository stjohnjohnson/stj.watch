const {test} = require('node:test');
const assert = require('node:assert/strict');
const {calculate, update, updateRecapTotals} = require('../js/fundraising.js');
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

function recapTotalsDocument(t) {
    const previousDocument = global.document;
    t.after(() => { global.document = previousDocument; });
    const totals = ['565756', '565756', 'old-campaign'].map(id => ({
        dataset: {participantId: id}, hidden: true,
        amount: {textContent: ''}, querySelector() { return this.amount; }
    }));
    global.document = {
        getElementById: id => id === 'main' ? {dataset: {extraLifeParticipantId: '565756'}} : null,
        querySelectorAll: () => totals
    };
    return totals;
}

test('live recap amounts preserve cents and never overwrite another campaign', t => {
    const totals = recapTotalsDocument(t);
    assert.equal(typeof updateRecapTotals, 'function');
    updateRecapTotals({sumDonations: 26753.95}, '565756');
    assert.equal(totals[0].amount.textContent, '$26,753.95');
    assert.equal(totals[1].amount.textContent, '$26,753.95');
    assert.equal(totals[0].hidden, false);
    assert.equal(totals[2].hidden, true);
    assert.equal(totals[2].amount.textContent, '');
});

test('missing or invalid totals stay hidden rather than suggesting zero raised', t => {
    const totals = recapTotalsDocument(t);
    assert.equal(typeof updateRecapTotals, 'function');
    for (const value of [undefined, null, '', '100', NaN, Infinity, -1]) {
        updateRecapTotals({sumDonations: value}, '565756');
    }
    assert.ok(totals.every(node => node.hidden && node.amount.textContent === ''));
});

test('recap total updates independently of the lifetime chart', t => {
    const totals = recapTotalsDocument(t);
    update({sumDonations: 25000});
    assert.equal(totals[0].amount.textContent, '$25,000');
    assert.equal(totals[0].hidden, false);
});
