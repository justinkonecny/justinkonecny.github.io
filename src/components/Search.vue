<template>
    <div>
        <!--If the search has finished, displays the results component-->
        <div v-if="!renderModelSelector">
            <Results :toDisplay="adList" v-on:reloadSearch="reloadPage"/>
        </div>

        <!--Else, display the parameter input page-->
        <div v-else>
            <div class="model-selector">
                <div class="selection">
                    <div class="instructions" v-if="adList.length === 0">
                        <p class="text-header">Looking for a new car?</p>
                        <p class="text-center">Fill out the search options below!</p>
                    </div>
                    <!--Indicates the program has started the search-->
                    <div v-else>
                        <div class="text-header">
                            <p>Searching for your match...</p>
                        </div>
                    </div>

                    <!--Displays the input fields for desktop devices-->
                    <div v-if="window.width > 600" class="container-outer">
                        <div class="container-inner">
                            <div class="row">
                                <div class="col col-full">
                                    <label class="label" for="search-model">model</label>
                                    <input id="search-model" class="field" v-model="model" onkeydown="if (event.keyCode === 13) { document.getElementById('btnSearch').click(); }">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <label class="label" for="search-min-year">min year</label>
                                    <input id="search-min-year" class="field" v-model="minYear">
                                </div>
                                <div class="col">
                                    <label class="label" for="search-max-year">max year</label>
                                    <input id="search-max-year" class="field" v-model="maxYear">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <label class="label" for="search-min-price">min price ($)</label>
                                    <input id="search-min-price" class="field" v-model="minPrice">
                                </div>
                                <div class="col">
                                    <label class="label" for="search-max-price">max price ($)</label>
                                    <input id="search-max-price" class="field" v-model="maxPrice">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <label class="label" for="search-min-miles">min miles</label>
                                    <input id="search-min-miles" class="field" v-model="minMiles">
                                </div>
                                <div class="col">
                                    <label class="label" for="search-max-miles">max miles</label>
                                    <input id="search-max-miles" class="field" v-model="maxMiles">
                                </div>
                            </div>

                            <div class="row">
                                <div class="btn-container">
                                    <button id="btnSearch" class="button-search" v-on:click="executeSearch()">
                                        search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--Displays an error message if the search returns zero results-->
                    <div v-if="searchFailed">
                        <p class="error">It looks like something went wrong, please try again!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Results from './Results.vue';

    const axios = require('axios').default;

    export default {
        name: 'Search',
        components: {
            Results
        },

        created() {
            // Add the window resize listener, update the window width and height
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            this.API_ENDPOINT = 'https://api.jkonecny.com:8443/lc';
            // this.API_ENDPOINT = 'http://localhost:8081/lc';
        },

        destroyed() {
            // Remove the window resize listener
            window.removeEventListener('resize', this.handleResize);
        },

        data() {
            return {
                // The current window width and height
                window: {
                    width: 0,
                    height: 0
                },
                // List of maps, where each entry represents one advertisement listing
                adList: [],
                // List of strings, where each string represents one advertisement title
                adTitles: new Set(),
                // The number of advertisements that have fully loaded (including secondary images)
                loadCount: 0,
                // True to show the search input page, false to show the results page
                renderModelSelector: true,
                // Whether or not the last search failed
                searchFailed: false,
                // The maximum number of days old a post can be
                maxAge: 14,
                // The search parameter (inputted by the user)
                model: '',
                minYear: '',
                maxYear: '',
                minPrice: '',
                maxPrice: '',
                minMiles: '',
                maxMiles: ''
            }
        },

        methods: {
            /**
             * Updates the stored window width and height on the initial page render and on every resize.
             */
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

            /**
             * Begins the search for all locations returned by the `getUrlLocations` method.
             */
            executeSearch() {
                let urlLocations = this.getUrlLocations();
                for (let i = 0; i < urlLocations.length; i++) {

                    setTimeout(() => {
                        const body = this.getRequestBody(urlLocations[i]);
                        this.getAndProcessPage('/search', body, this.parseResponse, null);
                    }, (Math.random() + 1) * 500 * i);

                }

                setTimeout(() => {
                    this.renderModelSelector = false;
                }, urlLocations.length * 500);
            },

            getRequestBody(location) {
                let model = this.model;
                let minYear = this.minYear;
                let maxYear = this.maxYear;
                let minPrice = this.minPrice;
                let maxPrice = this.maxPrice;
                let minMiles = this.minMiles;
                let maxMiles = this.maxMiles;

                if (model === '$bmw' || model === '$jeep') {
                    model = model.substring(1);
                    minYear = 2010;
                    maxYear = 2021;
                    minPrice = 6000;
                    maxPrice = 18000;
                    minMiles = 50000;
                    maxMiles = 85000;
                } else if (model === '$mercedes' || model === '$lexus' || model === '$infiniti') {
                    model = model.substring(1);
                    minYear = 2010;
                    maxYear = 2021;
                    minPrice = 6000;
                    maxPrice = 18000;
                    minMiles = 50000;
                    maxMiles = 85000;
                }

                return {
                    Location: location,
                    Model: model,
                    MinPrice: parseInt(minPrice),
                    MaxPrice: parseInt(maxPrice),
                    MinYear: parseInt(minYear),
                    MaxYear: parseInt(maxYear),
                    MinMiles: parseInt(minMiles),
                    MaxMiles: parseInt(maxMiles)
                };
            },

            /**
             * Processes the user inputted search parameters and returns the proper Craiglist URLS for:
             *  - North Jersey
             *  - Central Jersey
             *  - Jersey Shore
             *  - South Jersey
             * @returns {string[]} The list of URLs to process and search.
             */
            getUrlLocations() {
                return [
                    'cnj',
                    'newjersey',
                    'southjersey',
                    'jerseyshore'
                ];
            },

            /**
             * Makes an asynchronous GET XMLHttpRequest for the given URL.
             * Upon completion, makes a callback to the given function with at most one parameter.
             * @param endpoint
             * @param body
             * @param callback The function to execute after the request is completed.
             * @param par The argument to pass into the callback, or null to execute with no arguments.
             */
            getAndProcessPage(endpoint, body, callback, par) {
                axios.post(`${this.API_ENDPOINT}${endpoint}`, body)
                    .then(response => {
                        const responseDoc = document.createElement('html');
                        responseDoc.innerHTML = response.data;
                        callback(responseDoc, par);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },

            /**
             * Parses the HTML page returned from a search and saves all present listings.
             * @param doc The HTML document returned by the XMLHttpRequest.
             */
            parseResponse(doc) {
                const rowsHTML = doc.getElementsByClassName('rows');
                const liHTML = rowsHTML.item(0).getElementsByClassName('result-row');

                // This search 'failed' if no listing results were found
                this.searchFailed = (liHTML.length === 0);

                // Parses the listings titles and creates the advertisements
                for (let i = 0; i < liHTML.length; i++) {
                    const adHtml = liHTML.item(i);
                    const advertisement = {};

                    const aTag = adHtml.getElementsByTagName('a').item(0);
                    const link = aTag.getAttribute('href');
                    const location = link.split('.')[0].split('//')[1];

                    // Filters out all vehicles from New York and Philadelphia
                    if (location !== 'newyork' && location !== 'philadelphia') {
                        const title = adHtml.getElementsByClassName('result-title').item(0).innerText;

                        // Filters out duplicate listings (based on duplicate titles)
                        if (this.adTitles.has(title)) {
                            continue;
                        }

                        this.adTitles.add(title);

                        // Parses this listing's posting date
                        let datetime = adHtml.getElementsByTagName('time').item(0).getAttribute('datetime');
                        let date = datetime.split(' ')[0].split('-');
                        let today = new Date();
                        let postDate = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
                        let diffTime = today - postDate;
                        diffTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        // Filters out any post older than 14 days
                        if (diffTime <= this.maxAge) {
                            let price = adHtml.getElementsByClassName("result-price").item(0).innerText;

                            const dataIds = aTag.getAttribute('data-ids').split(',');

                            // Parse "data-ids" to build a thumbnail URL
                            let imgUrl = '';
                            for (let dataId of dataIds) {
                                if (dataId.startsWith('3:')) {
                                    imgUrl = `https://images.craigslist.org/${dataId.substring(2)}_300x300.jpg`;
                                    break;
                                }
                            }

                            advertisement['title'] = title;
                            advertisement['location'] = location;
                            advertisement['link'] = link;
                            advertisement['date'] = date;
                            advertisement['age'] = diffTime;
                            advertisement['display'] = false;
                            advertisement['price'] = price;
                            advertisement['body'] = '';
                            advertisement['image'] = imgUrl;
                            advertisement['imageList'] = [];
                            advertisement['loaded'] = false;

                            // Saves this listing to the list of advertisements
                            this.adList.push(advertisement);
                            // this.getAndProcessPage('/listing', body, this.setImageAndInfo, advertisement);
                        }
                    }
                }
            },

            reloadPage() {
                this.adTitles = new Set();
                this.adList = [];
                this.loadCount = 0;
                this.searchFailed = false;
                this.model = '';
                this.minYear = '';
                this.maxYear = '';
                this.minPrice = '';
                this.maxPrice = '';
                this.minMiles = '';
                this.maxMiles = '';
                this.renderModelSelector = true;
            }
        }
    }
</script>

<style scoped>
    p, label {
        font-size: 18px;
        text-align: center;
        padding: 0;
    }

    label {
        margin: 0;
        padding-left: 6px;
    }

    p {
        margin: 5px 0 0 0;
    }

    table {
        alignment: center;
    }

    .col {
        text-align: left;
        margin-right: 10px;
        margin-left: 10px;
    }

    .col-full {
        width: 100%;
    }

    .row {
        display: flex;
        width: 100%;
        margin: 10px 0;
    }

    .text-header {
        text-align: center;
        font-weight: 700;
        font-size: 20px;
    }

    .instructions {
        color: white;
    }

    .model-selector {
        /*background-color: var(--grey-bg);*/
    }

    .container-outer {
        margin-top: 20px;
    }

    .container-inner {
        width: 504px;
        margin: 0 auto;
    }

    .parameters-mobile {
        width: 90vw;
        margin-top: 15px;
    }

    .field {
        border: 1px solid #d0d0d0;
        font-size: 20px;
        padding: 5px 10px;
        margin: 0;
        width: calc(100% - 20px);
    }

    .field-mobile {
        border: 1px solid #d0d0d0;
        font-size: 20px;
        padding: 5px 0 5px 10px;
        margin: 0;
        width: 30vw;
    }

    .field-model-mobile {
        width: 75vw;
    }

    .btn-container {
        margin-left: auto;
        margin-right: auto;
    }

    .button-search {
        font-size: 20px;
        padding: 10px;
        font-weight: 700;
        width: 350px;
        margin: 50px auto;
        border-radius: 5px;
    }

    .button-search-mobile {
        font-size: 20px;
        padding: 10px;
        font-weight: 700;
        width: 60vw;
        margin: 50px 0 0;
        border-radius: 5px;
    }

    .text-center {
        text-align: center;
    }

    .selection {
        padding-top: 50px;
    }

    .error {
        font-weight: 500;
        color: red;
        margin-top: 25px;
    }
</style>
