(function (root) {
    'use strict';

    function calculate(history, current, goal) {
        if (typeof current !== 'number' || !Number.isFinite(current) || current < 0) return null;
        const amounts = history.concat(current);
        const scale = Math.ceil(Math.max(goal, ...amounts) / 5000) * 5000;
        return {
            lifetime: amounts.reduce((sum, amount) => sum + amount, 0),
            scale: scale,
            heights: amounts.map(amount => amount / scale * 100),
            goalHeight: goal / scale * 100
        };
    }

    function update(response) {
        const section = root.document.getElementById('fundraising-impact');
        if (!section) return;
        const bars = Array.from(section.querySelectorAll('.bar'));
        const history = bars.slice(0, -1).map(bar => Number(bar.dataset.amount));
        const current = response.sumDonations;
        const result = calculate(history, current, Number(section.dataset.goal));
        if (!result) return;
        const currency = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        });
        const money = amount => currency.format(amount);
        const reachedGoal = current >= Number(section.dataset.goal);
        const goalLabel = '$' + Number(section.dataset.goal) / 1000 + 'k';
        const status = section.querySelector('.ongoing');
        status.textContent = reachedGoal ? goalLabel + ' goal reached ✓' : 'ongoing';
        status.classList.toggle('goal-reached', reachedGoal);
        section.querySelector('.lifetime-total').textContent = money(result.lifetime);
        section.querySelector('.lifetime-context').textContent = 'for children and families since 2020';
        bars.forEach((bar, index) => {
            const amount = index === bars.length - 1 ? current : history[index];
            bar.style.height = result.heights[index] + '%';
            bar.querySelector('.amount').textContent = money(amount);
            bar.querySelector('.amount').dataset.compact = '$' + (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            bar.setAttribute('aria-label', bar.dataset.year + ': ' + money(amount) +
                (index === bars.length - 1 ? ', ' + status.textContent + '; goal ' + money(Number(section.dataset.goal)) : ''));
        });
        section.querySelector('.goal-marker').style.bottom = result.goalHeight + '%';
    }

    if (typeof module !== 'undefined' && module.exports) module.exports = { calculate, update };
    else root.ExtraLifeFundraising = { calculate, update };
})(typeof window !== 'undefined' ? window : globalThis);
