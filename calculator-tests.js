async function loadCalculatorIntoIframe(htmlFile) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(htmlFile);
            if (!response.ok) {
                reject(`Failed to fetch HTML: ${htmlFile}`);
                return;
            }
            const html = await response.text();

            const fixture = document.getElementById('qunit-fixture');
            fixture.innerHTML = ''; 
            const iframe = document.createElement('iframe');
            
            fixture.appendChild(iframe);

            iframe.onload = () => {
                setTimeout(() => resolve(iframe), 50); 
            };
            
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            
        } catch (error) {
            reject(error);
        }
    });
}

QUnit.module('Decor Calculator Tests', {
    async beforeEach(assert) {
        this.iframe = await loadCalculatorIntoIframe('decor-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates points and shows goal not reached message', function(assert) {
    this.doc.getElementById('legendary-upgrades').value = '5';
    this.doc.getElementById('epic-upgrades').value = '10';
    this.doc.getElementById('rare-upgrades').value = '20';
    this.doc.getElementById('calculate-button').click();
    const totalPoints = this.doc.getElementById('total-points').textContent;
    const message = this.doc.getElementById('completion-message').textContent;
    assert.equal(totalPoints, '2,610', 'Correctly calculated total points');
    assert.equal(message, 'You need 1,390 more points to reach the goal.', 'Correctly shows "goal not reached" message');
});

QUnit.test('shows congratulations message when goal is met', function(assert) {
    this.doc.getElementById('legendary-upgrades').value = '14';
    this.doc.getElementById('epic-upgrades').value = '0';
    this.doc.getElementById('rare-upgrades').value = '0';
    this.doc.getElementById('calculate-button').click();
    const message = this.doc.getElementById('completion-message').textContent;
    assert.equal(message, 'Congratulations! You have reached the point goal!', 'Correctly shows "congratulations" message');
});

QUnit.module('Castle Calculator Tests', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('castle-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates single level upgrade (15 to 16)', function(assert) {
    this.doc.getElementById('current-level').value = '15';
    this.doc.getElementById('target-level').value = '16';
    this.doc.getElementById('calculate-button').click();
    const resultsHTML = this.doc.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('800,000'), 'Correctly calculates wood/stone cost');
});

QUnit.test('calculates multi-level upgrade with mixed resources (40 to 42)', function(assert) {
    this.doc.getElementById('current-level').value = '40';
    this.doc.getElementById('target-level').value = '42';
    this.doc.getElementById('calculate-button').click();
    const resultsHTML = this.doc.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('199,400,000'), 'Correctly calculates total wood');
    assert.ok(resultsHTML.includes('34,200,000'), 'Correctly calculates total rubies');
    assert.ok(resultsHTML.includes('252'), 'Correctly calculates total essence');
});

QUnit.module('Hero Awakening Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('hero-awakening.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates resources for a single tier upgrade (0 to 1-0)', function(assert) {
    this.doc.getElementById('current-tier').value = '0';
    this.doc.getElementById('target-tier').value = '1-0';
    this.doc.getElementById('calculate-button').click();
    const resultsHTML = this.doc.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('5'), 'Calculated shards correctly');
    assert.ok(resultsHTML.includes('1'), 'Calculated soulstones correctly');
});

QUnit.test('calculates total resources from Tier 0 to Tier 4-0', function(assert) {
    this.doc.getElementById('current-tier').value = '0';
    this.doc.getElementById('target-tier').value = '4-0';
    this.doc.getElementById('calculate-button').click();
    const resultsHTML = this.doc.getElementById('results').innerHTML;
    assert.ok(resultsHTML.includes('365'), 'Correctly calculates total shards');
    assert.ok(resultsHTML.includes('9'), 'Correctly calculates total soulstones');
});

QUnit.module('Hero Shards Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('hero-shard.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates total shards for Legendary hero from None to White ★★★★★', function(assert) {
    const calculator = this.doc.getElementById('legendary-calculator');
    calculator.querySelector('#legendary-current-level').value = '-1';
    calculator.querySelector('#legendary-target-level').value = '14';
    calculator.querySelector('.btn-primary').click();
    const resultsHTML = calculator.querySelector('.results-section').innerHTML;
    assert.ok(resultsHTML.includes('430'), 'Correctly calculates total Legendary shards');
});

QUnit.test('calculates total shards for Mythic hero from Gold ★★★★★ to White ★★★★★', function(assert) {
    const calculator = this.doc.getElementById('mythic-calculator');
    calculator.querySelector('#mythic-current-level').value = '4';
    calculator.querySelector('#mythic-target-level').value = '14';
    calculator.querySelector('.btn-primary').click();
    const resultsHTML = calculator.querySelector('.results-section').innerHTML;
    assert.ok(resultsHTML.includes('720'), 'Correctly calculates partial Mythic shards');
});

