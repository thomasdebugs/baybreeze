document.addEventListener("DOMContentLoaded", () => {
    const currentLevelSelect = document.getElementById("current-level");
    const targetLevelSelect = document.getElementById("target-level");
    const calculateButton = document.getElementById("calculate-button");
    const totalRunesSpan = document.getElementById("total-runes");
    const resultsSection = document.getElementById("results");

    // The total worth of each rune level in "Level 1 Runes"
    const runeValues = {
        1: 1,
        2: 3,
        3: 9,
        4: 27,
        5: 81,
        6: 243,
        7: 729,
        8: 2187,
        9: 6561,
        10: 19683,
    };

    calculateButton.addEventListener("click", () => {
        const currentLevel = parseInt(currentLevelSelect.value);
        const targetLevel = parseInt(targetLevelSelect.value);

        if (targetLevel <= currentLevel) {
            alert("Target level must be higher than the current level.");
            resultsSection.classList.add("hidden");
            return;
        }

        let totalLevel1RunesNeeded = 0;

        // Calculate the Level 1 runes needed to reach the target level
        const targetLevel1Runes = runeValues[targetLevel];

        // Output the number of level 1 runes required.
        totalRunesSpan.textContent = targetLevel1Runes.toLocaleString();
        resultsSection.classList.remove("hidden");
    });
});