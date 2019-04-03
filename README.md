# Vue Interface for 'websearch-gui'
A gui for another Java project ('websearch-gui'). Searches for personal vehicles on Craiglist, parses the search, and displays the results to the user. Developed to learn Vue.js. The `screenshots/` folder contains images of the current project rendered.

## Project Breakdown
### src/
* `App.vue`: the main App that handles conditional rendering of the ModelSelector, LoadScreen, and Results
* `main.js`: handles making requests to Craglist and parsing the results.
### src/components/
* `ModelSelector.vue`: displays the search screen to the user to enter vehicle parameters
* `LoadScreen.vue`: simple loading screen while results screen is populated
* `Results.vue`: displays the parsed results to the user
