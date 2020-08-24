$("button").click(function () {
  // Upon click, set var to the value of the selected park, 4 letter code in value attr
  var selectedParkCode = $("#selectedPark option:selected").val();
  console.log(selectedParkCode);
  // Call function with 4 letter code to get and display the Park Info
  displayParkInfo(selectedParkCode);
});

//Function to query NPS API, create elements to display, and then populate those elements
function displayParkInfo(parkCode) {
  var APIKey = "6BPdZ6cyQX56QxG57Hw2TAGmPAjp4nzoB7k0d0Lp";

  var queryURL =
    "https://developer.nps.gov/api/v1/parks?parkCode=" +
    parkCode +
    "&api_key=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    //Store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);

      //Create general container to group all park info elements
      var container = document.createElement("div");
      container.setAttribute("class", "container");
      container.setAttribute("id", "parkContainer");
      //Get park name
      var park = document.createElement("div");
      park.setAttribute("class", "park");
      park.innerHTML = "<h3>Park: </h3>" + response.data[0].fullName;

      //Get park website
      var website = document.createElement("a");
      website.setAttribute("id", "website");
      website.setAttribute("href", response.data[0].url);
      website.innerHTML = "<h3>Website: </h3>" + response.data[0].url;

      //Get state where park office located
      var state = document.createElement("div");
      state.setAttribute("id", "state");
      state.innerHTML =
        "<h3>State: </h3>" + response.data[0].addresses[0].stateCode;

      //Get postal code of park office
      var postalCode = document.createElement("div");
      postalCode.setAttribute("class", "postalCode");
      //Set zipcode variable to pass to displayWeather function
      var zipcode = response.data[0].addresses[0].postalCode;
      postalCode.innerHTML = "<h3>ZipCode: </h3>" + zipcode;

      //Get description of park
      var description = document.createElement("div");
      description.setAttribute("id", "description");
      description.innerHTML =
        "<h3>Description: </h3>" + response.data[0].description;

      //Get activities available at park
      var activities = document.createElement("div");
      activities.setAttribute("id", "activities");
      activities.innerHTML = "<h3>Activities: </h3>";

      //Store total activities available at park
      var totalActivities = response.data[0].activities.length;
      console.log(totalActivities);

      //Loop through all activities and append to the list
      for (a = 0; a < totalActivities - 1; a++) {
        //var randomActivities = Math.floor(Math.random() * totalActivities);
        // var activitiesList = response.data[0].activities[randomActivities].name;
        activities.innerHTML += response.data[0].activities[a].name + ", ";
      }

      //Get entrance fees for the park
      var entranceFees = document.createElement("div");
      entranceFees.setAttribute("id", "fees");
      entranceFees.innerHTML =
        "<h3>Entrance Fee: </h3> $" +
        parseFloat(response.data[0].entranceFees[0].cost).toFixed(2);

      //Get image associated to park
      var images = document.createElement("img");
      images.setAttribute("id", "images");
      images.setAttribute("caption", response.data[0].images[0].caption);
      images.setAttribute("title", response.data[0].images[0].title);
      images.setAttribute("src", response.data[0].images[0].url);

      //Appends all of the information to the housing container
      $("#parkContainer").empty();
      container.appendChild(park);
      container.appendChild(website);
      container.appendChild(state);
      container.appendChild(postalCode);
      container.appendChild(description);
      container.appendChild(activities);
      container.appendChild(entranceFees);
      container.appendChild(images);

      //Appends the container to the DOM object with id of '#parksInState'
      document.querySelector("#parksInState").appendChild(container);

      //if activities.length > 0, then iterate through activities to put in list for appending
      // $(".activities").text("Activities: " + response.data[i].activities[0].name + ", " + response.data[0].activities[1].name
      // + ", " + response.data[0].activities[2].name+ ", " + response.data[0].activities[3].name
      // + ", " + response.data[0].activities[4].name);
      // $(".weather").text("Weather Info: " + response.data[i].weatherInfo);
      // $(".postalCode").text("Postal code " + response.data[i].addresses[0].postalCode);
      // };

      //Calls the displayWeather function with zipcode of park passed as linking parameter
      displayWeather(zipcode);
      forecastWeek(zipcode);
    });
  $("#parksInState").empty();
  //Appends all of the information to the housing container
  $("#parkContainer").empty();
}

//Function to query openWeatherMap API, create elements to display, and then populate those elements
async function displayWeather(zipcode) {
  console.log(zipcode);

  const api_url1 =
    "https://api.openweathermap.org/data/2.5/weather?zip=" +
    zipcode +
    "&units=imperial&appid=dca7304415d91489027991b6324c4589";

  const response = await fetch(api_url1);
  const data = await response.json();

  console.log(data);
  //Get Weather info
  const weatherDesc = data.weather[0].description;
  console.log("Weather Desc:" + weatherDesc);
  var weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "<h3>Weather: </h3>" + weatherDesc;

  //Get Temp info
  const temp = data.main.temp;
  var tempDiv = document.getElementById("temp");
  //Added degree symbol
  tempDiv.innerHTML = "<h3>Temperature: </h3>" + temp.toFixed(0) + "\xB0";

  //Get Humidity info
  const humidity = data.main.humidity;
  var humidityDiv = document.getElementById("humidity");
  //Added % symbol
  humidityDiv.innerHTML = "<h3>Humidity: </h3>" + humidity + "%";

  //Added Wind Speed
  const windSpeed = data.wind.speed.toFixed(0);
  var windSpeedDiv = document.getElementById("windSpeed");
  windSpeedDiv.innerHTML = "<h3>Wind Speed: </h3>" + windSpeed + " mph";
}

function forecastWeek(zipcode) {
  console.log(zipcode);
  var queryforcastURL =
    "https://api.openweathermap.org/data/2.5/forecast?zip=" +
    zipcode +
    "&appid=dca7304415d91489027991b6324c4589";
  $.ajax({
    url: queryforcastURL,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < 5; i++) {
      var date = new Date(
        response.list[(i + 1) * 8 - 1].dt * 1000
      ).toLocaleDateString();
      console.log(date);
      var iconcode = response.list[(i + 1) * 8 - 1].weather[0].icon;
      console.log(iconcode);
      var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
      console.log(iconurl);
      var tempK = response.list[(i + 1) * 8 - 1].main.temp;
      console.log(tempK);
      var tempF = ((tempK - 273.5) * 1.8 + 32).toFixed(0);
      console.log(tempF);
      var humidity = response.list[(i + 1) * 8 - 1].main.humidity;
      console.log(humidity);
      $("#fDate" + i).html(date);
      $("#fImg" + i).html("<img src=" + iconurl + ">");
      $("#fTemp" + i).html(tempF + "&#8457");
      $("#fHumidity" + i).html(humidity + "%");
    }
  });
}