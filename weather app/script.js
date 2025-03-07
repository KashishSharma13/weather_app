const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initial variables needed??
let currentTab = userTab;
const API_KEY = "64980d544b80373b5823bb973331dfd0";
currentTab.classList.add("current-tab");
getfromSessionStorage();


// switching the tabs .
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    
        if(!searchForm.classList.contains("active")){
            // checking if the serachform is invisible  , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // if searchtab is visible then switch or make usertab visible.
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
             
            // now i am on your weather tab , here we have to display the data also , so we will check the local storage for the coordinates if they are present there.
            getfromSessionStorage();
        }
    }
}
// adding eventlisteners for switch
userTab.addEventListener("click" , () => {
    //passed clicked tab as input parameter.
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    //passed clicked tab as input parameter.
    switchTab(searchTab);
});

// check if coordinates are already present.
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

 async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grantcontainer invisible and loader active.
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // api call
    try{
       const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
       );
       const data = await res.json();

       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");

       // to show dynamically value in UI.
       renderWeatherInfo(data);
    }
    catch(err){
         loadingScreen.classList.remove('active');
    }
 }

 // renderfunction
 function renderWeatherInfo(weatherInfo){

// firstly we will fetch the elements.
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudness]");

 // fetch values from weatherinfo and put it in elements .
   cityName.innerText = weatherInfo?.name,
   countryIcon.src =`https://flagcdn.com/w320/${weatherInfo.sys?.country.toLowerCase()}.png`;
   ;
   desc.innerText =  weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp}°C`;
   windSpeed.innerText= `${weatherInfo?.wind?.speed}m/s`;
   humidity.innerText= `${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText= `${weatherInfo?.clouds?.all}%`;
 }
  
// getting location using geolocation.
  function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // alert show krna hh  no geolocation support available. 
    }
  }

  // showing and fetchinf the position from the given location.
  function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude ,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    }

// access button function 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getlocation);


// searchbutton and searchform function.
const searchInput = document.querySelector("[data-searchInput]");
 searchForm.addEventListener("submit" , (e)=> {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName ==="")
      return;
    else{
        fetchUserWeatherInfoByCity(cityName);
    }
 })
 async function fetchUserWeatherInfoByCity(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove("active");
    try{
       const response = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
       );
       const data = await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err){
        // given as homework.
    }
 }
 
