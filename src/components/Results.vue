<template>
    <div v-cloak class="results">
        <!--Displays all listings found-->
        <div v-if="showAllResults">
            <h2>Check out the results below!</h2><br>
            <div class="rows">
                <ul v-for="ad in toDisplay" :key="ad.id" v-on:click="displayAd(ad)">
                    <div class="outline">
                        <b-container class="inner">
                            <b-row>
                                <b-col>
                                    <img :src="ad['image']" alt="Image" border="2">
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <p class="price">{{ ad['price'] }}</p>
                                    <p>{{ ad['title'] | title }}</p>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                </ul>
            </div>
        </div>
        <!--Displays one selected listing in more detail-->
        <div v-else>
            <div class="header">
                <button class="btn-back" v-on:click="displayAd(currentAd)">back</button>
            </div>
            <div align="left">
                <b-container>
                    <b-row>
                        <b-col>
                            <img class="single" :src="currentAd['image']" alt="Image" border="2">
                            <img class="thumb" v-for="img in currentAd['imageList']" :key="img.id" v-on:click="showImage(img)" :src="img" alt="Image">
                        </b-col>
                        <b-col>
                            <h5>{{ currentAd['title'] }}</h5>
                            <h5>Location</h5>
                            <h6>{{ currentAd['location'] | splitLocation }}</h6>
                            <h5>Date Posted</h5>
                            <h6>{{ currentAd['date'] | date }}</h6>
                            <h5>Price</h5>
                            <h6>{{ currentAd['price'] | title }}</h6>
                            <br>
                            <p>Check it out <a :href="currentAd['link']" target="_blank" rel="noopener noreferrer">here</a>!</p>
                            <p v-if="currentAd['body'] !== false">{{ currentAd['body'] }}</p>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Results',
        props: {
            // List of maps, where each entry represents one advertisement listing
            toDisplay: Array,
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
                }
            },

            showImage(newSrc) {
                this.currentAd['image'] = newSrc;
            }
        }
    }
</script>

<style scoped>
    h2 {
        padding: 30px 0 0 0;
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        color: var(--text-dark);
    }

    h5 {
        font-weight: 700;
        color: var(--text-dark);
        margin: 15px 0 0 2px;
    }

    h6 {
        font-size: 15px;
        font-weight: 500;
        color: var(--text-dark);
        margin: 0;
    }

    p,a  {
        font-size: 14px;
        font-weight: 500;
        padding: 0;
        margin: 0;
        text-align: left;
        alignment: left;
    }

    a:hover {
        font-weight: 900;
        text-decoration-line: underline;
    }

    ul {
        margin: 2%;
        display: inline-grid;
        /*width: 240px;*/
        min-height: 250px;
        /*padding: 5px 5px 15px 5px;*/
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

    img {
        object-fit: cover;
        width: 200px;
        height: 150px;
        border-radius: 5px;
        border-width: 2px;
        border-color: white;
        margin-top: 15px;
        margin-bottom: 15px;
        padding-top: 0;
    }

    table {
        padding: 0;
        margin: 0;
    }

    .btn-back {
        color: white;
        font-size: 16px;
        font-weight: 700;
        font-family: 'Avenir', sans-serif;
        width: 75px;
        height: 40px;
        border-radius: 5px;
        border-width: 3px;
        margin: 50px 0 0 0;
        padding: 0;
        text-align: center;
    }

    .outline {
        padding: 10px;
        border-radius: 3px;
        border: 1px solid #cdcdcd;
        background-color: var(--background);
    }

    .inner {
        padding: 10px 20px;
        border-radius: 3px;
        background-color: rgba(140, 144, 182, 0.2);
    }

    .header {
        margin: 0;
        padding: 0;
        text-align: left;
    }

    .single {
        object-fit: cover;
        width: 100%;
        height: 400px;
    }

    .price {
        font-size: 25px;
    }

    .rows {
        padding: 0 50px 0 50px;
    }

    .results {
        background-color: var(--background);
    }

    .thumb {
        margin: 3px;
        object-fit: cover;
        width: 50px;
        height: 50px;
        border: 1px solid var(--banner);
    }

    .thumb:hover {
        cursor: pointer;
        filter: brightness(115%);
    }
</style>
