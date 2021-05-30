//DOM elements
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
//using template string to change variables
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

//an array that'll be used to pass in the data fetched from the api
let resultsArray = [];

//favorites 
let favorites = {};

//Once the data from the api has loaded hide the loader
function showContent(page){
    //after reloading scroll to the top of the page
    window.scrollTo({top: 0, behavior: 'instant'});
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    // console.log('Current Array', page, currentArray);
    currentArray.forEach((result) => {

        //Card container
        const card = document.createElement('div');
        card.classList.add('card');

        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full Image';
        link.target = '_blank_';

        //Image
        const image = document.createElement('img');
        image.src = result.url;
        //if the image doesn't load
        image.alt = 'NASA Picture of the Day';
        //Lazy Load
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        //Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }else{
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);  
        }
        
        //Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        //Footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        //Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        //Append all elements in right order
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
        // console.log(card);
    });
}

function updateDOM(page){
   //Get favorites from local storage
   if(localStorage.getItem('nasaFavorites')){
       favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    //    console.log('favorites from local storage', favorites);
   }
   imagesContainer.textContent = ''; 
   createDOMNodes(page); 
   showContent(page);
}

//Get 10 images from NASA API
async function getNasaPictures() {
    //show the loader
    loader.classList.remove('hidden');
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log(resultsArray);
        updateDOM('results');
    }catch (error) {
        //Catch Error Here
    }
}

//Add result to favorites
function saveFavorite(itemUrl) {
    console.log(itemUrl);
    //Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            // console.log(JSON.stringify(favorites));
            //Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            //Set favorites in browser's local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

//Remove item from favorites
function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        //Set favorites in browser's local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

//On Load
getNasaPictures();