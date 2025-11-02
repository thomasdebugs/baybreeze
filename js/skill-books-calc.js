document.addEventListener("DOMContentLoaded", () => {
    const currentLevelSelect = document.getElementById("current-level");
    const targetLevelSelect = document.getElementById("target-level");
    const calculateButton = document.getElementById("calculate-button");
    const totalBooksSpan = document.getElementById("total-books");
    const resultsSection = document.getElementById("results");
    const levelRequirementsBody = document.getElementById("level-requirements");

    const skillBookRequirements = {
        1: 0,
        2: 100,
        3: 300,
        4: 700,
        5: 1300,
        6: 2100,
        7: 3200,
        8: 4600,
        9: 6300,
        10: 8300,
        11: 10500,
        12: 13200,
        13: 16400,
        14: 20300,
        15: 25000
    };

    calculateButton.addEventListener("click", () => {
        const currentLevel = parseInt(currentLevelSelect.value);
        const targetLevel = parseInt(targetLevelSelect.value);

        if (targetLevel <= currentLevel) {
            alert("Target level must be higher than the current level.");
            resultsSection.classList.add("hidden");
            return;
        }

        let totalBooksNeeded = skillBookRequirements[targetLevel] - skillBookRequirements[currentLevel];

        totalBooksSpan.textContent = totalBooksNeeded.toLocaleString();

        levelRequirementsBody.innerHTML = "";
        for (let i = 1; i <= 15; i++) {
            const row = document.createElement("tr");
            const levelCell = document.createElement("td");
            levelCell.textContent = `Level ${i}`;
            levelCell.style.textAlign = "center";

            const booksCell = document.createElement("td");
            booksCell.textContent = `${skillBookRequirements[i].toLocaleString()} books`;
            booksCell.style.textAlign = "center";

            row.appendChild(levelCell);
            row.appendChild(booksCell);
            levelRequirementsBody.appendChild(row);
        }

        resultsSection.classList.remove("hidden");
    });
});