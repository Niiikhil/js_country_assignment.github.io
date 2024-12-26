
const all_countries_url = "https://restcountries.com/v3.1/all";

const utcOffsetMapping = {
    "UTC+00:00": "UTC",
    "UTC+01:00": "Europe/Belgrade",
    "UTC+02:00": "Africa/Johannesburg",
    "UTC+03:00": "Africa/Nairobi",
    "UTC+04:00": "Asia/Dubai",
    "UTC+05:00": "Asia/Karachi",
    "UTC+06:00": "Asia/Almaty",
    "UTC+07:00": "Asia/Bangkok",
    "UTC+08:00": "Asia/Singapore",
    "UTC+09:00": "Asia/Tokyo",
    "UTC+10:00": "Australia/Sydney",
    "UTC+11:00": "Pacific/Noumea",
    "UTC+12:00": "Pacific/Fiji",
    "UTC-01:00": "Atlantic/Azores",
    "UTC-02:00": "Atlantic/South_Georgia",
    "UTC-03:00": "America/Argentina/Buenos_Aires",
    "UTC-04:00": "America/Caracas",
    "UTC-05:00": "America/New_York",
    "UTC-06:00": "America/Chicago",
    "UTC-07:00": "America/Denver",
    "UTC-08:00": "America/Los_Angeles",
    "UTC-09:00": "America/Anchorage",
    "UTC-10:00": "Pacific/Honolulu",
    "UTC-11:00": "Pacific/Midway",
    "UTC-12:00": "Pacific/Kwajalein"
};


// Function to clear previously displayed countries
function clearCountryDetails() {
    const countryContainers = document.querySelectorAll(".dynamic-countries");
    countryContainers.forEach(container => container.remove());  // Remove all country containers
}


// Function to get the ordinal suffix for a date
function getOrdinalSuffix(day) {
    const suffixes = ["th", "st", "nd", "rd"];
    const modulo10 = day % 10;
    const modulo100 = day % 100;

    if (modulo10 >= 4 && modulo10 <= 20) {
        return `${day}th`;
    }

    return `${day}${suffixes[modulo10] || suffixes[0]}`;
}




