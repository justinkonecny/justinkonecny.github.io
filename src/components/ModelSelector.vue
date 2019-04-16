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
                    <div>
                        <b-container class="parameters">
                            <b-row>
                                <b-col>
                                    <p class="label">model</p>
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <input class="arg-model" v-model="model">
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min year</p></b-col>
                                <b-col><p class="label">max year</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input v-model="minYear"></b-col>
                                <b-col><input v-model="maxYear"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min price ($)</p></b-col>
                                <b-col><p class="label">max price ($)</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input v-model="minPrice"></b-col>
                                <b-col><input v-model="maxPrice"></b-col>
                            </b-row>

                            <b-row>
                                <b-col><p class="label">min miles</p></b-col>
                                <b-col><p class="label">max miles</p></b-col>
                            </b-row>

                            <b-row>
                                <b-col><input v-model="minMiles"></b-col>
                                <b-col><input v-model="maxMiles"></b-col>
                            </b-row>

                            <b-row>
                                <b-col>
                                    <button v-on:click="updateParameters()">search</button>
                                </b-col>
                            </b-row>
                        </b-container>
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
        data: function () {
            return {
                adList: [],
                loadCount: 0,
                renderModelSelector: true,
                parameters: {},
                model: '',
                minYear: '',
                maxYear: '',
                minPrice: '',
                maxPrice: '',
                minMiles: '',
                maxMiles: ''
            }
        },
        filters: {
            title: function (str) {
                return str[0].toUpperCase() + str.substr(1);
            }
        },
        methods: {
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
                this.getAndProcessPage(urls.nnj, this.parseResponse, null);
            },

            getUrls: function () {
                let model = this.parameters['model'];
                let minYear = this.parameters['minYear'];
                //var maxYear = parameters.maxYear;
                let minPrice = this.parameters['minPrice'];
                let maxPrice = this.parameters['maxPrice'];
                let minMiles = this.parameters['minMiles'];
                let maxMiles = this.parameters['maxMiles'];

                // console.log(this.parameters);

                // let model = 'bmw';
                // let minYear = '2008';
                // //var maxYear = parameters.maxYear;
                // let minPrice = '5000';
                // let maxPrice = '13000';
                // let minMiles = '40000';
                // let maxMiles = '80000';

                let corsPrefix = 'https://cors.io/?';

                // northern new jersey search link
                let urlNorth = corsPrefix + 'https://newjersey.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
                    + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model + '&min_auto_miles=' + minMiles
                    + '&min_auto_year=' + minYear + '&auto_title_status=1';

                let urlCentral = corsPrefix + 'https://cnj.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
                    + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model + '&min_auto_miles=' + minMiles
                    + '&min_auto_year=' + minYear + '&auto_title_status=1';

                let urlSouth = corsPrefix + 'https://southjersey.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
                    + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model + '&min_auto_miles=' + minMiles
                    + '&min_auto_year=' + minYear + '&auto_title_status=1';

                let urlShore = corsPrefix + 'https://jerseyshore.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
                    + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model + '&min_auto_miles=' + minMiles
                    + '&min_auto_year=' + minYear + '&auto_title_status=1';

                return {
                    nnj: urlNorth,
                    cnj: urlCentral,
                    snj: urlSouth,
                    jsnj: urlShore
                };
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

                // let count_total = 0;
                let count_valid = 0;

                // parses the listings titles and creates the advertisements
                for (let i = 0; i < liHTML.length; i++) {
                    let ad_html = liHTML.item(i);
                    let advertisement = {};

                    let par = ad_html.getElementsByTagName('p').item(0);
                    let link = par.getElementsByTagName('a').item(0).getAttribute('href');
                    let location = link.split('.')[0].split('//')[1];

                    if (location !== 'newyork' && location !== 'philadelphia') {
                        let title = par.getElementsByClassName('result-title').item(0).innerText;
                        let datetime = ad_html.getElementsByTagName('time').item(0).getAttribute('datetime');
                        let date = datetime.split(' ')[0].split('-');
                        let price = ad_html.getElementsByClassName("result-price").item(0).innerText;

                        advertisement['title'] = title;
                        advertisement['location'] = location;
                        advertisement['link'] = link;
                        advertisement['date'] = date;
                        advertisement['display'] = false;
                        advertisement['price'] = price;
                        advertisement['body'] = false;
                        advertisement['image'] = "";

                        this.adList.push(advertisement);
                        this.getAndProcessPage(('https://cors.io/?' + link), this.setImageAndInfo, count_valid);

                        count_valid += 1;
                    }
                    // count_total += 1;
                }
            },

            setImageAndInfo: function (response, i) {
                let ad = this.adList[i];
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

    // let adList = [];
    // let loadCount = 0;
</script>

<style scoped>
    input {
        border: 1px solid #d0d0d0;
        font-size: 20px;
        padding: 5px 0 5px 10px;
        margin: 0;
        width: 180px;
    }

    button {
        font-size: 20px;
        padding: 10px;
        font-weight: 700;
        width: 350px;
        margin: 50px 0 0;
        border-radius: 5px;
    }

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
        margin-bottom: 40px;
    }

    .model-selector {
        background-color: var(--background);
        min-width: 500px;
    }


    .arg-model {
        width: 435px;
    }

    .parameters {
        width: 504px;
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
</style>
