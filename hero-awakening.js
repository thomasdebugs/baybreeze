document.addEventListener("DOMContentLoaded", () => {
  const currentTierSelect = document.getElementById("current-tier");
  const targetTierSelect = document.getElementById("target-tier");
  const calculateButton = document.getElementById("calculate-button");
  const resultsSection = document.getElementById("results");
  const awakeningBreakdownBody = document.getElementById(
    "awakening-breakdown-body"
  );

  const allTiers = [
    "0",
    "1-0",
    "1-1",
    "1-2",
    "1-3",
    "1-4",
    "1-5",
    "2-0",
    "2-1",
    "2-2",
    "2-3",
    "2-4",
    "2-5",
    "3-0",
    "3-1",
    "3-2",
    "3-3",
    "3-4",
    "3-5",
    "4-0",
  ];

  const awakeningCosts = {
    "1-0": { shards: 5, soulstones: 1 },
    "1-1": { shards: 5, soulstones: 0 },
    "1-2": { shards: 10, soulstones: 0 },
    "1-3": { shards: 10, soulstones: 0 },
    "1-4": { shards: 10, soulstones: 0 },
    "1-5": { shards: 15, soulstones: 0 },
    "2-0": { shards: 15, soulstones: 2 },
    "2-1": { shards: 15, soulstones: 0 },
    "2-2": { shards: 15, soulstones: 0 },
    "2-3": { shards: 15, soulstones: 0 },
    "2-4": { shards: 20, soulstones: 0 },
    "2-5": { shards: 20, soulstones: 0 },
    "3-0": { shards: 20, soulstones: 2 },
    "3-1": { shards: 20, soulstones: 0 },
    "3-2": { shards: 20, soulstones: 0 },
    "3-3": { shards: 30, soulstones: 0 },
    "3-4": { shards: 30, soulstones: 0 },
    "3-5": { shards: 30, soulstones: 0 },
    "4-0": { shards: 40, soulstones: 4 },
  };

  function populateDropdowns() {
    currentTierSelect.innerHTML = "";
    targetTierSelect.innerHTML = "";

    allTiers.forEach((tier) => {
      const option = document.createElement("option");
      option.value = tier;
      option.textContent = `Tier ${tier}`;
      currentTierSelect.appendChild(option);
    });

    allTiers.forEach((tier) => {
      const option = document.createElement("option");
      option.value = tier;
      option.textContent = `Tier ${tier}`;
      targetTierSelect.appendChild(option);
    });

    currentTierSelect.value = "0";
    targetTierSelect.value = "1-0";
  }

  populateDropdowns();

  calculateButton.addEventListener("click", () => {
    const currentTier = currentTierSelect.value;
    const targetTier = targetTierSelect.value;

    const currentIndex = allTiers.indexOf(currentTier);
    const targetIndex = allTiers.indexOf(targetTier);

    if (targetIndex <= currentIndex) {
      alert("Target tier must be higher than the current tier.");
      return;
    }

    let totalShards = 0;
    let totalSoulstones = 0;

    let breakdownHTML = "";
    for (let i = currentIndex + 1; i <= targetIndex; i++) {
      const targetTierKey = allTiers[i];
      const cost = awakeningCosts[targetTierKey];
      if (cost) {
        totalShards += cost.shards;
        totalSoulstones += cost.soulstones;
        breakdownHTML += `<tr><td>Tier ${targetTierKey}</td><td>${cost.shards}</td><td>${cost.soulstones}</td></tr>`;
      }
    }

    resultsSection.innerHTML = `
            <div class="result-card">
                <span class="result-card-label">Total Shards Needed</span>
                <span class="result-card-value">
                    <i class="ri-user-star-line"></i>
                    ${totalShards.toLocaleString()}
                </span>
            </div>

            <div class="result-card">
                <span class="result-card-label">Total Soulstones Needed</span>
                <span class="result-card-value">
                    <i class="ri-gem-line"></i>
                    ${totalSoulstones.toLocaleString()}
                </span>
            </div>

            <h3>Level Breakdown</h3>
            <table class="level-breakdown">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Shards</th>
                        <th>Soulstones</th>
                    </tr>
                </thead>
                <tbody>
                    ${breakdownHTML}
                </tbody>
            </table>
        `;

    resultsSection.classList.remove("hidden");
  });
});