function displayCountryDetails(data) {
    const countryContainer = document.createElement("div");
    countryContainer.classList.add("dynamic-countries", "mt-2");

    const countryImageDiv = document.createElement("div");
    countryImageDiv.classList.add("country-image");
    countryImageDiv.style.width = "150px";
    countryImageDiv.style.height = "100px";

    const countryFlagImg = document.createElement("img");
    countryFlagImg.style.width = "100%";
    countryFlagImg.style.height = "100%";
    countryFlagImg.style.paddingLeft = "15px";
    countryFlagImg.style.paddingRight = "10px";
    countryFlagImg.src = data[0].flags.png || "";  // Ensure the flag URL is present
    countryFlagImg.alt = "flag";
    countryImageDiv.appendChild(countryFlagImg);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("detail-with-buttons", "ps-2");
    detailsDiv.style.width = "320px";
    detailsDiv.style.height = "auto";

    // Country Name
    const countryNameDiv = document.createElement("div");
    countryNameDiv.id = "c-name";
    countryNameDiv.textContent = data[0].name.common || "N/A";
    detailsDiv.appendChild(countryNameDiv);

    // Currency Name
    const currencyDiv = document.createElement("div");
    currencyDiv.id = "currency";
    if (data[0].currencies) {
        const firstCurrencyKey = Object.keys(data[0].currencies)[0];
        const currencyName = firstCurrencyKey ? `Currency: ${data[0].currencies[firstCurrencyKey].name}` : "Currency: N/A";
        currencyDiv.textContent = currencyName;
    } else {
        currencyDiv.textContent = "N/A";
    }
    detailsDiv.appendChild(currencyDiv);

    // Local Time
    const localTimeDiv = document.createElement("div");
    localTimeDiv.id = "c-date";

    if (data[0].timezones && data[0].timezones.length > 0) {
        const timezone = data[0].timezones[0];

        // If timezone matches an offset, map it to a valid IANA timezone
        const mappedTimezone = utcOffsetMapping[timezone] || timezone;

        try {
            // Get the full date and time in the correct format
            const localTime = new Date().toLocaleString("en-US", {
                timeZone: mappedTimezone,
                day: "numeric",    // Get day of the month
                month: "short",    // Get abbreviated month name (e.g., "Dec")
                year: "numeric",   // Get full year
                hour: "2-digit",   // Get hour in 2-digit format
                minute: "2-digit", // Get minute in 2-digit format
            });

            const dateParts = localTime.split(", "); // Split date and time separately
            const [c_month, c_day] = dateParts[0].split(" "); // Separate month and day
            const c_time = dateParts[2]; // Extract the time part

            localTimeDiv.textContent = `Current date and time: ${c_day} ${c_month} ${dateParts[1]}, ${c_time}`;
        } catch (error) {
            localTimeDiv.textContent = `Invalid`;
        }
    } else {
        localTimeDiv.textContent = "None";
    }

    detailsDiv.appendChild(localTimeDiv);

    // Buttons
    const buttonsDiv = document.createElement("div");
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.justifyContent = "space-between";
    buttonsDiv.classList.add("buttons");



    const showMapButton = document.createElement("button");
    showMapButton.textContent = "Show map";






    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // Add event listener for the "Show map" button
    showMapButton.addEventListener("click", () => {
        const countryName = data[0].name.common.toLowerCase();
        const mapUrl = `https://www.google.com/maps/place/${countryName}/`;
        window.open(mapUrl, "_blank"); // Open the map in a new tab
    });

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




    buttonsDiv.appendChild(showMapButton);



    // const detailsButton = document.createElement("button");
    // detailsButton.textContent = "Details";





    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Details";
    detailsButton.addEventListener("click", () => {
        // Redirect to the details page with the country code as a query parameter
        const countryCode = data[0].cca3; // Get the country code
        window.location.href = `details.html?code=${countryCode}`;
    });
    buttonsDiv.appendChild(detailsButton);





    buttonsDiv.appendChild(detailsButton);

    detailsDiv.appendChild(buttonsDiv);

    // Append the elements to the main container
    countryContainer.appendChild(countryImageDiv);
    countryContainer.appendChild(detailsDiv);

    // Append the created country container to the body or a parent container
    document.body.appendChild(countryContainer);
}

// Fetch and display all countries initially
fetch(all_countries_url)
    .then((response) => response.json())
    .then((data) => {
        console.log("data", data);
        if (data) {
            for (const q of data) {
                displayCountryDetails([q]);  // Display each country
            }
        }
    })
    .catch((error) => {
        console.error("Error fetching countries:", error);
    });

// Function to search for a country by name
function searchCountry(countryName) {
    const searchUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=false`;
    console.log("searchUrl", searchUrl);

    // Clear previous search results
    clearCountryDetails();



    // Fetch data from the API
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            console.log("search data", data);
            if (data && data.length > 0) {
                // Loop through the data and display only the search result
                for (const b of data) {
                    displayCountryDetails([b]);  // Display the search result
                }
            } else {
                alert("Country not found!");
            }
        })
        .catch(error => {
            console.error("Error fetching country:", error);
        });
}


// Select the form and input field
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.querySelector("#searchForm .fas.fa-search"); 

console.log("searchForm", searchForm);
console.log("searchInput", searchInput);
console.log("searchIcon", searchIcon);

// add event in searchbox submit
searchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();  
    console.log("evt", evt);


    const countryName = searchInput.value.trim(); 
    console.log("countryName", countryName);


    if (countryName) {
        searchCountry(countryName); 
    }
});

// Add click event to the search icon click 
searchIcon.addEventListener("click", (evt) => {
    evt.preventDefault();  

    // Get the value from the input field
    const countryName = searchInput.value.trim();  
    console.log("countryName", countryName);


    if (countryName) {
        searchCountry(countryName); 
    }
});














