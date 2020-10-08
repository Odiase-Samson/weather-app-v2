//make sure service worker is supported

if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('serviceworker.js')
            .then(reg => console.log(reg))
            .catch(err => console.log(`Service Worker Error:${err}`))

    })
}


let temp = document.querySelector(".temp");
let desc = document.querySelector(".desc");
let date = document.querySelector(".date");
let searchbtn = document.querySelector(".searchbutton");
let locationbtn = document.querySelector(".location-btn");
let historybtn = document.querySelector(".history-btn");
let form = document.querySelector(".controls");
let searchbox = document.querySelector(".searchbox");
let weatherCard = document.querySelector(".card-container");
let WeatherArray = JSON.parse(localStorage.getItem('weatherdata')) || [];

document.addEventListener('DOMContentLoaded' , function(){
    getWeatherContent(WeatherArray);
    console.log(WeatherArray);
});


let getWeatherContent = (arr) => {
    let mappedArr = arr.map((data) => {
        let unixTimestamp = data.dt;
        let milliseconds = unixTimestamp*1000;
        let dateObject = new Date(milliseconds);
        let humanDateFormat = dateObject.toLocaleString(); 
        
        return `   <div class="cardone">
                        <div> <img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'> </div> 
                        <h2>${data.name}, <em id="cn">${data.sys.country}</em> </h2>
                        <p> <span class= "info">Lat:</span> ${data.coord.lat}&#176; <span class= "info">Long:</span> ${data.coord.lon}&#176; </p>
                        <p> <span class= "info">Weather:</span> ${data.weather[0].main}</p>
                        <p> <span class= "info">Desc:</span> ${data.weather[0].description}</p>
                        <p> <span class= "info">Temp:</span> ${data.main.temp}&#176;C <span class= "info">Hum:</span> ${data.main.humidity} </span>  </>             
                        <p><span class= "info">Date:</span> ${humanDateFormat} </p>
                    </div> `
    })
    mappedArr = mappedArr.join('');
    weatherCard.innerHTML = mappedArr;
}

let GetWeather = (location) => {

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=c14a4f7509aa9d8834a11afacb5e214b`;
    
    fetch(url)
        .then((response) => response.json())
        .then((data) =>{
            WeatherArray.unshift(data);
            console.log(data);
            console.log(WeatherArray);
            localStorage.setItem('weatherdata', JSON.stringify(WeatherArray));
            setTimeout(() => { 
                history.go(0);
            }, 1500);

        })
        .catch((error) => {
            console.log(error);
        });

}

searchbox.addEventListener('keypress', evt => {
    if (evt.keyCode == 13) {
        GetWeather(searchbox.value);
        console.log(searchbox.value);  
        getWeatherContent(WeatherArray);
            
    }
}); 

searchbtn.addEventListener('click', event => {
    event.preventDefault();
        
    GetWeather(searchbox.value);
    console.log(searchbox.value);
    getWeatherContent(WeatherArray);
});

locationbtn.addEventListener('click', ev => { 
    console.log("Location button was clicked");

    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(success, errorCB);
     } else{
         alert('Browser does not Support Geolocation');
     }

     function success (position){
         let lat = position.coords.latitude;
         let long = position.coords.longitude;
         getW(lat, long);
     }

     function errorCB(){
         alert(`ERROR(${error.code}): ${error.message}`);
     }

    function getW(lat, long) {
            let urloc = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=c14a4f7509aa9d8834a11afacb5e214b`;
        
            fetch (urloc)
                .then(function(resp){
                    let datar = resp.json();
                    return datar;
                    })
                .then(function(datar){
                    //work with datar
                    WeatherArray.unshift(datar);
                    console.log(datar);
                    console.log(WeatherArray);
                    localStorage.setItem('weatherdata', JSON.stringify(WeatherArray));
                    setTimeout(() => { 
                        history.go(0);
                    }, 1500);
                    })
                .catch((erro) => {
                    console.log(erro);
                });
        }

});

historybtn.addEventListener('click', ev => { 
    console.log("History or Trash button was clicked");
    if(window.confirm('Do you want to delete your search history')) {
        console.log('User clicked Ok');
        localStorage.clear();
        setTimeout(() => { 
            history.go(0);
        }, 1500);
    }
});

    




