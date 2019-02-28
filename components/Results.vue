<template>
    <div v-cloak class="results">
        <h2>Some Results.</h2><br>
        <ul v-for="ad in toDisplay" :key="ad.id">
            <table class="inside">
                <tr>
                    <th><img :src="ad['image']" alt="Image" width="100px"></th>
                    <th><button v-on:click="displayAd(ad)">show</button></th>
                </tr>
                <tr>

                </tr>
            </table>
        </ul>
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
        methods: {
            displayAd: function(ad) {
                ad['display'] = !ad['display'];
            }
        }
    }
</script>

<style scoped>
    h2 {
        margin: 0px;
        font-size: 35px;
        font-weight: 800;
        color: white;
        font-family: 'Avenir', sans-serif;
    }

    p,a  {
        color: white;
        font-size: 18px;
        font-weight: 700;
        text-decoration: none;
    }

    a:hover {
        font-weight: 900;
        text-decoration-line: underline;
    }

    ul {
        /** margin-right: 20%;
        margin-left: 20%; **/
        margin: 2%;
        display: inline-grid;
        width: 200px;
        min-height: 300px;
        border-radius: 5px;
        padding: 18px;
        color: white;
        background-color: #5c7387;
        font-size: 18px;
        font-weight: 500;
        text-align: left;
    }

    button {
        background-color: #C7DCEA;
        color: #28343D;
        font-size: 15px;
        font-weight: 700;
        font-family: 'Avenir', sans-serif;
        width: 50px;
        height: 30px;
        border-radius: 5px;
        border-width: 3px;
        border-color: #C7DCEA;
        margin: 0;
        padding: 0;
        text-align: center;
    }


    img {
        margin: 0;
        padding: 0;
    }

    .inside {

        display: table;
        text-align: left;
        margin: 0;
        padding: 0;
    }

    .results {
        background-color: var(--background);
    }
</style>
