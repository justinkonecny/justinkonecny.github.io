# Liberty Cars (Vue.js)
### Vue Interface for 'websearch_gui'
A user-interface for a Java project ('websearch_gui'). Searches for personal vehicles on Craigslist, parses the search, and displays the results to the user. Developed to learn Vue.js. The `screenshots/` folder contains images of the current project rendered.

## Project Breakdown
### screenshots/
* This folder contains a series of screenshots taken throughout the development of the application.
### src/
* `App.vue`: the main App that handles conditional rendering of the ModelSelector, LoadScreen, and Results.
* `main.js`: handles making requests to Craigslist and parsing the search results.
### src/components/
* `Search.vue`: displays the search screen to the user to enter vehicle parameters; handles parsing user input, initiating the search, filtering the results for valid matches (removes listings that are: older than 14 days, from specific geographic location, or duplicates of already processed matches).
* `Results.vue`: displays the parsed results to the user in a grid-like view (displays image, title, price); allows the user to select any listing and view it in a full-page, detailed view (displays all images, title, location, posting date, listed price, description, and link to original posting).

## Interface
### Search Page
![Alt text](screenshots/Updated_Search.png?raw=true "Search")

### Results Page
![Alt text](screenshots/Updated_Results.png?raw=true "Results")

### Details Page
![Alt text](screenshots/Updated_Details.png?raw=true "Details")
