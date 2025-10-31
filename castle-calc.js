document.addEventListener("DOMContentLoaded", () => {
  const currentLevelSelect = document.getElementById("current-level");
  const targetLevelSelect = document.getElementById("target-level");
  const calculateButton = document.getElementById("calculate-button");
  const resultsSection = document.getElementById("results");

  const castleRequirements = {
    16: { wood_stone: 800000, req: "Guild 14, Training Ground 14" },
    17: { wood_stone: 1000000, req: "Research Cottage 16, Hospital 15" },
    18: { wood_stone: 1250000, req: "Guild 17, Training Ground 16" },
    19: { wood_stone: 1500000, req: "Research Cottage 18, Hospital 18" },
    20: { wood_stone: 1840000, req: "Guild 19, Training Ground 19" },
    21: { wood_stone: 2040000, req: "Research Cottage 20, Hospital 20" },
    22: { wood_stone: 2300000, req: "Guild 21, Training Ground 21" },
    23: { wood_stone: 2680000, req: "Research Cottage 22, Hospital 22" },
    24: { wood_stone: 3550000, req: "Guild 23, Training Ground 23" },
    25: { wood_stone: 5760000, req: "Research Cottage 24, Hospital 24" },
    26: { wood_stone: 6000000, req: "Guild 25, Training Ground 25" },
    27: { wood_stone: 7120000, req: "Research Cottage 26, Hospital 26" },
    28: { wood_stone: 8550000, req: "Guild 27, Training Ground 27" },
    29: { wood_stone: 9970000, req: "Research Cottage 28, Hospital 28" },
    30: { wood_stone: 11800000, req: "Guild 29, Training Ground 29" },
    31: { wood_stone: 13700000, req: "Research Cottage 30, Hospital 30" },
    32: { wood_stone: 17500000, req: "Guild 31, Training Ground 31" },
    33: { wood_stone: 21300000, req: "Research Cottage 32, Hospital 32" },
    34: { wood_stone: 27000000, req: "Guild 33, Training Ground 33" },
    35: { wood_stone: 36100000, req: "Research Cottage 34, Hospital 34" },
    36: { wood_stone: 47500000, req: "Guild 35, Training Ground 35" },
    37: { wood_stone: 61700000, req: "Research Cottage 36, Hospital 36" },
    38: { wood_stone: 90200000, req: "Guild 37, Training Ground 37" },
    39: { wood_stone: 118000000, req: "Research Cottage 38, Hospital 38" },
    40: { wood_stone: 147000000, req: "Guild 39, Training Ground 39" },
    41: {
      wood: 99700000,
      rubies: 17100000,
      essence: 126,
      req: "Research Cottage 40, Hospital 40",
    },
    42: { wood: 99700000, rubies: 17100000, essence: 126, req: "–" },
    43: { wood: 99700000, rubies: 17100000, essence: 126, req: "–" },
    44: { wood: 99700000, rubies: 17100000, essence: 126, req: "–" },
    45: { wood: 99700000, rubies: 17100000, essence: 126, req: "–" },
    46: { wood: 166000000, rubies: 28500000, essence: 151, req: "–" },
    47: {
      wood: 166000000,
      rubies: 28500000,
      essence: 151,
      req: "League Barracks 45, Guild 45",
    },
    48: { wood: 166000000, rubies: 28500000, essence: 151, req: "–" },
    49: { wood: 166000000, rubies: 28500000, essence: 151, req: "–" },
    50: { wood: 166000000, rubies: 28500000, essence: 151, req: "–" },
    51: { wood: 216000000, rubies: 37000000, essence: 227, req: "–" },
    52: {
      wood: 216000000,
      rubies: 37000000,
      essence: 227,
      req: "Horde Barracks 50, Hospital 50",
    },
    53: { wood: 216000000, rubies: 37000000, essence: 227, req: "–" },
    54: { wood: 216000000, rubies: 37000000, essence: 227, req: "–" },
    55: { wood: 216000000, rubies: 37000000, essence: 227, req: "–" },
  };

  function populateDropdowns() {
    const levels = Object.keys(castleRequirements);
    const allLevelsForCurrent = [15, ...levels.map(Number)];
    const allLevelsForTarget = levels.map(Number);

    allLevelsForCurrent.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = `Level ${level}`;
      if (level === 45 || level === 50 || level === 55) {
        const brillianceLvl = level === 45 ? 1 : level === 50 ? 2 : 3;
        option.textContent += ` (Brilliance ${brillianceLvl})`;
      }
      currentLevelSelect.appendChild(option);
    });

    allLevelsForTarget.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = `Level ${level}`;
      if (level === 45 || level === 50 || level === 55) {
        const brillianceLvl = level === 45 ? 1 : level === 50 ? 2 : 3;
        option.textContent += ` (Brilliance ${brillianceLvl})`;
      }
      targetLevelSelect.appendChild(option);
    });

    currentLevelSelect.value = "15";
    targetLevelSelect.value = "16";
  }

  populateDropdowns();

  calculateButton.addEventListener("click", () => {
    const currentLevel = parseInt(currentLevelSelect.value);
    const targetLevel = parseInt(targetLevelSelect.value);

    if (targetLevel <= currentLevel) {
      alert("Target level must be higher than the current level.");
      return;
    }

    let totalWoodStone = 0;
    let totalWood = 0;
    let totalRubies = 0;
    let totalEssence = 0;
    let breakdownHTML = "";

    for (let i = currentLevel + 1; i <= targetLevel; i++) {
      const cost = castleRequirements[i];
      if (cost) {
        if (cost.wood_stone) totalWoodStone += cost.wood_stone;
        if (cost.wood) totalWood += cost.wood;
        if (cost.rubies) totalRubies += cost.rubies;
        if (cost.essence) totalEssence += cost.essence;

        breakdownHTML += `<tr>
            <td data-label="Target Level">Level ${i}</td>
            <td data-label="Wood/Stone">${(
              cost.wood_stone ||
              cost.wood ||
              0
            ).toLocaleString()}</td>
            <td data-label="Rubies">${(cost.rubies || 0).toLocaleString()}</td>
            <td data-label="Dragon Essence">${(
              cost.essence || 0
            ).toLocaleString()}</td>
            <td data-label="Required Buildings">${cost.req}</td>
        </tr>`;
      }
    }

    resultsSection.innerHTML = `
        <h3>Total Upgrade Costs</h3>
        <div class="totals-grid">
            ${
              totalWoodStone > 0
                ? `
            <div class="result-card">
                <span class="result-card-label">Total Wood/Stone</span>
                <span class="result-card-value">
                    <i class="ri-image-2-line"></i> ${totalWoodStone.toLocaleString()}
                </span>
            </div>`
                : ""
            }
            ${
              totalWood > 0
                ? `
            <div class="result-card">
                <span class="result-card-label">Total Wood</span>
                <span class="result-card-value">
                    <i class="ri-image-line"></i> ${totalWood.toLocaleString()}
                </span>
            </div>`
                : ""
            }
            ${
              totalRubies > 0
                ? `
            <div class="result-card">
                <span class="result-card-label">Total Rubies</span>
                <span class="result-card-value">
                    <i class="ri-gem-line"></i> ${totalRubies.toLocaleString()}
                </span>
            </div>`
                : ""
            }
            ${
              totalEssence > 0
                ? `
            <div class="result-card">
                <span class="result-card-label">Total Dragon Essence</span>
                <span class="result-card-value">
                    <i class="ri-fire-line"></i> ${totalEssence.toLocaleString()}
                </span>
            </div>`
                : ""
            }
        </div>

        <h3>Upgrade Breakdown</h3>
        <table class="level-breakdown">
            <thead>
                <tr>
                    <th>Target Level</th>
                    <th>Wood/Stone</th>
                    <th>Rubies</th>
                    <th>Dragon Essence</th>
                    <th>Required Buildings</th>
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
