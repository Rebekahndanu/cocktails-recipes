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

    // Attach click event listener for categories dropdown
    document.querySelector('.navbar').addEventListener('click', function (event) {
        const dropdownToggle = event.target.closest('.dropdown-toggle');
        const categoriesDropdown = document.getElementById('categoriesDropdown');

        if (dropdownToggle) {
            // Toggle the 'show' class on the categories dropdown
            categoriesDropdown.classList.toggle('show');
        } else if (!categoriesDropdown.contains(event.target)) {
            // Close the dropdown if a click occurs outside of the dropdown
            categoriesDropdown.classList.remove('show');
        }
    });

    // Add event listener for the "Categories" dropdown
    document.getElementById('categoriesDropdown').addEventListener('click', function (event) {
        const selectedCategory = event.target.textContent;
        // Fetch and display drinks for the selected category dynamically
        fetchCocktailsByCategory(selectedCategory);
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
        // console.log(data);
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

    

    // Create a button
    let recipeButton = document.createElement('button');
    recipeButton.textContent = 'Get Recipe';
 
    // Add a click event listener to the button
    recipeButton.addEventListener('click', function () {
         // Call a function to display the recipe
         displayRecipe(cocktail.drinks[0].idDrink);
    });
 
    // Append the button to the featuredCocktail container
    featuredCocktail.appendChild(recipeButton);
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
        detailsButton.addEventListener('click', function () {
            // Call a function to display the recipe
            displayRecipe(drink.idDrink);
        });
        drinkCard.appendChild(detailsButton);

        // Append the drink card to the category content
        categoryContent.appendChild(drinkCard);
    });
}

