//APIKey for weatherUnderground
var APIKey = "1e1c93d157bd7be6";

var x = document.getElementById("dayForecast");
//Gets users current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    $(document).ready(function() {
        //======================GET LOCATION NAME FROM LAT AND LONG================================================================
        var queryURLBase = "https://api.wunderground.com/api/" + APIKey + "/geolookup/q/" + position.coords.latitude + "," + position.coords.longitude + ".json";

        //Ajax call to get user location
        $.ajax({
                url: queryURLBase,
                method: 'GET',
                data: {}, // Additional parameters here
                dataType: 'json',
                success: function(data) {},

            })
            .done(function(response) {

                console.log(response);
                console.log("LAT LONG CITY: " + response.location.city);

                // console.log(response.location.city);
                var queryURLT = "http://api.wunderground.com/api/" + APIKey + "/conditions/q/" + response.location.state + "/" + response.location.city + ".json";

                //get weather of the place found by lat and long
                $.ajax({
                    url: queryURLT,
                    method: 'GET',
                    data: {}, // Additional parameters here
                    dataType: 'json',
                    success: function(data) {},

                })

                .done(function(response) {
                    console.log("URL current city: " + queryURLT);
                    console.log("current city JSON: " + response);
                    // $(".locationWeather").empty();

                    // console.log(response.forecast.simpleforecast.forecastday[i].high.fahrenheit, response.forecast.simpleforecast.forecastday[i].low.fahrenheit);

                    //display weather conditions
                    var forecast = $(".locationWeather").append("<div class=\"todayForecast\" ><p id=\"cityName\" font-size = 24px>" + response.current_observation.display_location.full +
                        "</p><p>" + response.current_observation.observation_time +
                        "</p><p><img  src=" + response.current_observation.icon_url +
                        "></p><p>" + response.current_observation.weather +
                        "</p><p id=\"temp\">" + response.current_observation.temperature_string + "<p>Feels like " + response.current_observation.feelslike_string +
                        "</p><p>Wind " + response.current_observation.wind_string + "</p></div>");

                    var p = $(".locationWeather").append(forecast);
                    $("#cityName").css("font-size", "28px");
                    $("#temp").css("font-size", "24px");
                    $(".locationWeather").css("line-height", "25px");
                    $("#weatherIcon").css("width", "70px");
                    $("#weatherIcon").css("height", "70px");

                });



                //Query to get forecast of 10 days based on current location
                var queryURLF = "https://api.wunderground.com/api/" + APIKey + "/forecast10day/q/" + response.location.city + "/zmw:94125.1.99999.json";

                $.ajax({
                    url: queryURLF,
                    method: 'GET',
                    data: {}, // Additional parameters here
                    dataType: 'json',
                    success: function(data) {},

                })

                .done(function(response) {
                    // console.log("URL current city Forecast:" + queryURLF);
                    // console.log("current city JSON Forecast: " + response.forecast);
                    $(".locationForecast").empty();

                    var avgtempforecast = [];

                    for (var i = 0; i < 5; i++) {
                        // console.log(response.forecast.simpleforecast.forecastday[i].high.fahrenheit, response.forecast.simpleforecast.forecastday[i].low.fahrenheit);
                        var a = [];
                        a[i] = (parseInt(response.forecast.simpleforecast.forecastday[i].high.fahrenheit) + parseInt(response.forecast.simpleforecast.forecastday[i].low.fahrenheit));
                        avgtempforecast[i] = a[i] / 2;

                        // console.log("AVG TEMP : " + avgtempforecast[i]);
                        // console.log("a: " + a[i]);

                        var forecast = $(".locationForecast").append("<div class=\"todayForecast\" ><h5>" + response.forecast.simpleforecast.forecastday[i].date.weekday +
                            "</h5><h6><b>" + response.forecast.simpleforecast.forecastday[i].date.monthname + " " + response.forecast.simpleforecast.forecastday[i].date.day +
                            "</b></h6><h4>" + avgtempforecast[i] +
                            "<sup>o</sup>F</h4><img id =\"weatherIcon\"  src=" + response.forecast.simpleforecast.forecastday[i].icon_url +
                            "><h6>" + response.forecast.simpleforecast.forecastday[i].conditions +
                            " </h6><p>Humid " + response.forecast.simpleforecast.forecastday[i].avehumidity +
                            " %</p><p>H: " + response.forecast.simpleforecast.forecastday[i].high.fahrenheit +
                            " <sup>o</sup>F</p>" + " " + "<p>L: " + response.forecast.simpleforecast.forecastday[i].low.fahrenheit + " <sup>o</sup>F</p></div>");
                        var p = $(".locationForecast").append(forecast);
                    }
                });
            });
    });

}
getLocation();




// ================================================weather of different location===================================
// $("#weatherSubmitButton").on("click", function(event) {
//     //remove the location based weather before displaying the search query weather

//     $(".locationWeather").remove();

//     event.preventDefault();
//     //takes the value of user input
//     // var zipOrCity = $("#weatherZipCode").val();

