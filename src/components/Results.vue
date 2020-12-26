<template>
    <div v-cloak class="results">
        <div class="btn-container">
            <button class="btn-back" v-on:click="back()">back</button>
        </div>

        <!--Displays all listings found-->
        <div v-if="showAllResults">
            <h2>Check out the results below!</h2><br>
            <div class="rows">
                <ul v-for="ad in toDisplay" :key="ad.id">
                    <a :href="ad['link']" target="_blank" rel="noopener noreferrer">
                        <!--                    <ul v-for="ad in toDisplay" :key="ad.id" v-on:click="displayAd(ad)">-->
                        <div class="outline">
                            <div class="inner">
                                <div class="row">
                                    <div class="col">
                                        <img class="img-result" :src="ad['image']" alt="Image">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p class="price">{{ ad['price'] }}</p>
                                        <p>{{ ad['title'] | title }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </ul>
            </div>
        </div>
        <!--Displays one selected listing in more detail-->
        <div v-else>
            <div>
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <div class="img-container">
                                <img class="img-main" :src="currentAd['image']" alt="Image">
                            </div>
                            <img class="thumb" v-for="img in currentAd['imageList']" :key="img.id" v-on:mouseover="showImage(img)" :src="img" alt="Image">
                        </div>
                        <div class="col">
                            <h5>{{ currentAd['title'] }}</h5>
                            <h5>Location</h5>
                            <h6>{{ currentAd['location'] | splitLocation }}</h6>
                            <h5>Date Posted</h5>
                            <h6>{{ currentAd['date'] | date }}</h6>
                            <h5>Price</h5>
                            <h6>{{ currentAd['price'] | title }}</h6>
                            <br>
                            <p><span style="font-weight: 800; font-size: 20px">Check it out <a :href="currentAd['link']" target="_blank" rel="noopener noreferrer">here</a>! </span></p>
                            <p v-if="currentAd['body'] !== false">{{ currentAd['body'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const axios = require('axios').default;

    export default {
        name: 'Results',
        props: {
            // List of maps, where each entry represents one advertisement listing
            toDisplay: Array
        },

        created() {
            // this.API_ENDPOINT = 'https://api.jkonecny.com/lc';
            this.API_ENDPOINT = 'http://localhost:8081/lc';
        },

        data() {
            return {
                // True to display all processed results, false to display one selected advertisement
                showAllResults: true,
                // The advertisement to display in detail, when not showing all results
                currentAd: Array
            }
        },

        filters: {
            /**
             * Given a date in the form of an array (3 elements), returns the date as a string.
             * @param arr The date to format.
             * @returns {string} The date in the form of a string.
             */
            date(arr) {
                return arr[1] + '/' + arr[2] + '/' + arr[0];
            },

            /**
             * Returns the given string with all lower case letters.
             * @param {string} str The string to process.
             * @returns {string} The lower case string.
             */
            lowerCase(str) {
                return str.toLowerCase();
            },

            /**
             * Returns the given string, shortened to 21 characters (all lower case).
             * @param {string} title The string to process.
             * @returns {string} The shortened, lower case string.
             */
            titleLower(title) {
                if (title.length > 21) {
                    return title.substring(0, 22).toLowerCase() + '...';
                } else {
                    return title.toLowerCase();
                }
            },

            /**
             * Returns the given string, shortened to 21 characters.
             * @param {string} title The string to process.
             * @returns {string} The shortened string.
             */
            title(title) {
                if (title.length > 21) {
                    return title.substring(0, 22) + '...';
                } else {
                    return title;
                }
            },

            /**
             * Processes the string representing the listing's geographical location.
             * @param {string} str The location to process.
             * @returns {string} The correct geographic location, or the original string.
             */
            splitLocation(str) {
                if (str === 'newjersey') {
                    return 'New Jersey';
                } else if (str === 'cnj') {
                    return 'Central New Jersey';
                } else if (str === 'jerseyshore') {
                    return 'Jersey Shore';
                } else if (str === 'southjersey') {
                    return 'South Jersey';
                } else if (str === 'delaware') {
                    return 'Delaware';
                } else if (str === 'longisland') {
                    return 'Long Island';
                } else {
                    return str;
                }
            }
        },

        methods: {
            /**
             * Displays the given advertisement, or hides the advertisement if it's already displayed.
             * @param ad The advertisement to display/hide.
             */
            displayAd(ad) {
                if (ad['display']) {
                    ad['display'] = false;
                    this.showAllResults = true;
                } else {
                    ad['display'] = true;
                    this.currentAd = ad;
                    this.showAllResults = false;

                    console.log(ad);

                    if (!ad['loaded']) {
                        const body = {Link: ad['link']};
                        this.getAndProcessPage('/listing', body, this.setImageAndInfo, ad);
                    }

                }
            },

            /**
             * Handles returning from one advertisement to the list of results, or from the list of results to a new search.
             */
            back() {
                if (this.currentAd['display'] === true) {
                    this.displayAd(this.currentAd);
                } else {
                    this.$emit('reloadSearch');
                }

            },

            /**
             * Updates the displayed advertisement image to the new given image.
             *
             * @param {string} newSrc the new image to display (src).
             */
            showImage(newSrc) {
                this.currentAd['image'] = newSrc;
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
             * Processes and parses the response page for a single advertisement.
             * Saves the advertisement images and body text.
             * @param response The HTML response for a listing from the XMLHttpRequest.
             * @param ad The advertisement this page belongs to.
             */
            setImageAndInfo(response, ad) {
                const imageThumbs = response.getElementsByClassName('thumb');
                for (let i = 0; i < imageThumbs.length; i++) {
                    let link = imageThumbs.item(i).getAttribute('href');
                    ad['imageList'].push(link);
                }

                let userbody = response.getElementsByClassName('userbody')[0];
                let body = userbody.getElementsByTagName('section')[0];

                ad['body'] = body.innerText.substring(48);

                ad['loaded'] = true;
            }
        }
    }
</script>

<style scoped>
    h2 {
        padding: 0;
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        color: var(--dark-grey);
    }

    h5 {
        font-size: 21px;
        font-weight: 700;
        color: var(--dark-grey);
        margin: 15px 0 0 2px;
    }

    h6 {
        font-size: 18px;
        font-weight: 500;
        color: var(--dark-grey);
        margin: 0;
    }

    p {
        font-size: 17px;
        font-weight: 500;
        padding: 0;
        margin: 0;
        text-align: left;
        alignment: left;
    }

    ul {
        margin: 2%;
        display: inline-grid;
        min-height: 250px;
        padding: 0;
        color: black;
        font-size: 18px;
        font-weight: 500;
        text-align: left;
    }

    ul:hover {
        background-color: rgba(92, 107, 192, 0.4);
        cursor: pointer;
    }

    table {
        padding: 0;
        margin: 0;
    }

    .img-result {
        object-fit: cover;
        width: 200px;
        height: 150px;
        border-radius: 3px;
        border-width: 2px;
        border-color: white;
        padding-top: 0;
        margin: 15px 0;
        overflow: hidden;
    }

    .col {
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
    }

    .btn-container {
        display: flex;
        margin: 30px;
    }

    .btn-back {
        color: white;
        font-size: 18px;
        font-weight: 700;
        font-family: 'Avenir', sans-serif;
        width: 85px;
        height: 45px;
        border-radius: 5px;
        border-width: 3px;
        padding: 0;
        text-align: center;
    }

    .outline {
        padding: 10px;
        border-radius: 3px;
        border: 1px solid #cdcdcd;
        /*background-color: var(--grey-bg);*/
    }

    .inner {
        padding: 10px 20px;
        border-radius: 3px;
        /*background-color: rgba(140, 144, 182, 0.2);*/
    }

    .inner:hover {
        background-color: rgba(153, 158, 200, 0.30);
    }

    .price {
        font-size: 25px;
    }

    .rows {
        padding: 0 50px 0 50px;
    }

    .results {
        margin: 0;
        padding: 0;
    }

    .img-container {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
    }

    .img-main {
        margin: auto;
        max-width: 100%;
        max-height: 100%;
        border: 2px solid var(--dark-grey);
        border-radius: 3px;
    }

    .thumb {
        margin: 5px;
        object-fit: cover;
        width: 50px;
        height: 50px;
        border: 1px solid var(--dark-grey);
        border-radius: 3px;
    }

    .thumb:hover {
        cursor: pointer;
        filter: brightness(115%);
        border-color: var(--green-acnt);
    }
</style>
