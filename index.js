// Selecting DOM elements
let searchBtn = document.querySelector('.searchBtn');
let closeBtn = document.querySelector('.closeBtn');
let searchBox = document.querySelector('.searchBox');
let header = document.querySelector('header');
let navbar = document.querySelector('.navbar');
let menuToggle = document.querySelector('.menuToggle');

// Event handler for search button click
searchBtn.onclick = function () {
    searchBox.classList.add('active');
    closeBtn.classList.add('active');
    searchBtn.classList.add('active');
    menuToggle.classList.add('hide');
    header.classList.remove('open');
}

// Event handler for close button click
closeBtn.onclick = function () {
    searchBox.classList.remove('active');
    closeBtn.classList.remove('active');
    searchBtn.classList.remove('active');
    menuToggle.classList.remove('hide');
}

// Event handler for menu toggle click
menuToggle.onclick = function () {
    header.classList.toggle('open');
    searchBox.classList.remove('active');
    closeBtn.classList.remove('active');
    searchBtn.classList.remove('active');
}

// Event handler for search form submission
document.querySelector('.searchBox input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Call a function to handle the search
        handleSearch();
    }
});

// Event handler for search icon click (submit the search)
searchBtn.addEventListener('click', function () {
    handleSearch();
});

// Function to handle search
function handleSearch() {
    const searchTerm = document.querySelector('.searchBox input').value.trim();

    if (searchTerm !== '') {
        // Call a function to fetch and display the search results
        fetchAndDisplaySearchResults(searchTerm);
    }
}

// Function to fetch and display search results
function fetchAndDisplaySearchResults(searchTerm) {
    
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.drinks && data.drinks.length > 0) {
                const searchedCocktail = data.drinks[0];
                displayRecipeDetails(searchedCocktail);
            } else {
                alert('No results found for the entered drink.');
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Function to display recipe details
function displayRecipeDetails(cocktail) {
    // Create a modal container
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Display detailed recipe information in the modal
    const modalContentHTML = `
        <button class="close-button"><i class="fas fa-times"></i></button>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="modal-image">
        <h2>${cocktail.strDrink}</h2>
        <h3>Ingredients</h3>
        <ul>
            ${generateIngredientsList(cocktail)}
        </ul>
        <h3>Instructions</h3>
        <p>${cocktail.strInstructions}</p>
    `;

    modalContent.innerHTML = modalContentHTML;

    // Append the modal content to the modal container
    modalContainer.appendChild(modalContent);

    // Append the modal container to the body
    document.body.appendChild(modalContainer);

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        // Remove the modal when the close button is clicked
        document.body.removeChild(modalContainer);
});
}

// Function to generate ingredients list
function generateIngredientsList(cocktail) {
    let ingredientsList = '';

    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else if (ingredient) {
            ingredientsList += `<li>${ingredient}</li>`;
        }
    }

    return ingredientsList;
}

// Document ready event listener
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

    // Add event listener to the "Get Recipe" button
    document.querySelectorAll('.drink-card button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Prevent the default click behavior (e.g., following a link)
            event.preventDefault();

            // Access the drink ID from the data attribute or any other way you store it
            const drinkId = button.getAttribute('data-drink-id');

            // Call a function to display the recipe
            displayRecipe(drinkId);
        });
    });
});