//     var zipOrCity = $("#weatherZipCode").val();
//     //Query to get data based on user input
//     var queryURLB = "http://api.wunderground.com/api/1e1c93d157bd7be6/conditions/q/" + zipOrCity + ".json";
//     // var queryURLB = "https://api.wunderground.com/api/" + APIKey + "/forecast/q/" + zipOrCity + "/zmw:94125.1.99999.json";
//     // console.log(queryURLB);

//     //ajax call to fetch data
//     $.ajax({
//         url: queryURLB,
//         method: 'GET',
//         data: {}, // Additional parameters here
//         dataType: 'json',
//         success: function(data) {},
//     })

//     .done(function(response) {
//         console.log("SUBMIT BUTTON:" + queryURLB);
//         // console.log("SUBMIT BUTTON:"+response);
//         $(".todaysWeather").empty();

//         //display weather conditions
//         var forecast = $(".todaysWeather").append("<div class=\"todayForecast\" ><p id=\"cityName\">" + response.current_observation.display_location.full +
//             "</p><p>" + response.current_observation.observation_time +
//             "</p><p><img id =\"weatherIcon\"  src=" + response.current_observation.icon_url +
//             "></p><p>" + response.current_observation.weather +
//             "</p><p id=\"temp\">" + response.current_observation.temperature_string + "<p>Feels like " + response.current_observation.feelslike_string +
//             "</p><p>Wind " + response.current_observation.wind_string + "</p></div>");

//         //styling for icons and weather parameters
//         var p = $(".todaysWeather").append(forecast);
//         $("#cityName").css("font-size", "28px");
//         $("#temp").css("font-size", "24px");
//         $(".todaysWeather").css("line-height", "25px");
//         $("#weatherIcon").css("width", "70px");
//         $("#weatherIcon").css("height", "70px");

//     });
// });




//display weather forecast for 10 days based on user search
$("#weatherForecastButton").on("click", function(event) {

    //user input validation
    var zipOrCity = $("#weatherZipCode").val();


    // if (isNaN(zipOrCity)) {
    //     if (zipOrCity.includes(",", 1)) {
    //         // console.log(zipOrCity.split(",") + "array");
    //         console.log("text input" + zipOrCity);
    //     }else{
    //       var w = $("#weatherZipCode").append("<p id=\"warning\">Please enter a valid Zip Code</p>");  
    //     }
    // }


    // if (zipOrCity === " ") {
    //     console.log("Enter a valid location");
    // }

    if ((isNaN(zipOrCity)) && zipOrCity.length < 7) {
        console.log("Please enter in format : Austin,TX");
        var w = $("#weatherZipCode").append("<p id=\"warning\">Please enter in format : Austin,TX</p>");
        $("#warning").css("color", "red");
    }



    if (((zipOrCity % 1 === 0) && ((zipOrCity.length) !== 5))) {
        console.log("Invalid Zip Code");
        var w = $("#weatherZipCode").append("<p id=\"warning\">Please enter a valid Zip Code</p>");
        // alert("Please enter a valid Zip Code");
        $("#weatherZipCode").append(w);
        $("#warning").css("color", "red");
    }



    $(".locationForecast").remove();
    event.preventDefault();
    //gets user input value

    //formulate the query base on user input
    var queryURL = "https://api.wunderground.com/api/" + APIKey + "/forecast10day/q/" + zipOrCity + ".json";

    //ajax call to fetch data
    $.ajax({
        url: queryURL,
        method: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json'
    })

    .done(function(response,error) {
        console.log(queryURL);
        console.log("CURRENT: " + response);
        // if (error) {
        //     console.log("ERROR: " + queryURL);
        //     console.log(error.response.error);
        // }


        $(".dailyForecast").empty();
        //gets average weather 
        var avgtempforecast = [];
        for (var i = 0; i < 5; i++) {
            var a = [];
            a[i] = (parseInt(response.forecast.simpleforecast.forecastday[i].high.fahrenheit) + parseInt(response.forecast.simpleforecast.forecastday[i].low.fahrenheit));
            avgtempforecast[i] = a[i] / 2;

            // console.log("AVG TEMP : "+ avgtempforecast[i]);
            // console.log("a: "+ a[i]);

            //create a div and display data
            var forecast = $(".dailyForecast").append("<div class=\"todayForecast\" ><h5>" + response.forecast.simpleforecast.forecastday[i].date.weekday +
                "</h5><h6><b>" + response.forecast.simpleforecast.forecastday[i].date.monthname + " " + response.forecast.simpleforecast.forecastday[i].date.day +
                "</b></h6><h4>" + avgtempforecast[i] +
                "<sup>o</sup>F</h4><img id =\"weatherIcon\" src=" + response.forecast.simpleforecast.forecastday[i].icon_url +
                "><h6>" + response.forecast.simpleforecast.forecastday[i].conditions +
                " </h6><p>Humid " + response.forecast.simpleforecast.forecastday[i].avehumidity +
                "  %</p><p>H: " + response.forecast.simpleforecast.forecastday[i].high.fahrenheit +
                " <sup>o</sup>F</p>" + " " + "<p>L: " + response.forecast.simpleforecast.forecastday[i].low.fahrenheit + " <sup>o</sup>F</p></div>");
            var p = $(".dailyForecast").append(forecast);



        }

    });

});
