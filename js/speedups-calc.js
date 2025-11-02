document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsSelect = document.getElementById('calculator-tabs-select');

    const GAR_KVK_CONSTANT = 30;
    const speedupTypes = [
        { id: 's1m', duration: 1, label: '1 Minute' },
        { id: 's5m', duration: 5, label: '5 Minutes' },
        { id: 's15m', duration: 15, label: '15 Minutes' },
        { id: 's30m', duration: 30, label: '30 Minutes' },
        { id: 's60m', duration: 60, label: '1 Hour' },
        { id: 's3h', duration: 180, label: '3 Hours' },
        { id: 's8h', duration: 480, label: '8 Hours' },
        { id: 's24h', duration: 1440, label: '24 Hours' }
    ];

    const tabConfigs = {
        'facilities': { timeLabel: 'Time Remaining for building to be completed', speedupLabel: 'Available Construction Speedups', includePoints: true },
        'technology': { timeLabel: 'Time Remaining for research to be completed', speedupLabel: 'Available Technology Speedups', includePoints: true },
        'egg-hatching': { timeLabel: 'Time Remaining for egg to hatch', speedupLabel: 'Available Universal Speedups', includePoints: false },
        'forging-gear': { timeLabel: 'Time Remaining for gear to forge', speedupLabel: 'Available Forging Speedups', includePoints: false },
        'training-soldiers': { timeLabel: 'Time Remaining for soldiers to train', speedupLabel: 'Available Training Speedups', includePoints: true },
        'healing-soldiers': { timeLabel: 'Time Remaining for soldiers to heal', speedupLabel: 'Available Healing Speedups', includePoints: true }
    };
    
    function formatMinutesToDHM(totalMinutes) {
        if (totalMinutes <= 0) return '0d 0h 0m';
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;
        return `${days}d ${hours}h ${minutes}m`;
    }

    function createCalculatorHTML(tabId) {
        const config = tabConfigs[tabId];
        return `
            <div class="calculator-section">
                <h3>${config.timeLabel}</h3>
                <div class="time-input-group">
                    <div class="input-field"><label for="days-${tabId}">Days</label><input type="number" id="days-${tabId}" min="0" placeholder="0"></div>
                    <div class="input-field"><label for="hours-${tabId}">Hours</label><input type="number" id="hours-${tabId}" min="0" max="23" placeholder="0"></div>
                    <div class="input-field"><label for="minutes-${tabId}">Minutes</label><input type="number" id="minutes-${tabId}" min="0" max="59" placeholder="0"></div>
                </div>
            </div>
            <div class="calculator-section">
                <h3>${config.speedupLabel}</h3>
                <div class="speedups-input-grid">
                    ${speedupTypes.map(s => `<div class="input-field"><label for="${s.id}-${tabId}">${s.label}</label><input type="number" id="${s.id}-${tabId}" min="0" placeholder="0"></div>`).join('')}
                </div>
            </div>
            <div class="calculator-actions">
                <button class="btn-primary"><span>Calculate</span></button>
                <button class="btn-secondary">Reset</button>
            </div>
            <div class="results-section hidden">
                <h3>Calculation Results</h3>
                <div class="results-grid-container"></div>
            </div>
        `;
    }

    function showTab(tabId) {
        tabContents.forEach(content => content.classList.remove('active'));
        tabs.forEach(item => item.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');
        
        tabsSelect.value = tabId;
    }

    tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
    tabsSelect.addEventListener('change', () => showTab(tabsSelect.value));

    tabContents.forEach(content => {
        const tabId = content.id;
        content.innerHTML = createCalculatorHTML(tabId);
        content.querySelector('.btn-primary').addEventListener('click', () => calculate(tabId));
        content.querySelector('.btn-secondary').addEventListener('click', () => reset(tabId));
    });

    function calculate(tabId) {
        const days = parseInt(document.getElementById(`days-${tabId}`).value) || 0;
        const hours = parseInt(document.getElementById(`hours-${tabId}`).value) || 0;
        const minutes = parseInt(document.getElementById(`minutes-${tabId}`).value) || 0;

        let totalMinutes = (days * 1440) + (hours * 60) + minutes;
        let remainingTime = totalMinutes;
        let totalSpeedupMinutesUsed = 0;

        speedupTypes.slice().sort((a, b) => b.duration - a.duration).forEach(speedup => {
            const available = parseInt(document.getElementById(`${speedup.id}-${tabId}`).value) || 0;
            const needed = Math.floor(remainingTime / speedup.duration);
            const toUse = Math.min(available, needed);

            if (toUse > 0) {
                remainingTime -= toUse * speedup.duration;
                totalSpeedupMinutesUsed += toUse * speedup.duration;
            }
        });

        displayResults(tabId, totalMinutes, remainingTime, totalSpeedupMinutesUsed);
    }

    function displayResults(tabId, initialTime, remainingTime, speedupMinutesUsed) {
        const resultsSection = document.querySelector(`#${tabId} .results-section`);
        const summaryContainer = document.querySelector(`#${tabId} .results-grid-container`);
        const config = tabConfigs[tabId];

        const resultsData = [
            { label: 'Initial Time', value: formatMinutesToDHM(initialTime), icon: 'ri-time-line' },
            { label: 'Speedups Used', value: formatMinutesToDHM(speedupMinutesUsed), icon: 'ri-timer-flash-line' },
            { label: 'Time Remaining', value: formatMinutesToDHM(remainingTime), icon: 'ri-hourglass-line' }
        ];

        if (config.includePoints) {
            resultsData.push({ label: 'GAR/KVK Points', value: (speedupMinutesUsed * GAR_KVK_CONSTANT).toLocaleString(), icon: 'ri-medal-line' });
        }
        
        let summaryHTML = `<div class="results-grid">${resultsData.map(item => `
            <div class="result-card">
                <div class="result-card-icon"><i class="${item.icon}"></i></div>
                <div class="result-card-content">
                    <span class="result-card-label">${item.label}</span>
                    <span class="result-card-value">${item.value}</span>
                </div>
            </div>`).join('')}</div>`;
        
        if (remainingTime <= 0) {
            summaryHTML += `<p class="completion-message">Congratulations! The task can be completed with your available speedups.</p>`;
        }

        summaryContainer.innerHTML = summaryHTML;
        resultsSection.classList.remove('hidden');
    }

    function reset(tabId) {
        document.querySelectorAll(`#${tabId} input[type="number"]`).forEach(input => input.value = '');
        document.querySelector(`#${tabId} .results-section`).classList.add('hidden');
    }
});