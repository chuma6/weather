'use strict'

window.addEventListener("load",function(){
    
    //constantes
    var key="5546567b569947d08690dc42222e79db";
    var kelvin = 273;
    //variables con el DOM
    var notificationDOM = document.querySelector("#notification")
    var timeDOM = document.querySelector("#time p");
    var iconDOM = document.querySelector("#icon"); 
    var temperatureDOM = document.querySelector("#temperature p");
    var descriptionDOM = document.querySelector("#description p");
    var locationDOM = document.querySelector("#location p");
    var max = document.querySelector("#max p");
    var min = document.querySelector("#min p");
    var tempMax = document.querySelector("#tempMax");
    var tempMin = document.querySelector("#tempMin");
    var sunriseIMG = document.querySelector("#sunrise img");
    var sunsetIMG = document.querySelector("#sunset img");
    var sunrise = document.querySelector("#sunrise p");
    var sunset = document.querySelector("#sunset p");
    //Tiempo
    setInterval(function(){
        var date = new Date();
        var hour = `${date.getHours()}:${date.getMinutes()}`;
        var getDay = 0;
        if(getDay == 0){
            timeDOM.innerHTML = timeDOM.innerHTML = `${hour},<span>Sunday</span>`
        }else{
            var day = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
            timeDOM.innerHTML = `${hour},<span> ${day[getDay-1]}</span>`
        }
    },1000);

    //modelo 
    const weather = {

        icon : './icons/02n.png',
        temperature : {
            value : 23,
            type : "celcius",
            max : 30,
            min : 10
        },
        description : "Clear Weather",
        location : {
            city : "Lérida",
            country : "ES"
        },
        sun : {
            sunrise : "7:00",
            sunset : "20:20"
        }
    }
    
    
    //Ver si el navegador tiene geolocalizador
    if('geolocation'in navigator){
        navigator.geolocation.getCurrentPosition(getLocation,showError);
    }else{
        notificationDOM.style.display = "block";
        notificationDOM.innerHTML="The navigator can not get you're geolocation"
    }
    //Ubicación del usuario
    function getLocation(position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        getWeather(latitude,longitude);
    }
    
    //Mostrar el error en caso de ello
    function showError(error){
        notificationDOM.style.display = "block";
        notificationDOM.innerHTML = `<span>${error.message}</span>`
    }
    //Peticion para obtener el tiempo a través de la API

    function getWeather(latitude,longitude){
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

        fetch(api)
            .then(data => data.json())
            .then(data => {
                console.log(data)
                weather.icon = data.weather[0].icon;
                weather.temperature.value = Math.floor(data.main.temp-kelvin);
                weather.temperature.max = Math.floor(data.main.temp_max-kelvin);
                weather.temperature.min = Math.floor(data.main.temp_min-kelvin);
                weather.description = data.weather[0].description;
                weather.location.city = data.name;
                weather.location.country = data.sys.country;
                weather.sun.sunrise = data.sys.sunrise;
                weather.sun.sunset = data.sys.sunset;
            })
            .then(()=>{
                displayWeather()
            })
    }

    //Obtener y mostrar el tiempo
    function displayWeather(){

        iconDOM.innerHTML = `<img src="./icons/${weather.icon}.png">`;
        temperatureDOM.innerHTML = `${weather.temperature.value}º <span>C</span>`;
        tempMin.innerHTML = `${weather.temperature.min}º C`;
        tempMax.innerHTML = `${weather.temperature.max}º C`;
        descriptionDOM.innerHTML = `${weather.description}`;
        locationDOM.innerHTML = `${weather.location.city}, <span>${weather.location.country}</span>`
    
        var fahrenheit =Math.floor((parseInt(temperatureDOM.innerHTML)*1.8)+32);
        sunrise.innerHTML = `${convert(weather.sun.sunrise)}`;
        sunset.innerHTML = `${convert(weather.sun.sunset)}`
        //CONVERT UNIX TIME

        function convert(unix){
            let unix_timestamp = unix
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var formattedTime = hours + ':' + minutes.substr(-2) ;
            return formattedTime;
        }

        
    
        //Pasar de Celcius a Fahrenheit
        temperatureDOM.addEventListener("click",function(){

            if(weather.temperature.type === 'celcius'){
                temperatureDOM.innerHTML = `${fahrenheit}º <span>F</span>`
                weather.temperature.type = 'fahrenheits'
            }else{
                temperatureDOM.innerHTML = `${weather.temperature.value}º <span>C</span>`
                weather.temperature.type = 'celcius'
            }
        })
    }

    var origen = "translateY(0%)"
    //EFECTOS min max
    temperatureDOM.addEventListener("mouseover",function(){
        max.style.transform = origen;
        max.style.opacity = "1"
        min.style.transform = origen;
        min.style.opacity = "1"
        tempMax.style.transform = origen;
        tempMax.style.opacity = "1"
        tempMin.style.transform = origen;
        tempMin.style.opacity = "1"
    });
    temperatureDOM.addEventListener("mouseleave",function(){
        max.style.transform = 'translateY(-150%)';
        max.style.opacity = "0"
        min.style.transform = 'translateY(-150%)';
        min.style.opacity = "0"
        tempMax.style.transform = 'translateY(150%)';
        tempMax.style.opacity = "0"
        tempMin.style.transform = 'translateY(150%)';
        tempMin.style.opacity = "0"
    });
    //EFECTOS AMANECER Y PUESTA DE SOL
    sunriseIMG.addEventListener("mouseover",function(){
        sunset.style.transform = 'translateY(0%)';
        sunset.style.opacity = "1"
        sunrise.style.transform = 'translateY(0%)';
        sunrise.style.opacity = "1"
    });
    sunsetIMG.addEventListener("mouseover",function(){
        sunset.style.transform = 'translateY(0%)';
        sunset.style.opacity = "1"
        sunrise.style.transform = 'translateY(0%)';
        sunrise.style.opacity = "1"
    });
    sunriseIMG.addEventListener("mouseleave",function(){
        sunset.style.transform = 'translateY(100%)';
        sunset.style.opacity = "0"
        sunrise.style.transform = 'translateY(100%)';
        sunrise.style.opacity = "0"
    });
    sunsetIMG.addEventListener("mouseleave",function(){
        sunset.style.transform = 'translateY(100%)';
        sunset.style.opacity = "0"
        sunrise.style.transform = 'translateY(100%)';
        sunrise.style.opacity = "0"
    });




})
