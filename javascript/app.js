// experiment with strict mode
"use strict";

// ---------- GLOBAL VARIABLES ----------
// variable to hold the navigator.geolocation coordinates
var userLocation;

// variable for google api geocoding
var geocoder;

// variable for google api map
var map;

// variable for google api marker
var marker;

// variable for google service api
var service;

// variable for google infowindow
var infowindow;

// variable to hold the value of #mapZipCode text input field
var mapZipCode;

// variable to hold the city name from the reverse google geocode
var cityName;

// variable to hold the city based on the zipcode inputted by the user in #mapZipCode text input field
var googleMapsCity;

// variable to pass details from openTrailsAPI to google marker
var clickedTrailDetails;

// API keyTag = "&key=AIzaSyCNpDZ-opNGQ_O4Tj5Fh9JaymUItYJ60b8";

// ---------- LOCATORS ----------
//the submit button
var submitButton = $("#submitButton");
var availableTrails = $(".availableTrails");
var mapSearch = $("#mapZipCode");

// ---------- CLICKLISTENERS ----------

// clicklistener for the main submit button in the map section
submitButton.on("click", function(e) {
    e.preventDefault();

    var searchTerm = getMapSearchTerm();

    // if there is no input in text field, load a map of the user's current location
    if (searchTerm.length === 0) {
        initMap(userLocation);

        // if there is input in the text field, load a map showing the result of the user's text
        // include multiple marker's on the map for each location in sidebar
        // have the map center on the zipcode of the search, but have the map populated with markers    
    } else {
        // on button click run google geocode search
        searchAddress(searchTerm);
    }

});

// clicklistener for the trail names populated by openTrailsAPI
$(document).on("click", ".trail", getTrail);

// ========== FUNCTIONS ==========

// this function gets the name of the openAPI generated trail and passes it to a googleMapsTextSearch
function getTrail() {
    var trailName = $(this).data("name");
    console.log(trailName);
    googleMapsTextSearch(trailName);
    console.log(trails);

    for (var i = 0; i < trails.places.length; i++) {
        if (trails.places[i].name.indexOf(trailName) >= 0) {
            console.log(trails.places[i]);
            var description; 
            if (trails.places[i].description) description = trails.places[i].description;
            else description = trails.places[i].activities[0].description;
            clickedTrailDetails = {
                name: trails.places[i].name,
                url: trails.places[i].activities[0].url,
                description: description,
                rating: trails.places[i].activities[0].rating,
                activity_type: trails.places[i].activities[0].activity_type_name,
                directions: trails.places[i].directions,
                picture: trails.places[i].activities[0].thumbnail,
                lat: trails.places[i].lat,
                lng: trails.places[i].lng
            }
        }

    }

    console.log(clickedTrailDetails);
}

// this function uses HTML5 navigator.geolocation to generate a latlng
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError);
    }
}

// performs search through Google API
function searchAddress(searchTerm) {

    // pass user's input to addressInput. May add more terms to this through concatenation.
    var addressInput = searchTerm;

    // user Google geocode to find more complete address information from user's input
    geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: addressInput }, function(results, status) {
        console.log("geocode results", results);

        // if geocode was successful
        if (status == google.maps.GeocoderStatus.OK) {

            // local variables
            var position = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };

            // get local address
            var myResult = results[0].formatted_address;

            // get city name by splicing the string myResult
            var indexSpot = myResult.indexOf(",");
            googleMapsCity = myResult.substr(0, indexSpot).toLowerCase();
            //console.log("googleMapsCity", googleMapsCity);

            // run openTrailsAPI()
            openTrailsAPI(googleMapsCity);

            // createMap showing zipcode searched
            createMap(position, 10);

        }
        // if geocode was not successful, console log error and attempt
        else console.log("geocode was not successful.", status);
    });

}

// this function is supposed to perform a search for nearby parks around the user
function nearbyParksSearch() {

    var request = {
        location: userLocation,
        // defines the distance in meters
        radius: "1000",
        types: [mapZipCode]
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

// nearbyParksSearch and textSearch utilize this callback once they receive their results
function callback(results, status) {
    console.log(results);
    var locations = [];

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var location = [results[i].name, results[i].geometry.location.lat(), results[i].geometry.location.lng()];
            var locationObject = {
                name: results[i].name,
                address: results[i].formatted_address,
                icon: results[i].icon,
                rating: results[i].rating,
                //photos: results[i].photos[0].getUrl(),
                lat: results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng()
            };

            locations.push(location);
            //console.log(place);
        }

        createMarker(locations);
    }
}

