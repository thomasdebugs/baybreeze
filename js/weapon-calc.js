document.addEventListener("DOMContentLoaded", () => {
  const currentLevelSelect = document.getElementById("current-level");
  const targetLevelSelect = document.getElementById("target-level");
  const calculateButton = document.getElementById("calculate-button");
  const totalShardsSpan = document.getElementById("total-shards");
  const resultsSection = document.getElementById("results");
  const levelBreakdownBody = document.getElementById("level-breakdown-body");

  const shardRequirements = {
    0: { shards: 0, cumulative: 0 },
    1: { shards: 5, cumulative: 5 },
    2: { shards: 10, cumulative: 15 },
    3: { shards: 15, cumulative: 30 },
    4: { shards: 20, cumulative: 50 },
    5: { shards: 25, cumulative: 75 },
    6: { shards: 30, cumulative: 105 },
    7: { shards: 35, cumulative: 140 },
    8: { shards: 40, cumulative: 180 },
    9: { shards: 45, cumulative: 225 },
    10: { shards: 50, cumulative: 275 },
    11: { shards: 55, cumulative: 330 },
    12: { shards: 60, cumulative: 390 },
    13: { shards: 65, cumulative: 455 },
    14: { shards: 70, cumulative: 525 },
    15: { shards: 80, cumulative: 605 },
    16: { shards: 90, cumulative: 695 },
    17: { shards: 100, cumulative: 795 },
    18: { shards: 110, cumulative: 905 },
    19: { shards: 130, cumulative: 1035 },
    20: { shards: 150, cumulative: 1185 },
  };

  calculateButton.addEventListener("click", () => {
    const currentLevel = parseInt(currentLevelSelect.value);
    const targetLevel = parseInt(targetLevelSelect.value);

    if (
      shardRequirements[targetLevel] === undefined ||
      shardRequirements[currentLevel] === undefined
    ) {
      alert("Invalid gear level selected.");
      return;
    }

    if (targetLevel <= currentLevel) {
      alert("Target level must be higher than the current level.");
      return;
    }

    let shardsNeeded =
      shardRequirements[targetLevel].cumulative -
      shardRequirements[currentLevel].cumulative;

    totalShardsSpan.textContent = shardsNeeded.toLocaleString();

    levelBreakdownBody.innerHTML = "";
    
    for (let i = currentLevel + 1; i <= targetLevel; i++) {
      if (shardRequirements[i]) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>Level ${i}</td>
          <td>${shardRequirements[i].shards.toLocaleString()}</td>
          <td>${shardRequirements[i].cumulative.toLocaleString()}</td>
        `;
        levelBreakdownBody.appendChild(row);
      }
    }
    resultsSection.classList.remove("hidden");
  });
});