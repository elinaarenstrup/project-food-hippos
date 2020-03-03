const apiKey = "97571d5097118f221639e9794f1a7f84";
const cityId = 82; //Lisbon
const cuisineId = 83; //Seafood
const url = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&cuisines=${cuisineId}`;
const restaurantContainer = document.getElementById("restaurants");
const priceLow = document.getElementById("lowPrice");
const priceMedium = document.getElementById("mediumPrice");
const priceHigh = document.getElementById("highPrice");
const buttonFilter = document.getElementById("filterButton");
const ratingButton = document.getElementById("rating-button");
const ratingButtonImage = document.getElementById("thumbs");

//Image turns upsidedown when clicked
const toggleImage = () => {
  ratingButtonImage.classList.toggle("turn");
};

//Choosing euro sign/-s from average cost
const priceSymbol = cost => {
  if (cost <= 35) {
    return "€";
  } else if (cost >= 60) {
    return "€€€";
  } else {
    return "€€";
  }
};

//Choosing smiley from rating
const smileIcon = ratingScore => {
  if (ratingScore <= 0.9) {
    iconPath = "smileyicons/1.svg";
  } else if (ratingScore <= 1.9) {
    iconPath = "smileyicons/2.svg";
  } else if (ratingScore <= 2.9) {
    iconPath = "smileyicons/3.svg";
  } else if (ratingScore <= 3.9) {
    iconPath = "smileyicons/4.svg";
  } else if (ratingScore <= 5) {
    iconPath = "smileyicons/5.svg";
  } else {
    iconPath = "smileyicons/cool.svg";
  }
  return iconPath;
};

//Show if table booking is available or not
const noTableBooking = "";

const tableBooking = booking => {
  if (booking === 1) {
    return `<button class="booking-button" id="booking-button">BOOK</button>`;
  } else {
    return noTableBooking;
  }
};

//Fetches data from API
fetch(url, {
  headers: {
    "user-key": apiKey
  }
})
  .then(response => {
    return response.json();
  })
  .then(json => {
    let filteredList = json.restaurants;

    //Show restaurants
    const showRestaurants = () => {
      restaurantContainer.innerHTML = " ";
      filteredList.forEach(resto => {
        restaurantContainer.innerHTML += `<a href= ${
          resto.restaurant.url
        } class="resturant-card"> 
          <img class="restaurant-image" src= ${
            resto.restaurant.photos[0].photo.thumb_url
          }>
        <h3>${resto.restaurant.name}</h3> 
        <div class="b-a-container">
        <p class="address">${resto.restaurant.location.address}</p>
        ${tableBooking(resto.restaurant.has_table_booking)}
        </div>
        <br>
        <p class="average-cost">${priceSymbol(
          resto.restaurant.average_cost_for_two
        )} <img class="smiley" src="${smileIcon(
          resto.restaurant.user_rating.aggregate_rating
        )}" alt="smiley">${resto.restaurant.user_rating.aggregate_rating}</p>
        </a>`;
      });
    };

    //filters restaurants on price range
    const filterPrice = () => {
      if (priceLow.checked) {
        filteredList = json.restaurants.filter(
          item => item.restaurant.average_cost_for_two <= 35
        );
      } else if (priceMedium.checked) {
        filteredList = json.restaurants.filter(
          item =>
            item.restaurant.average_cost_for_two > 35 &&
            item.restaurant.average_cost_for_two < 60
        );
      } else if (priceHigh.checked) {
        filteredList = json.restaurants.filter(
          item => item.restaurant.average_cost_for_two >= 60
        );
      }
      showRestaurants();
    };

    let order = "low";

    //sort restaurants by aggregated rating
    const sortByRating = () => {
      if (order === "low") {
        order = "high";
      } else {
        order = "low";
      }

      if (order === "low") {
        filteredList.sort(
          (a, b) =>
            b.restaurant.user_rating.aggregate_rating -
            a.restaurant.user_rating.aggregate_rating
        );
      } else {
        filteredList.sort(
          (a, b) =>
            a.restaurant.user_rating.aggregate_rating -
            b.restaurant.user_rating.aggregate_rating
        );
      }

      showRestaurants();
    };

    //buttons to call filter and sort functions
    buttonFilter.addEventListener("click", filterPrice);
    ratingButton.addEventListener("click", sortByRating);
    ratingButton.addEventListener("click", toggleImage);

    showRestaurants();
  });
