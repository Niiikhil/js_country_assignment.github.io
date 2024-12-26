// Get the country code from the URL
const params = new URLSearchParams(window.location.search);
const countryCode = params.get("code");

if (!countryCode) {
    alert("No country code provided!");
    window.location.href = "index.html"; // Redirect to the main page
}

// Fetch country details using the country code
fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then(response => response.json())
    .then(data => {
        const country = data[0];

        // Set the country name in the header
        const countryName = document.getElementById("countryName");
        countryName.textContent = country.name.common;

        // Set the flag
        const countryFlag = document.getElementById("countryFlag");
        const flagImg = document.createElement("img");
        flagImg.src = country.flags.png || "";
        flagImg.alt = `${country.name.common} flag`;
        countryFlag.appendChild(flagImg);

        const countryInfo = document.getElementById("countryInfo");
        countryInfo.innerHTML = `
        <table>
            <tr><td><strong>Native Name:</strong></td><td>${Object.values(country.name.nativeName)[0]?.common || "N/A"}</td></tr>
            <tr><td><strong>Capital:</strong></td><td>${country.capital?.[0] || "N/A"}</td></tr>
            <tr><td><strong>Population:</strong></td><td>${country.population.toLocaleString()}</td></tr>
            <tr><td><strong>Region:</strong></td><td>${country.region}</td></tr>
            <tr><td><strong>Sub-region:</strong></td><td>${country.subregion || "N/A"}</td></tr>
            <tr><td><strong>Area:</strong></td><td>${country.area.toLocaleString()} Km²</td></tr>
            <tr><td><strong>Country Code:</strong></td><td>+${country.idd?.root || ""}${country.idd?.suffixes?.[0] || ""}</td></tr>
            <tr><td><strong>Languages:</strong></td><td>${Object.values(country.languages).join(" and ") || "N/A"}</td></tr>
            <tr><td><strong>Currencies:</strong></td><td>${Object.values(country.currencies).map(c => c.name).join(", ") || "N/A"}</td></tr>
            <tr><td><strong>Timezones:</strong></td><td>${country.timezones.join(", ")}</td></tr>
        </table>
`;


        // Fetch neighbouring countries
        if (country.borders && country.borders.length > 0) {
            const neighbourFlags = document.getElementById("neighbourFlags");

            Promise.all(
                country.borders.map(border =>
                    fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                        .then(response => response.json())
                        .then(data => data[0])
                )
            )
                .then(neighbours => {
                    neighbours.forEach(neighbour => {
                        const img = document.createElement("img");
                        img.src = neighbour.flags.png || "";
                        img.alt = `${neighbour.name.common} flag`;
                        neighbourFlags.appendChild(img);
                    });
                })
                .catch(error => console.error("Error fetching neighbours:", error));
        }
    })
    .catch(error => {
        console.error("Error fetching country details:", error);
        alert("Error fetching country details!");
    });