// Inside fetchCategories function
function fetchCategories() {
    // Fetch categories from the API
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
        .then(resp => resp.json())
        .then(data => {
            const categoriesDropdown = document.getElementById('categoriesDropdown');

            if (data.drinks.length === 0) {
                // If there are no categories, display a message or add default content
                const noCategoriesMessage = document.createElement('p');
                noCategoriesMessage.textContent = 'No categories available at the moment.';
                categoriesDropdown.appendChild(noCategoriesMessage);
            } else {
                // Populate the categories dropdown dynamically
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
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Function to handle category click
function handleCategoryClick(selectedCategory) {
    // Handle the click event on list items
    console.log(`Category selected: ${selectedCategory}`);

    // Add your logic to fetch and display drinks for the selected category
    fetchCocktailsByCategory(selectedCategory);

    // Scroll to the categoryContent section
    const categoryContentSection = document.getElementById('categoryContent');
    categoryContentSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to fetch cocktails by category
function fetchCocktailsByCategory(category) {
    // Fetch drinks from the API based on the selected category
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(resp => resp.json())
        .then(data => {
            // Display the drinks on the page without showing the category name
            displayCocktails(data.drinks); // Pass the drinks array directly
        })
        .catch(error => {
            console.error(error);
        });
}


// Update the handleCategoryClick function
function handleCategoryClick(selectedCategory) {
    // Handle the click event on list items
    console.log(`Category selected: ${selectedCategory}`);

    // Add your logic to fetch and display drinks for the selected category
    fetchCocktailsByCategory(selectedCategory);

    // Scroll to the categoryContent section
    const categoryContentSection = document.getElementById('categoryContent');
    categoryContentSection.scrollIntoView({ behavior: 'smooth' });

    // Display selected category
    displaySelectedCategory(selectedCategory);
}

// Function to fetch featured cocktail
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

// Function to display featured cocktail
function displayFeaturedCocktail(cocktail) {
    console.log(cocktail.drinks[0]);

    let featuredCocktail = document.getElementById('featuredCocktail');

    // Append label for featured drink of the day
    let featuredLabel = document.createElement('p');
    featuredLabel.innerHTML = 'Featured Drink';
    featuredCocktail.appendChild(featuredLabel);

    let imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    let img = document.createElement('img');
    img.src = cocktail.drinks[0].strDrinkThumb;

    imgContainer.appendChild(img);

    // Create a button
    let recipeButton = document.createElement('button');
    recipeButton.textContent = 'Get Recipe';
    recipeButton.setAttribute('data-drink-id', cocktail.drinks[0].idDrink); // Set the drink ID as a data attribute

    // Initially, hide the button
    recipeButton.style.display = 'none';

    // Add a hover event listener to the imgContainer
    imgContainer.addEventListener('mouseenter', function () {
        recipeButton.style.display = 'block';
    });

    imgContainer.addEventListener('mouseleave', function () {
        recipeButton.style.display = 'none';
    });

    // Add a click event listener to the button
    recipeButton.addEventListener('click', function () {
        // Call a function to display the recipe
        displayRecipe(cocktail.drinks[0].idDrink);
    });

    // Append the button to the imgContainer
    imgContainer.appendChild(recipeButton);

    // Append the imgContainer to the featuredCocktail container
    featuredCocktail.appendChild(imgContainer);

    let cocktailName = document.createElement('h4');
    cocktailName.innerHTML = cocktail.drinks[0].strDrink;

    featuredCocktail.appendChild(cocktailName);
}

// Function to display cocktails
function displayCocktails(cocktails) {
    // Clear the existing content
    const categoryContent = document.getElementById('categoryContent');
    categoryContent.innerHTML = '';

    // Remove the "Selected Category" heading if it exists
    const selectedCategoryHeading = document.querySelector('.selected-category-heading');
    if (selectedCategoryHeading) {
        selectedCategoryHeading.parentNode.removeChild(selectedCategoryHeading);
    }

    // Loop through the first 15 drinks and display them on the page
    cocktails.slice(0, 15).forEach(drink => {
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

// Function to display recipe
function displayRecipe(drinkId) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
        .then(resp => resp.json())
        .then(data => {
            const cocktail = data.drinks[0];
            displayRecipeDetails(cocktail);
        })
        .catch(error => {
            console.error(error);
        });
}

// Function to display selected category
function displaySelectedCategory(selectedCategory) {
    // Add your logic to display the selected category, e.g., update UI or perform actions
    console.log(`Selected Category: ${selectedCategory}`);
}


// Event listener for subscription form submission
document.getElementById('subscriptionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // POST subscriber to server
    fetch('http://localhost:3000/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Subscription successful:', data);
        alert('Subscription successful!');
        // Reset form
        document.getElementById('subscriptionForm').reset();
    })
    .catch(error => {
        console.error('Error subscribing:', error);
        alert('Error subscribing. Please try again.');
    });
});