function createSoloMarker(pos, map, infowindow) {

    marker = new google.maps.Marker({
        position: pos,
        map: map
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

}

function createMarker(results) {
    //console.log(results);

    // variables for contentString
    var name = clickedTrailDetails.name;
    var url = clickedTrailDetails.url;
    var description = clickedTrailDetails.description;
    var rating = clickedTrailDetails.rating;
    var activity_type = clickedTrailDetails.activity_type;
    var directions = clickedTrailDetails.directions;
    var picture = clickedTrailDetails.picture;
    var lat = clickedTrailDetails.lat;
    var lng = clickedTrailDetails.lng;

    var pos = { lat: results[0][1], lng: results[0][2] };

    map = new google.maps.Map(document.getElementById("mapGoesHere"), {
        center: pos,
        zoom: 15
    });

    for (var i = 0; i < results.length; i++) {

        var position = { lat: results[i][1], lng: results[i][2] };

        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h5 id="firstHeading" class="firstHeading"><em>' + name + '</em></h5>' +
            '<div id="bodyContent">' +
            '<img src="' + picture + '">' + 
            '<p>' + activity_type + '</p>' +
            '<p>' + description + '</p>' +
            '<p><a href="' + url + '">' + url + '</a></p>' +
            '<p>' + rating + '</p>' +
            '<p>' + directions + '</p>' +
            '<p>' + url + '</p>' +
            '</div>' +
            '</div>';

        infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker = new google.maps.Marker({
            position: position,
            map: map
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }
}

// this function creates a google map
function createMap(pos, zoom) {

    map = new google.maps.Map(document.getElementById("mapGoesHere"), {

        center: pos,
        zoom: zoom

    });
}

// this function is supposed to create a map on page load
function initMap(position) {

    createMap(position, 10);

    var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h5 id="firstHeading" class="firstHeading"><em>' + "You are here!" + '</em></h5>' +
        '<div id="bodyContent">' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    createSoloMarker(userLocation, map, infowindow);
}

// pass searchTerm to google's text search service
function googleMapsTextSearch(searchTerm) {

    var request = {
        query: searchTerm
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

}

// success function for navigator.geolocator
function getPositionSuccess(success) {
    userLocation = {
        lat: success.coords.latitude,
        lng: success.coords.longitude
    };

    // create map on startup
    initMap(userLocation);

    //nearbyParksSearch();

    alertify.success("Thank you for letting Hike Finder know your location.");
}

// error function for navigator.geolocator
function getPositionError(error) {
    alertify.error("Please allow Hike Finder to know your location.");
    console.log(error);
}

// get the search term in the map text input field
function getMapSearchTerm() {
    var searchTerm = mapSearch.val();
    mapSearch.val("");
    return searchTerm;
}

// function to use on page start
function startUp() {
    getLocation();


}

// ---------- STARTUP CODE ----------
startUp();




// DEAD CODE DEAD CODE DEAD CODE DEAD CODE DEAD CODE DEAD CODE DEAD CODE DEAD CODE

// !!!!!!!!!! CURRENTLY NOT BEING USED !!!!!!!!!!
// creates a side bar of text input fields
function createSideBar() {

    var createArray = ["street", "city", "state", "zipcode"];

    for (var i = 0; i < createArray.length; i++) {
        var form = $("<form>");
        availableTrails.append(form);

        var div = $("<div>");
        div.addClass('input-field');
        form.append(div);

        //var iClass = $("<i class='material-icons prefix'>search</i>");
        //div.append(iClass);

        var inputText = $("<input>");
        inputText.attr('type', 'text');
        inputText.attr('id', 'input' + createArray[i]);
        inputText.attr('placeholder', createArray[i]);
        inputText.addClass('validate locationInput');
        inputText.css('color', 'white');
        div.append(inputText);

        var label = $("<label>");
        label.attr("for", "input" + createArray[i]);
        div.append(label);

        div.append("<br>");
    }

}
