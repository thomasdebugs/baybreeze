document.addEventListener('DOMContentLoaded', () => {

    const legendaryShardData = [
        { name: 'Gold ★', shards: 5 }, { name: 'Gold ★★', shards: 5 }, { name: 'Gold ★★★', shards: 10 },
        { name: 'Gold ★★★★', shards: 10 }, { name: 'Gold ★★★★★', shards: 20 },
        { name: 'Red ★', shards: 30 }, { name: 'Red ★★', shards: 20 }, { name: 'Red ★★★', shards: 20 },
        { name: 'Red ★★★★', shards: 40 }, { name: 'Red ★★★★★', shards: 40 },
        { name: 'White ★', shards: 80 }, { name: 'White ★★', shards: 20 }, { name: 'White ★★★', shards: 40 },
        { name: 'White ★★★★', shards: 80 }, { name: 'White ★★★★★', shards: 80 }
    ];

    const mythicShardData = [
        { name: 'Gold ★', shards: 10 }, { name: 'Gold ★★', shards: 10 }, { name: 'Gold ★★★', shards: 20 },
        { name: 'Gold ★★★★', shards: 20 }, { name: 'Gold ★★★★★', shards: 40 },
        { name: 'Red ★', shards: 60 }, { name: 'Red ★★', shards: 40 }, { name: 'Red ★★★', shards: 40 },
        { name: 'Red ★★★★', shards: 80 }, { name: 'Red ★★★★★', shards: 80 },
        { name: 'White ★', shards: 160 }, { name: 'White ★★', shards: 40 }, { name: 'White ★★★', shards: 80 },
        { name: 'White ★★★★', shards: 160 }, { name: 'White ★★★★★', shards: 160 }
    ];

    function setupCalculator(type, data) {
        const calculator = document.getElementById(`${type}-calculator`);
        const currentLevelSelect = document.getElementById(`${type}-current-level`);
        const targetLevelSelect = document.getElementById(`${type}-target-level`);
        const calculateBtn = calculator.querySelector('.btn-primary');
        const resultsSection = calculator.querySelector('.results-section');
        const breakdownBody = document.getElementById(`${type}-breakdown-body`);

        // Populate dropdowns
        const optionsHTML = data.map((level, index) => `<option value="${index}">${level.name}</option>`).join('');
        const initialOptionsHTML = `<option value="-1">None</option>${optionsHTML}`;

        currentLevelSelect.innerHTML = initialOptionsHTML;
        targetLevelSelect.innerHTML = optionsHTML;

        // Set default selections
        currentLevelSelect.value = "-1";
        targetLevelSelect.value = data.length - 1;

        calculateBtn.addEventListener('click', () => {
            const currentIndex = parseInt(currentLevelSelect.value);
            const targetIndex = parseInt(targetLevelSelect.value);

            if (targetIndex <= currentIndex) {
                resultsSection.classList.add('hidden');
                return;
            }

            // Calculate the total shards required
            let totalShards = 0;
            for (let i = currentIndex + 1; i <= targetIndex; i++) {
                totalShards += data[i].shards;
            }

            // Generate the level breakdown table
            let breakdownHTML = '';
            for (let i = currentIndex + 1; i <= targetIndex; i++) {
                breakdownHTML += `<tr><td>${data[i].name}</td><td>${data[i].shards}</td></tr>`;
            }

            resultsSection.innerHTML = `
            <div class="result-card">
            <span class="result-card-label">Total Shards Needed</span>
            <span class="result-card-value">
                <i class="ri-user-star-line"></i>
                ${totalShards.toLocaleString()}
            </span>
        </div>
                <h3>Level Breakdown</h3>
                <table class="level-breakdown">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Shards</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${breakdownHTML}
                    </tbody>
                </table>
            `;

            resultsSection.classList.remove('hidden');
        });
    }

    setupCalculator('legendary', legendaryShardData);
    setupCalculator('mythic', mythicShardData);
});