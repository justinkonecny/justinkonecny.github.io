<template>
    <div>
        <div v-if="!renderModelSelector">
            <Results :toDisplay="adList"/>
        </div>
        <div v-else>
            <div class="model-selector">
                <div class="selection">
                    <div class="instructions" v-if="adList.length === 0">
                        <p class="text-header">Looking for a new car?</p>
                        <p class="text-center">Fill out the search options below</p>
                    </div>
                    <div v-else>
                        <div class="text-header">
                        <p>Searching for your match...</p>
                            <b-spinner style="color: black; margin: 20px;"></b-spinner>
                        </div>
                    </div>
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
                                    <button class="button-search" v-on:click="updateParameters()">search</button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
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
                                    <button class="button-search-mobile" v-on:click="updateParameters()">search</button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
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
        name: 'ModelSelector',
        components: {
            Results
        },

        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        },

        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },

        data: function () {
            return {
                adList: [],
                adTitles: new Set(),
                loadCount: 0,
                renderModelSelector: true,
                searchFailed: false,
                parameters: {},
                model: '',
                minYear: '',
                maxYear: '',
                minPrice: '',
                maxPrice: '',
                minMiles: '',
                maxMiles: '',
                window: {
                    width: 0,
                    height: 0
                }
            }
        },

        filters: {
            title: function (str) {
                return str[0].toUpperCase() + str.substr(1);
            }
        },

        methods: {
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

            updateParameters: function () {
                this.parameters = {
                    model: this.model,
                    minYear: this.minYear,
                    maxYear: this.maxYear,
                    minPrice: this.minPrice,
                    maxPrice: this.maxPrice,
                    minMiles: this.minMiles,
                    maxMiles: this.maxMiles
                };
                this.executeSearch();
            },

            executeSearch: function () {
                let urls = this.getUrls();

                for (let i = 0; i < urls.length; i++) {
                    this.getAndProcessPage(urls[i], this.parseResponse, null);
                }
            },

            getUrls: function () {
                let model = this.parameters['model'];
                let minYear = this.parameters['minYear'];
                let maxYear = this.parameters['maxYear'];
                let minPrice = this.parameters['minPrice'];
                let maxPrice = this.parameters['maxPrice'];
                let minMiles = this.parameters['minMiles'];
                let maxMiles = this.parameters['maxMiles'];

                if (model === '$bmw') {
                    model = 'bmw';
                    minYear = '2008';
                    maxYear = '2019';
                    minPrice = '5000';
                    maxPrice = '14000';
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

            getAndProcessPage: function (url, callback, par) {
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

            parseResponse: function (doc) {
                let rowsHTML = doc.getElementsByClassName('rows');
                let liHTML = rowsHTML.item(0).getElementsByClassName('result-row');

                this.searchFailed = (liHTML.length === 0);

                // parses the listings titles and creates the advertisements
                for (let i = 0; i < liHTML.length; i++) {
                    let ad_html = liHTML.item(i);
                    let advertisement = {};

                    let par = ad_html.getElementsByTagName('p').item(0);
                    let link = par.getElementsByTagName('a').item(0).getAttribute('href');
                    let location = link.split('.')[0].split('//')[1];

                    if (location !== 'newyork' && location !== 'philadelphia') {
                        let title = par.getElementsByClassName('result-title').item(0).innerText;

                        if (this.adTitles.has(title)) {
                            continue;
                        }

                        this.adTitles.add(title);

                        let datetime = ad_html.getElementsByTagName('time').item(0).getAttribute('datetime');
                        let date = datetime.split(' ')[0].split('-');
                        let price = ad_html.getElementsByClassName("result-price").item(0).innerText;

                        let today = new Date();
                        let postDate = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
                        let diffTime = today - postDate;
                        diffTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffTime <= 14) {
                            advertisement['title'] = title;
                            advertisement['location'] = location;
                            advertisement['link'] = link;
                            advertisement['date'] = date;
                            advertisement['age'] = diffTime;
                            advertisement['display'] = false;
                            advertisement['price'] = price;
                            advertisement['body'] = '';
                            advertisement['image'] = '';


                            this.adList.push(advertisement);
                            this.getAndProcessPage(('https://cors.io/?' + link), this.setImageAndInfo, advertisement);
                        }
                    }
                }
            },

            setImageAndInfo: function (response, ad) {
                let imageList = response.getElementsByTagName('img');
                if (imageList.length > 0) {
                    ad['image'] = imageList.item(0).getAttribute('src');
                    this.loadCount++;
                } else {
                    ad['image'] = "none";
                }

                let userbody = response.getElementsByClassName('userbody')[0];
                let body = userbody.getElementsByTagName('section')[0];

                ad['body'] = body.innerText.substring(48);
            }
        },

        watch: {
            loadCount: function (countNew) {
                if (countNew === this.adList.length) {
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
        background-color: var(--background);
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
