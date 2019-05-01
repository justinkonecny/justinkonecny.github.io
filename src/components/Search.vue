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
                            <b-spinner style="color: black; margin: 20px;"></b-spinner>
                        </div>
                    </div>

                    <!--Displays the input fields for desktop devices-->
                    <div v-if="this.window.width > 600">
                        <b-container class="parameters">
                            <b-row>
                                <b-col>
                                    <p class="label">model</p>
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <input class="field field-model" v-model="model">
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min year</p></b-col>
                                <b-col><p class="label">max year</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field" v-model="minYear"></b-col>
                                <b-col><input class="field" v-model="maxYear"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min price ($)</p></b-col>
                                <b-col><p class="label">max price ($)</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field" v-model="minPrice"></b-col>
                                <b-col><input class="field" v-model="maxPrice"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min miles</p></b-col>
                                <b-col><p class="label">max miles</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field" v-model="minMiles"></b-col>
                                <b-col><input class="field" v-model="maxMiles"></b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <button class="button-search" v-on:click="executeSearch()">search</button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <!--Displays the input fields for mobile devices-->
                    <div v-else>
                        <b-container class="parameters-mobile">
                            <b-row>
                                <b-col>
                                    <p class="label">model</p>
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <input class="field-mobile field-model-mobile" v-model="model">
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min year</p></b-col>
                                <b-col><p class="label">max year</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field-mobile" v-model="minYear"></b-col>
                                <b-col><input class="field-mobile" v-model="maxYear"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min price ($)</p></b-col>
                                <b-col><p class="label">max price ($)</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field-mobile" v-model="minPrice"></b-col>
                                <b-col><input class="field-mobile" v-model="maxPrice"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min miles</p></b-col>
                                <b-col><p class="label">max miles</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input class="field-mobile" v-model="minMiles"></b-col>
                                <b-col><input class="field-mobile" v-model="maxMiles"></b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <button class="button-search-mobile" v-on:click="executeSearch()">search</button>
                                </b-col>
                            </b-row>
                        </b-container>
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

    export default {
        name: 'Search',
        components: {
            Results
        },

        created() {
            // Add the window resize listener, update the window width and height
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
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
             * Begins the search for all locations returned by the `getUrls` method.
             */
            executeSearch() {
                let urls = this.getUrls();

                for (let i = 0; i < urls.length; i++) {
                    this.getAndProcessPage(urls[i], this.parseResponse, null);
                }
            },

            /**
             * Processes the user inputted search parameters and returns the proper Craiglist URLS for:
             *  - North Jersey
             *  - Central Jersey
             *  - Jersey Shore
             *  - South Jersey
             * @returns {string[]} The list of URLs to process and search.
             */
            getUrls() {
                let model = this.model;
                let minYear = this.minYear;
                let maxYear = this.maxYear;
                let minPrice = this.minPrice;
                let maxPrice = this.maxPrice;
                let minMiles = this.minMiles;
                let maxMiles = this.maxMiles;

                if (model === '$bmw' || model === '$jeep') {
                    model = model.substring(1);
                    minYear = '2010';
                    maxYear = '2019';
                    minPrice = '5000';
                    maxPrice = '14000';
                    minMiles = '50000';
                    maxMiles = '85000';
                } else if (model === '$mercedes' || model === '$lexus' || model === '$infiniti') {
                    model = model.substring(1);
                    minYear = '2010';
                    maxYear = '2019';
                    minPrice = '5000';
                    maxPrice = '17000';
                    minMiles = '50000';
                    maxMiles = '85000';
                }

                let prefix = 'https://cors.io/?https://';

                let link = '.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
                    + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model
                    + '&min_auto_miles=' + minMiles + '&max_auto_year=' + maxYear
                    + '&min_auto_year=' + minYear + '&auto_title_status=1';

                let urlCentral = prefix + 'cnj' + link;
                let urlNorth = prefix + 'newjersey' + link;
                let urlSouth = prefix + 'southjersey' + link;
                let urlShore = prefix + 'jerseyshore' + link;

                return [
                    urlNorth,
                    urlCentral,
                    urlSouth,
                    urlShore
                ];
            },

            /**
             * Makes an asynchronous GET XMLHttpRequest for the given URL.
             * Upon completion, makes a callback to the given function with at most one parameter.
             * @param {string} url The link to request the page of.
             * @param callback The function to execute after the request is completed.
             * @param par The argument to pass into the callback, or null to execute with no arguments.
             */
            getAndProcessPage(url, callback, par) {
                let anHttpRequest = new XMLHttpRequest();
                anHttpRequest.onreadystatechange = function () {
                    if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200) {
                        let response = document.createElement('html');
                        response.innerHTML = anHttpRequest.responseText;
                        if (callback != null) {
                            if (par != null) {
                                callback(response, par);
                            } else {
                                callback(response);
                            }
                        }
                    }
                };

                anHttpRequest.open('GET', url, true);
                anHttpRequest.send(null);
            },

            /**
             * Parses the HTML page returned from a search and saves all present listings.
             * @param doc The HTML document returned by the XMLHttpRequest.
             */
            parseResponse(doc) {
                let rowsHTML = doc.getElementsByClassName('rows');
                let liHTML = rowsHTML.item(0).getElementsByClassName('result-row');

                // This search 'failed' if no listing results were found
                this.searchFailed = (liHTML.length === 0);

                // Parses the listings titles and creates the advertisements
                for (let i = 0; i < liHTML.length; i++) {
                    let ad_html = liHTML.item(i);
                    let advertisement = {};

                    let par = ad_html.getElementsByTagName('p').item(0);
                    let link = par.getElementsByTagName('a').item(0).getAttribute('href');
                    let location = link.split('.')[0].split('//')[1];

                    // Filters out all vehicles from New York and Philadelphia
                    if (location !== 'newyork' && location !== 'philadelphia') {
                        let title = par.getElementsByClassName('result-title').item(0).innerText;

                        // Filters out duplicate listings (based on duplicate titles)
                        if (this.adTitles.has(title)) {
                            continue;
                        }
                        this.adTitles.add(title);

                        // Parses this listing's posting date
                        let datetime = ad_html.getElementsByTagName('time').item(0).getAttribute('datetime');
                        let date = datetime.split(' ')[0].split('-');
                        let today = new Date();
                        let postDate = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
                        let diffTime = today - postDate;
                        diffTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        // Filters out any post older than 14 days
                        if (diffTime <= this.maxAge) {
                            let price = ad_html.getElementsByClassName("result-price").item(0).innerText;

                            advertisement['title'] = title;
                            advertisement['location'] = location;
                            advertisement['link'] = link;
                            advertisement['date'] = date;
                            advertisement['age'] = diffTime;
                            advertisement['display'] = false;
                            advertisement['price'] = price;
                            advertisement['body'] = '';
                            advertisement['image'] = '';
                            advertisement['imageList'] = [];

                            // Saves this listing to the list of advertisements
                            this.adList.push(advertisement);
                            this.getAndProcessPage(('https://cors.io/?' + link), this.setImageAndInfo, advertisement);
                        }
                    }
                }
            },

            /**
             * Processes and parses the response page for a single advertisement.
             * Saves the advertisement images and body text.
             * @param response The HTML response for a listing from the XMLHttpRequest.
             * @param ad The advertisement this page belongs to.
             */
            setImageAndInfo(response, ad) {
                let imageList = response.getElementsByTagName('img');
                if (imageList.length > 0) {
                    let srcLink = imageList.item(0).getAttribute('src');
                    ad['image'] = srcLink;
                    this.loadCount++;
                }

                let imageThumbs = response.getElementsByClassName('thumb');
                for (let i = 0; i < imageThumbs.length; i++) {
                    let link = imageThumbs.item(i).getAttribute('href');
                    ad['imageList'].push(link);
                }

                let userbody = response.getElementsByClassName('userbody')[0];
                let body = userbody.getElementsByTagName('section')[0];

                ad['body'] = body.innerText.substring(48);
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
        },

        watch: {
            /**
             * Watches the count of completed advertisements and displays the results once all are finished.
             * @param countNew The number of listings that have been fully processed.
             */
            loadCount(countNew) {
                if (countNew > 0 && countNew === this.adList.length) {
                    this.renderModelSelector = false;
                }
            }
        }
    }
</script>

<style scoped>
    p {
        font-size: 18px;
        margin: 5px 0 0 0;
        text-align: center;
        padding: 0;
    }

    table {
        alignment: center;
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
        background-color: var(--grey-bg);
    }

    .parameters {
        width: 504px;
        margin-top: 20px;
    }

    .parameters-mobile {
        width: 90vw;
        margin-top: 15px;
    }

    .field {
        border: 1px solid #d0d0d0;
        font-size: 20px;
        padding: 5px 0 5px 10px;
        margin: 0;
        width: 180px;
    }

    .field-mobile {
        border: 1px solid #d0d0d0;
        font-size: 20px;
        padding: 5px 0 5px 10px;
        margin: 0;
        width: 30vw;
    }

    .field-model {
        width: 435px;
    }

    .field-model-mobile {
        width: 75vw;
    }

    .button-search {
        font-size: 20px;
        padding: 10px;
        font-weight: 700;
        width: 350px;
        margin: 50px 0 0;
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

    .label {
        text-align: left;
        padding-left: 25px;
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