QUnit.module('Pet Level & Promotion Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('pet-level.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates total food needed to level up a pet', function(assert) {
    this.doc.getElementById('current-level').value = '1';
    this.doc.getElementById('target-level').value = '20';
    this.doc.getElementById('calculate-level').click();
    assert.equal(this.doc.getElementById('total-food').textContent, '18,900', 'Correctly calculates total food');
});

QUnit.test('calculates rarity promotion cost from Epic to Legendary', function(assert) {
    this.doc.getElementById('rarity-promote-from').value = 'epic';
    this.doc.getElementById('calculate-rarity-promotion').click();
    const detailsHTML = this.doc.getElementById('rarity-promotion-details').innerHTML;
    assert.ok(detailsHTML.includes('5x copies of the same pet'), 'Shows correct same pet cost');
    assert.ok(detailsHTML.includes('15x random Rare pets'), 'Shows correct random rare pet cost');
});

QUnit.test('calculates star promotion cost for Legendary pet', function(assert) {
    this.doc.getElementById('pet-rarity').value = 'legendary';
    this.doc.getElementById('current-rank').value = 'base';
    this.doc.getElementById('target-rank').value = '5';
    this.doc.getElementById('calculate-promotion').click();
    const detailsHTML = this.doc.getElementById('promotion-cost-details').innerHTML;
    assert.ok(detailsHTML.includes('23x copies of the same pet'), 'Correctly totals same pet copies');
    assert.ok(detailsHTML.includes('65x random Rare pets'), 'Correctly totals random rare pets');
    assert.ok(detailsHTML.includes('13,000x essence'), 'Correctly totals essence');
});

QUnit.module('Rune Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('rune-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates the runes needed from level 1 to level 10', function(assert) {
    this.doc.getElementById('current-level').value = '1';
    this.doc.getElementById('target-level').value = '10';
    this.doc.getElementById('calculate-button').click();
    assert.equal(this.doc.getElementById('total-runes').textContent, '19,683', 'Correctly calculates total runes for Lvl 10');
});

QUnit.module('Skill Books Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('skill-books-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates total books needed from level 1 to 15', function(assert) {
    this.doc.getElementById('current-level').value = '1';
    this.doc.getElementById('target-level').value = '15';
    this.doc.getElementById('calculate-button').click();
    assert.equal(this.doc.getElementById('total-books').textContent, '25,000', 'Correctly calculates total books');
});

QUnit.module('Speedups Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('speedup-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates points and remaining time correctly', function(assert) {
    const tabId = 'facilities';
    const tabContent = this.doc.getElementById(tabId);
    tabContent.querySelector(`#days-${tabId}`).value = '10';
    tabContent.querySelector(`#hours-${tabId}`).value = '5';
    tabContent.querySelector(`#minutes-${tabId}`).value = '30';
    tabContent.querySelector(`#s24h-${tabId}`).value = '5';
    tabContent.querySelector(`#s8h-${tabId}`).value = '10';
    tabContent.querySelector('.btn-primary').click();
    const resultsSection = tabContent.querySelector('.results-section');
    assert.ok(resultsSection.innerHTML.includes('10d 5h 30m'), 'Correct Initial Time');
    assert.ok(resultsSection.innerHTML.includes('8d 8h 0m'), 'Correct Speedups Used Time');
    assert.ok(resultsSection.innerHTML.includes('1d 21h 30m'), 'Correct Remaining Time');
    assert.ok(resultsSection.innerHTML.includes('360,000'), 'Correct GAR/KVK Points');
});

QUnit.module('Weapon Calculator', {
    async beforeEach() {
        this.iframe = await loadCalculatorIntoIframe('weapon-calc.html');
        this.doc = this.iframe.contentWindow.document;
    }
});

QUnit.test('calculates total shards needed from level 0 to 20', function(assert) {
    this.doc.getElementById('current-level').value = '0';
    this.doc.getElementById('target-level').value = '20';
    this.doc.getElementById('calculate-button').click();
    assert.equal(this.doc.getElementById('total-shards').textContent, '1,185', 'Correctly calculates total shards');
});

QUnit.test('calculates partial shard upgrade (5 to 10)', function(assert) {
    this.doc.getElementById('current-level').value = '5';
    this.doc.getElementById('target-level').value = '10';
    this.doc.getElementById('calculate-button').click();
    assert.equal(this.doc.getElementById('total-shards').textContent, '200', 'Correctly calculates partial shard cost');
});