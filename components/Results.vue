<template>
    <div v-cloak class="results">
        <div v-if="showAll">
            <h2>Check out the results below!</h2><br>
            <div class="rows">
                <ul v-for="ad in toDisplay" :key="ad.id" v-on:click="displayAd(ad)">
                    <b-container>
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
                </ul>
            </div>
        </div>
        <div v-else>
            <div class="header">
                <button v-on:click="displayAd(currentAd)">back</button>
            </div>
            <div align="left">
                <b-container>
                    <b-row>
                        <b-col>
                            <img class="single" :src="currentAd['image']" alt="Image" border="2">
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
                            <p v-if="currentAd['body'] !== false">{{ currentAd['body'] }}</p>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */
    export default {
        name: 'Results',
        props: {
            toDisplay: Array,
            pageStatus: Number
        },
        data: function() {
            return {
                showAll: true,
                currentAd: Array
            }
        },
        filters: {
            date: function(arr) {
                return arr[1] + '/' + arr[2] + '/' + arr[0];
            },
            lowerCase: function(str) {
                return str.toLowerCase();
            },
            titleLower: function(str) {
                if (str.length > 21) {
                    return str.substring(0, 22).toLowerCase() + "...";
                } else {
                    return str.toLowerCase();
                }
            },
            title: function(str) {
                if (str.length > 21) {
                    return str.substring(0, 22) + "...";
                } else {
                    return str;
                }
            },
            splitLocation: function(str) {
                if (str === 'newjersey') {
                    return "New Jersey";
                } else {
                    return str;
                }
            }
        },
        methods: {
            displayAd: function(ad) {
                if (ad['display']) {
                    ad['display'] = false;
                    this.showAll = true;
                } else {
                    ad['display'] = true;
                    this.currentAd = ad;
                    this.showAll = false;
                }
            }
        }
    }
</script>

<style scoped>
    h2 {
        padding: 50px 0 0 0;
        margin: 0;
        font-size: 35px;
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
        width: 240px;
        min-height: 250px;
        border-radius: 5px;
        padding: 5px 5px 15px 5px;
        color: black;
        background-color: rgba(92, 107, 192, 0.2);
        border: 1px solid #c0c0c0;
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

    button {
        color: #28343D;
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
</style>
