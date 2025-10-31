document.addEventListener("DOMContentLoaded", () => {
  const currentLevelInput = document.getElementById("current-level");
  const targetLevelInput = document.getElementById("target-level");
  const calculateLevelButton = document.getElementById("calculate-level");
  const totalFoodSpan = document.getElementById("total-food");
  const levelResultsSection = document.getElementById("level-results");

  calculateLevelButton.addEventListener("click", () => {
    const currentLevel = parseInt(currentLevelInput.value) || 1;
    const targetLevel = parseInt(targetLevelInput.value) || 1;
    if (targetLevel <= currentLevel || targetLevel > 90) {
      alert("Target level must be higher than the current level and no more than 90.");
      levelResultsSection.classList.add("hidden");
      return;
    }
    const totalFoodNeeded = calculateTotalFood(currentLevel, targetLevel);
    totalFoodSpan.textContent = totalFoodNeeded.toLocaleString();
    levelResultsSection.classList.remove("hidden");
  });

  function calculateTotalFood(startLevel, endLevel) {
    const levelCosts = [0, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2750, 2900, 3050, 3200, 3350, 3500, 3650, 3800, 3950, 4100, 4300, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 6350, 6600, 6850, 7100, 7350, 7600, 7850, 8100, 8350, 8600, 8850, 9100, 9350, 9600, 9850, 10100, 10350, 10600, 10850, 11100, 11350, 11600, 11900, 12200, 12500, 12800, 13100, 13400, 13700, 14000, 14300, 14600, 14900, 15200, 15500, 15800, 16100, 16400, 16700, 17000, 17300];
    let totalFood = 0;
    for (let level = startLevel + 1; level <= endLevel; level++) {
      totalFood += levelCosts[level - 1];
    }
    return totalFood;
  }

  const promotionData = {
    rare: { 1: { same: 1 }, 2: { randomRare: 3 }, 3: { same: 1 }, 4: { randomRare: 3 }, 5: { same: 1, randomRare: 5 } },
    epic: { 1: { same: 1, randomRare: 5 }, 2: { same: 2, randomRare: 10 }, 3: { same: 3, randomRare: 10 }, 4: { same: 3, randomRare: 10 }, 5: { same: 4, randomRare: 15 } },
    legendary: { 1: { same: 5, randomRare: 15 }, 2: { same: 3, randomRare: 10, essence: 1000 }, 3: { same: 4, randomRare: 15, essence: 2000 }, 4: { same: 5, randomRare: 20, essence: 4000 }, 5: { same: 6, randomRare: 20, essence: 6000 } },
    mythic: { 1: { same: 8, randomRare: 30, essence: 10000 } }
  };

  const rarityPromoteSelect = document.getElementById("rarity-promote-from");
  const calculateRarityButton = document.getElementById("calculate-rarity-promotion");
  const rarityResultsSection = document.getElementById("rarity-promotion-results");
  const rarityDetailsDiv = document.getElementById("rarity-promotion-details");

  const rarityTierMap = {
      rare: 'epic',
      epic: 'legendary',
      legendary: 'mythic'
  };
  
  calculateRarityButton.addEventListener("click", () => {
    const fromRarity = rarityPromoteSelect.value;
    const toRarity = rarityTierMap[fromRarity];
    const costs = promotionData[toRarity] ? promotionData[toRarity][1] : null;

    if (costs) {
      displayCosts(costs, rarityDetailsDiv);
      rarityResultsSection.classList.remove("hidden");
    } else {
      rarityResultsSection.classList.add("hidden");
    }
  });

  const petRaritySelect = document.getElementById("pet-rarity");
  const currentRankSelect = document.getElementById("current-rank");
  const targetRankSelect = document.getElementById("target-rank");
  const calculatePromotionButton = document.getElementById("calculate-promotion");
  const promotionResultsSection = document.getElementById("promotion-results");
  const promotionCostDetailsDiv = document.getElementById("promotion-cost-details");

  calculatePromotionButton.addEventListener("click", () => {
    const petRarity = petRaritySelect.value;
    const currentRank = currentRankSelect.value;
    const targetRank = targetRankSelect.value;
    const rankMap = { base: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
    const start = rankMap[currentRank];
    const end = rankMap[targetRank];

    if (start >= end) {
      alert("Target rank must be higher than the current rank.");
      promotionResultsSection.classList.add("hidden");
      return;
    }
    for (let i = start + 1; i <= end; i++) {
      if (!promotionData[petRarity][i]) {
        alert(`Sorry, promotion data for this rank is not available.`);
        promotionResultsSection.classList.add("hidden");
        return;
      }
    }
    const totalCosts = calculateStarPromotionCost(petRarity, start, end);
    displayCosts(totalCosts, promotionCostDetailsDiv);
    promotionResultsSection.classList.remove("hidden");
  });

  function calculateStarPromotionCost(rarity, startRank, endRank) {
    const totals = { same: 0, randomRare: 0, essence: 0 };
    for (let i = startRank + 1; i <= endRank; i++) {
      const rankData = promotionData[rarity][i];
      if (rankData) {
        totals.same += rankData.same || 0;
        totals.randomRare += rankData.randomRare || 0;
        totals.essence += rankData.essence || 0;
      }
    }
    return totals;
  }

  function displayCosts(costs, element) {
    let html = `<ul>`;
    if (costs.same > 0) html += `<li>${costs.same.toLocaleString()}x copies of the same pet</li>`;
    if (costs.randomRare > 0) html += `<li>${costs.randomRare.toLocaleString()}x random Rare pets</li>`;
    if (costs.essence > 0) html += `<li>${costs.essence.toLocaleString()}x essence</li>`;
    html += `</ul>`;
    if (html === `<ul></ul>`) html = "No resources required for this promotion.";
    element.innerHTML = html;
  }
});