const recipes = {
    "Spaghetti Bolognese": {
        ingredients: ["spaghetti", "ground beef", "tomato sauce", "onions", "garlic"],
        instructions: "1. Cook spaghetti. 2. Prepare sauce with ground beef, onions, garlic, and tomato sauce. 3. Combine and serve.",
        calories: 400,
        isVegetarian: false
    },
    "Vegetable Stir Fry": {
        ingredients: ["broccoli", "carrots", "bell peppers", "soy sauce", "garlic", "ginger"],
        instructions: "1. Stir fry vegetables with garlic and ginger. 2. Add soy sauce and cook until vegetables are tender. 3. Serve hot.",
        calories: 250,
        isVegetarian: true
    },
    "Chicken Curry": {
        ingredients: ["chicken", "curry powder", "coconut milk", "onions", "garlic", "ginger"],
        instructions: "1. Cook chicken with onions, garlic, and ginger. 2. Add curry powder and coconut milk. 3. Simmer and serve.",
        calories: 350,
        isVegetarian: false
    },
};


function generateIngredientList() {
    const ingredientsSet = new Set();
    for (const recipe of Object.values(recipes)) {
        recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient));
    }

    const ingredientListDiv = document.getElementById('ingredient-list');
    ingredientListDiv.innerHTML = '';
    const sortedIngredients = Array.from(ingredientsSet).sort();

    sortedIngredients.forEach(ingredient => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ingredient;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}`));
        ingredientListDiv.appendChild(label);
    });

    const searchInput = document.getElementById('ingredient-search-input');
    searchInput.addEventListener('input', () => searchIngredients(searchInput.value.toLowerCase()));
}

function searchIngredients(query) {
    const labels = document.querySelectorAll('#ingredient-list label');
    labels.forEach(label => {
        const ingredient = label.textContent.toLowerCase();
        if (ingredient.includes(query)) {
            label.style.display = 'block';
        } else {
            label.style.display = 'none';
        }
    });
}

function searchRecipe() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '';

    for (const [recipe, details] of Object.entries(recipes)) {
        if (recipe.toLowerCase().includes(query)) {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.innerText = recipe;
            recipeItem.onclick = () => toggleRecipeDetails(recipeItem, recipe);
            resultsSection.appendChild(recipeItem);
        }
    }
}

function toggleRecipeDetails(element, recipeName) {
    const recipeDetailsElement = element.nextElementSibling;
    if (recipeDetailsElement && recipeDetailsElement.classList.contains('recipe-details')) {
        recipeDetailsElement.remove();
    } else {
        const newDetailsElement = document.createElement('div');
        newDetailsElement.className = 'recipe-details';
        displayRecipeDetails(newDetailsElement, recipeName);
        element.parentNode.insertBefore(newDetailsElement, element.nextSibling);
    }
}

function displayRecipeDetails(element, recipeName) {
    const recipeDetails = recipes[recipeName];
    element.innerHTML = `
        <h2>${recipeName}</h2>
        <h3>Ingredients:</h3>
        <ul>${recipeDetails.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        <h3>Instructions:</h3>
        <p>${recipeDetails.instructions}</p>
        <h3>Calories:</h3>
        <p>${recipeDetails.calories} kcal</p>
        <h3>Vegetarian:</h3>
        <p>${recipeDetails.isVegetarian ? "Yes" : "No"}</p>
    `;
}

function filterRecipes() {
    const selectedIngredients = Array.from(document.querySelectorAll('#ingredient-list input:checked')).map(checkbox => checkbox.value.toLowerCase());
    const minCalorieFilter = parseInt(document.getElementById('min-calorie-filter').value, 10);
    const maxCalorieFilter = parseInt(document.getElementById('max-calorie-filter').value, 10);
    const vegFilter = document.getElementById('veg-filter').checked;

    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '';

    for (const [recipe, details] of Object.entries(recipes)) {
        const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every(ingredient => details.ingredients.includes(ingredient));
        const matchesMinCalories = isNaN(minCalorieFilter) || details.calories >= minCalorieFilter;
        const matchesMaxCalories = isNaN(maxCalorieFilter) || details.calories <= maxCalorieFilter;
        const matchesVeg = !vegFilter || details.isVegetarian;

        if (matchesIngredients && matchesMinCalories && matchesMaxCalories && matchesVeg) {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.innerText = recipe;
            recipeItem.onclick = () => toggleRecipeDetails(recipeItem, recipe);
            resultsSection.appendChild(recipeItem);
        }
    }
}

function toggleIngredients(show) {
    const showButton = document.getElementById('show-ingredients');
    const hideButton = document.getElementById('hide-ingredients');
    const ingredientList = document.getElementById('ingredient-list');

    if (show) {
        ingredientList.style.display = 'block';
        showButton.style.display = 'none';
        hideButton.style.display = 'inline-block';
    } else {
        ingredientList.style.display = 'none';
        showButton.style.display = 'inline-block';
        hideButton.style.display = 'none';
    }
}

// Generate ingredient list on page load
window.onload = generateIngredientList;
