let searchBtn = document.querySelector('.searchBtn');
let closeBtn = document.querySelector('.closeBtn');
let searchBox = document.querySelector('.searchBox');
let header = document.querySelector('header');
let navbar = document.querySelector('.navbar');
let menuToggle = document.querySelector('.menuToggle');

searchBtn.onclick = function(){
    searchBox.classList.add('active');
    closeBtn.classList.add('active');
    searchBtn.classList.add('active');
    menuToggle.classList.add('hide');
    header.classList.remove('open');
}

closeBtn.onclick = function(){
    searchBox.classList.remove('active');
    closeBtn.classList.remove('active');
    searchBtn.classList.remove('active');
    menuToggle.classList.remove('hide');
}
menuToggle.onclick = function() {
    header.classList.toggle('open');
    searchBox.classList.remove('active');
    closeBtn.classList.remove('active');
    searchBtn.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data for the home section (featured drink of the day)
    fetchFeaturedCocktail();

    // Fetch categories and populate dropdown
    fetchCategories();

    // Add event listener for the "Categories" dropdown
    document.querySelector('.dropdown-toggle').addEventListener('click', function (event) {
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        // Toggle the 'show' class on the categories dropdown
        categoriesDropdown.classList.toggle('show');
    });

    // Close the dropdown if a click occurs outside of the dropdown
    document.addEventListener('click', function (event) {
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        if (!event.target.closest('.dropdown')) {
            categoriesDropdown.classList.remove('show');
        }
    });

    // Add click event listener to the anchor tags inside the dropdown
    document.querySelectorAll('.navbar .dropdown-menu a').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
            const selectedCategory = anchor.textContent;
            // Fetch and display drinks for the selected category dynamically
            fetchCocktailsByCategory(selectedCategory);
            // Close the dropdown
            document.getElementById('categoriesDropdown').classList.remove('show');
        });
    });

    // Add event listener to the "Get Recipe" button
    document.querySelectorAll('.drink-card button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Prevent the default click behavior (e.g., following a link)
            event.preventDefault();

            // Access the drink ID from the data attribute or any other way you store it
            const drinkId = button.getAttribute('data-drink-id');

            // Call a function to display the recipe using the drink ID
            displayRecipe(drinkId);
        });
    });
});

function fetchCategories() {
    // Fetch categories from the API
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
        .then(resp => resp.json())
        .then(data => {
            // Populate the categories dropdown dynamically
            const categoriesDropdown = document.getElementById('categoriesDropdown');

            data.drinks.forEach(category => {
                const listItem = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = '#';
                anchor.textContent = category.strCategory;

                // Add click event listener to the anchor tag
                anchor.addEventListener('click', function () {
                    handleCategoryClick(category.strCategory);
                });

                listItem.appendChild(anchor);
                categoriesDropdown.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function handleCategoryClick(selectedCategory) {
    // Handle the click event on list items
    console.log(`Category selected: ${selectedCategory}`);

    // Add your logic to fetch and display drinks for the selected category
    fetchCocktailsByCategory(selectedCategory);
}

function fetchCocktailsByCategory(category) {
    // Fetch drinks from the API based on the selected category
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(resp => resp.json())
        .then(data => {
            // Display the drinks on the page
            displayCocktails(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function fetchFeaturedCocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(resp => resp.json())
        .then(data => {
            // Display the featured cocktail
            displayFeaturedCocktail(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function displayFeaturedCocktail(cocktail) {
    console.log(cocktail.drinks[0]);

    let featuredCocktail = document.getElementById('featuredCocktail');

    let img = document.createElement('img');
    img.src = cocktail.drinks[0].strDrinkThumb;

    featuredCocktail.appendChild(img);

    let cocktailName = document.createElement('h4');
    cocktailName.innerHTML = cocktail.drinks[0].strDrink;

    featuredCocktail.appendChild(cocktailName);

    // Add a container for the "Get Recipe" button
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('recipe-button-container');

    // Create a button
    let recipeButton = document.createElement('button');
    recipeButton.textContent = 'Get Recipe';
    recipeButton.setAttribute('data-drink-id', cocktail.drinks[0].idDrink); // Set the drink ID as a data attribute

    // Add a click event listener to the button
    recipeButton.addEventListener('click', function () {
        // Call a function to display the recipe
        displayRecipe(cocktail.drinks[0].idDrink);
    });

    // Append the button to the container
    buttonContainer.appendChild(recipeButton);

    // Append the button container to the featuredCocktail container
    featuredCocktail.appendChild(buttonContainer);

    // Add event listeners for showing/hiding the button on hover
    featuredCocktail.addEventListener('mouseenter', function () {
        recipeButton.style.display = 'block';
    });

    featuredCocktail.addEventListener('mouseleave', function () {
        recipeButton.style.display = 'none';
    });
}


function displayCocktails(cocktails) {
    // Clear the existing content
    const categoryContent = document.getElementById('categoryContent');
    categoryContent.innerHTML = '';

    // Loop through the drinks and display them on the page
    cocktails.drinks.forEach(drink => {
        const drinkCard = document.createElement('div');
        drinkCard.classList.add('drink-card');

        // Create an image element for the drink
        const drinkImg = document.createElement('img');
        drinkImg.src = drink.strDrinkThumb;
        drinkCard.appendChild(drinkImg);

        // Create a heading element for the drink name
        const drinkName = document.createElement('h4');
        drinkName.innerHTML = drink.strDrink;
        drinkCard.appendChild(drinkName);

        // Create a button for more details or recipe
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Get Recipe';
        detailsButton.setAttribute('data-drink-id', drink.idDrink); // Set the drink ID as a data attribute
        detailsButton.addEventListener('click', function () {
            // Call a function to display the recipe
            displayRecipe(drink.idDrink);
        });
        drinkCard.appendChild(detailsButton);

        // Append the drink card to the category content
        categoryContent.appendChild(drinkCard);
    });
}

function displayRecipe(drinkId) {
    // Add your logic to display the recipe based on the drink ID
    console.log(`Displaying recipe for drink with ID: ${drinkId}`);
    // You can fetch additional details using the drinkId if needed
}

