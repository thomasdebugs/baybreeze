document.addEventListener("DOMContentLoaded", () => {
  const legendaryUpgradesInput = document.getElementById("legendary-upgrades");
  const epicUpgradesInput = document.getElementById("epic-upgrades");
  const rareUpgradesInput = document.getElementById("rare-upgrades");
  const calculateButton = document.getElementById("calculate-button");
  const totalPointsSpan = document.getElementById("total-points");
  const completionMessageP = document.getElementById("completion-message");
  const resultsSection = document.getElementById("results");

  const legendaryPoints = 300;
  const epicPoints = 75;
  const rarePoints = 18;
  const pointsGoal = 4000;

  calculateButton.addEventListener("click", () => {
    const legendaryUpgrades = parseInt(legendaryUpgradesInput.value) || 0;
    const epicUpgrades = parseInt(epicUpgradesInput.value) || 0;
    const rareUpgrades = parseInt(rareUpgradesInput.value) || 0;

    const totalPoints =
      legendaryUpgrades * legendaryPoints +
      epicUpgrades * epicPoints +
      rareUpgrades * rarePoints;

    totalPointsSpan.textContent = totalPoints.toLocaleString();

    if (totalPoints >= pointsGoal) {
      completionMessageP.textContent =
        "Congratulations! You have reached the point goal!";
      completionMessageP.style.color = "var(--highlight-color)";
    } else {
      completionMessageP.textContent = `You need ${(
        pointsGoal - totalPoints
      ).toLocaleString()} more points to reach the goal.`;
      completionMessageP.style.color = "#ff6b6b";
    }

    resultsSection.classList.remove("hidden");
  });
});
