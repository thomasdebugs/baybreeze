async function loadAndSetup(htmlFile, jsFile) {
    const response = await fetch(htmlFile);
    if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${htmlFile}`);
    }
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const mainContent = tempDiv.querySelector('main');
    const calculatorContainer = document.getElementById('calculator-container');
    if (mainContent) {
        calculatorContainer.innerHTML = mainContent.innerHTML;
    } else {
        calculatorContainer.innerHTML = tempDiv.body.innerHTML;
    }
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = jsFile;
        script.onload = () => {
            resolve();
        };
        document.head.appendChild(script);
    });
}

QUnit.module('Decor Calculator Tests', {
    beforeEach: async function() {
        await loadAndSetup('decor-calc.html', 'decor-calc.js');
    }
});

QUnit.test('calculates points and shows goal not reached message', function(assert) {
    document.getElementById('legendary-upgrades').value = '5';
    document.getElementById('epic-upgrades').value = '10';
    document.getElementById('rare-upgrades').value = '20';
    document.getElementById('calculate-button').click();
    const totalPoints = document.getElementById('total-points').textContent;
    const message = document.getElementById('completion-message').textContent;
    assert.equal(totalPoints, '2,610', 'Correctly calculated total points');
    assert.equal(message, 'You need 1,390 more points to reach the goal.', 'Correctly shows "goal not reached" message');
});

QUnit.test('shows congratulations message when goal is met', function(assert) {
    document.getElementById('legendary-upgrades').value = '14';
    document.getElementById('epic-upgrades').value = '0';
    document.getElementById('rare-upgrades').value = '0';
    document.getElementById('calculate-button').click();
    const message = document.getElementById('completion-message').textContent;
    assert.equal(message, 'Congratulations! You have reached the point goal!', 'Correctly shows "congratulations" message');
});

QUnit.module('Castle Calculator Tests', {
    beforeEach: async function() {
        await loadAndSetup('castle-calc.html', 'castle-calc.js');
    }
});

QUnit.test('calculates single level upgrade (15 to 16)', function(assert) {
    document.getElementById('current-level').value = '15';
    document.getElementById('target-level').value = '16';
    document.getElementById('calculate-button').click();
    const resultsHTML = document.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('800,000'), 'Correctly calculates wood/stone cost');
});

QUnit.test('calculates multi-level upgrade with mixed resources (40 to 42)', function(assert) {
    document.getElementById('current-level').value = '40';
    document.getElementById('target-level').value = '42';
    document.getElementById('calculate-button').click();
    const resultsHTML = document.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('199,400,000'), 'Correctly calculates total wood');
    assert.ok(resultsHTML.includes('34,200,000'), 'Correctly calculates total rubies');
    assert.ok(resultsHTML.includes('252'), 'Correctly calculates total essence');
});

QUnit.module('Hero Awakening Calculator', {
    beforeEach: async function() {
        await loadAndSetup('hero-awakening.html', 'hero-awakening.js');
    }
});

QUnit.test('calculates resources for a single tier upgrade (0 to 1-0)', function(assert) {
    document.getElementById('current-tier').value = '0';
    document.getElementById('target-tier').value = '1-0';
    document.getElementById('calculate-button').click();
    const resultsHTML = document.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('>5<'), 'Correctly calculates 5 shards');
    assert.ok(resultsHTML.includes('>1<'), 'Correctly calculates 1 soulstone');
});

QUnit.test('calculates total resources from Tier 0 to Tier 4-0', function(assert) {
    document.getElementById('current-tier').value = '0';
    document.getElementById('target-tier').value = '4-0';
    document.getElementById('calculate-button').click();
    const resultsHTML = document.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('365'), 'Correctly calculates total shards');
    assert.ok(resultsHTML.includes('>9<'), 'Correctly calculates total soulstones');
});

QUnit.module('Hero Shards Calculator', {
    beforeEach: async function() {
        await loadAndSetup('hero-shard.html', 'hero-shards.js');
    }
});

QUnit.test('calculates total shards for Legendary hero from None to White ★★★★★', function(assert) {
    const calculator = document.getElementById('legendary-calculator');
    calculator.querySelector('#legendary-current-level').value = '-1';
    calculator.querySelector('#legendary-target-level').value = '14';
    calculator.querySelector('.btn-primary').click();
    const resultsHTML = calculator.querySelector('.results-section').innerHTML;
    assert.ok(resultsHTML.includes('430'), 'Correctly calculates total Legendary shards');
});

QUnit.test('calculates total shards for Mythic hero from Gold ★★★★★ to White ★★★★★', function(assert) {
    const calculator = document.getElementById('mythic-calculator');
    calculator.querySelector('#mythic-current-level').value = '4';
    calculator.querySelector('#mythic-target-level').value = '14';
    calculator.querySelector('.btn-primary').click();
    const resultsHTML = calculator.querySelector('.results-section').innerHTML;
    assert.ok(resultsHTML.includes('720'), 'Correctly calculates partial Mythic shards');
});

QUnit.module('Pet Level & Promotion Calculator', {
    beforeEach: async function() {
        await loadAndSetup('pet-level.html', 'pet-level.js');
    }
});

QUnit.test('calculates total food needed to level up a pet', function(assert) {
    document.getElementById('current-level').value = '1';
    document.getElementById('target-level').value = '20';
    document.getElementById('calculate-level').click();
    assert.equal(document.getElementById('total-food').textContent, '18,900', 'Correctly calculates total food');
});

QUnit.test('calculates rarity promotion cost from Epic to Legendary', function(assert) {
    document.getElementById('rarity-promote-from').value = 'epic';
    document.getElementById('calculate-rarity-promotion').click();
    const detailsHTML = document.getElementById('rarity-promotion-details').innerHTML;
    assert.ok(detailsHTML.includes('5x copies of the same pet'), 'Shows correct same pet cost');
    assert.ok(detailsHTML.includes('15x random Rare pets'), 'Shows correct random rare pet cost');
});

QUnit.test('calculates star promotion cost for Legendary pet', function(assert) {
    document.getElementById('pet-rarity').value = 'legendary';
    document.getElementById('current-rank').value = 'base';
    document.getElementById('target-rank').value = '5';
    document.getElementById('calculate-promotion').click();
    const detailsHTML = document.getElementById('promotion-cost-details').innerHTML;
    assert.ok(detailsHTML.includes('23x copies of the same pet'), 'Correctly totals same pet copies');
    assert.ok(detailsHTML.includes('65x random Rare pets'), 'Correctly totals random rare pets');
    assert.ok(detailsHTML.includes('13,000x essence'), 'Correctly totals essence');
});

QUnit.module('Rune Calculator', {
    beforeEach: async function() {
        await loadAndSetup('rune-calc.html', 'rune-calc.js');
    }
});

QUnit.test('calculates the runes needed from level 1 to level 10', function(assert) {
    document.getElementById('current-level').value = '1';
    document.getElementById('target-level').value = '10';
    document.getElementById('calculate-button').click();
    assert.equal(document.getElementById('total-runes').textContent, '19,683', 'Correctly calculates total runes for Lvl 10');
});

QUnit.module('Skill Books Calculator', {
    beforeEach: async function() {
        await loadAndSetup('skill-books-calc.html', 'skill-books-calc.js');
    }
});

QUnit.test('calculates total books needed from level 1 to 15', function(assert) {
    document.getElementById('current-level').value = '1';
    document.getElementById('target-level').value = '15';
    document.getElementById('calculate-button').click();
    assert.equal(document.getElementById('total-books').textContent, '25,000', 'Correctly calculates total books');
});

QUnit.module('Speedups Calculator', {
    beforeEach: async function() {
        await loadAndSetup('speedup-calc.html', 'speedups-calc.js');
    }
});

QUnit.test('calculates points and remaining time for Facilities tab', function(assert) {
    const tabId = 'facilities';
    document.getElementById(`days-${tabId}`).value = '10';
    document.getElementById(`hours-${tabId}`).value = '5';
    document.getElementById(`minutes-${tabId}`).value = '30';
    document.getElementById(`s24h-${tabId}`).value = '5';
    document.getElementById(`s8h-${tabId}`).value = '10';
    document.querySelector(`#${tabId} .btn-primary`).click();
    const resultsSection = document.querySelector(`#${tabId} .results-section`);
    assert.ok(resultsSection.innerHTML.includes('10d 5h 30m'), 'Correct Initial Time');
    assert.ok(resultsSection.innerHTML.includes('8d 8h 0m'), 'Correct Speedups Used Time');
    assert.ok(resultsSection.innerHTML.includes('1d 21h 30m'), 'Correct Remaining Time');
    assert.ok(resultsSection.innerHTML.includes('360,000'), 'Correct GAR/KVK Points');
});

QUnit.module('Weapon Calculator', {
    beforeEach: async function() {
        await loadAndSetup('weapon-calc.html', 'weapon-calc.js');
    }
});

QUnit.test('calculates total shards needed from level 0 to 20', function(assert) {
    document.getElementById('current-level').value = '0';
    document.getElementById('target-level').value = '20';
    document.getElementById('calculate-button').click();
    assert.equal(document.getElementById('total-shards').textContent, '1,185', 'Correctly calculates total shards');
});

QUnit.test('calculates partial shard upgrade (5 to 10)', function(assert) {
    document.getElementById('current-level').value = '5';
    document.getElementById('target-level').value = '10';
    document.getElementById('calculate-button').click();
    assert.equal(document.getElementById('total-shards').textContent, '200', 'Correctly calculates partial shard cost');
});