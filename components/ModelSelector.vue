<template>
    <div class="model-selector">
        <div class="title" align="left">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 -10 224 224"
                 style="padding-right: 15px; float: left; fill:#000000;">
                <g fill="#ffffff">
                    <g id="surface1">
                        <path d="M125.72,47.46c-1.54,0.21 -2.87,1.2075 -3.5,2.6425c-0.63,1.4175 -0.4725,3.08 0.42,4.3575l21.14,30.66h-46.62l-6.58,-16.24c-1.4875,-3.71 -5.0925,-6.16 -9.1,-6.16c-5.3725,0 -9.8,4.4275 -9.8,9.8v12.6h-18.34l-0.42,0.14l-34.58,6.16c-10.6225,1.925 -18.34,11.3225 -18.34,22.12v25.34c0,7.3675 6.0725,13.44 13.44,13.44h4.9c2.135,12.705 13.1775,22.4 26.46,22.4c13.2825,0 24.325,-9.695 26.46,-22.4h81.48c2.135,12.705 13.1775,22.4 26.46,22.4c13.2825,0 24.325,-9.695 26.46,-22.4h4.9c7.3675,0 13.44,-6.0725 13.44,-13.44v-24.64c0,-11.2 -8.365,-20.7725 -19.46,-22.26l-49.7,-6.58l-24.78,-35.98c-0.945,-1.435 -2.6425,-2.1875 -4.34,-1.96zM81.48,71.68c0.3675,0 0.7,0.21 0.84,0.56l5.18,12.88h-6.86v-12.6c0,-0.525 0.315,-0.84 0.84,-0.84zM53.76,94.08h98.56l51.1,6.86c6.7025,0.8925 11.62,6.5275 11.62,13.3v24.64c0,2.5375 -1.9425,4.48 -4.48,4.48h-4.9c-2.135,-12.705 -13.1775,-22.4 -26.46,-22.4c-13.2825,0 -24.325,9.695 -26.46,22.4h-81.48c-2.135,-12.705 -13.1775,-22.4 -26.46,-22.4c-13.2825,0 -24.325,9.695 -26.46,22.4h-4.9c-2.5375,0 -4.48,-1.9425 -4.48,-4.48v-25.34c0,-6.5275 4.6375,-12.1275 11.06,-13.3zM44.8,129.92c9.9575,0 17.92,7.9625 17.92,17.92c0,9.9575 -7.9625,17.92 -17.92,17.92c-9.9575,0 -17.92,-7.9625 -17.92,-17.92c0,-9.9575 7.9625,-17.92 17.92,-17.92zM179.2,129.92c9.9575,0 17.92,7.9625 17.92,17.92c-0.0175,0.1925 -0.0175,0.3675 0,0.56c-0.2975,9.6775 -8.155,17.36 -17.92,17.36c-9.9575,0 -17.92,-7.9625 -17.92,-17.92c0,-9.9575 7.9625,-17.92 17.92,-17.92z"></path>
                    </g>
                </g>
            </svg>
            <h1>Liberty Cars</h1>
        </div>
        <div class="pad"></div>
        <div class="selection">
            <div class="instructions">
                <p>Enter search parameters below.</p>
            </div>
            <br>
            <div>
                <table class="parameters">
                    <tr>
                        <th colspan="0"><p>model:</p></th>
                        <th colspan="3"><input v-model="model"></th>
                    </tr>
                    <tr>
                        <th><p>min year:</p></th>
                        <th><input class="arg" v-model="minYear"></th>
                        <th><p>max year:</p></th>
                        <th><input class="arg" v-model="maxYear"></th>
                    </tr>
                    <tr>
                        <th><p>min price:</p></th>
                        <th><input class="arg" v-model="minPrice"></th>
                        <th><p>max price:</p></th>
                        <th><input class="arg" v-model="maxPrice"></th>
                    </tr>
                    <tr>
                        <th><p>min miles:</p></th>
                        <th><input class="arg" v-model="minMiles"></th>
                        <th><p>max miles:</p></th>
                        <th><input class="arg" v-model="maxMiles"></th>
                    </tr>
                    <tr>
                        <th colspan="4"><button v-on:click="updateParameters()">search</button></th>
                    </tr>
                </table>
            </div>

        </div>
    </div>
</template>

<script>
    import {executeSearch} from '../main.js'

    /* eslint-disable no-console */

    export default {
        name: 'ModelSelector',
        data: function() {
            return {
                parameters: Array,
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
            updateParameters: function() {
                this.parameters = {
                    model: this.model,
                    minYear: this.minYear,
                    maxYear: this.maxYear,
                    minPrice: this.minPrice,
                    maxPrice: this.maxPrice,
                    minMiles: this.minMiles,
                    maxMiles: this.maxMiles
                };
                this.$emit('loadStart');
                executeSearch(this.parameters);
            }
        }
    }
</script>

<style scoped>
    h3, h1 {
        margin: 0;
        font-size: 40px;
        font-weight: 900;
        color: white;
        font-family: 'Avenir', sans-serif;
        padding-right: 15px;
        padding-left: 15px;
    }

    input {
        background-color: white;
        color: #28343D;
        font-size: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
        font-weight: 700;
        font-family: 'Avenir', sans-serif;
        width: 350px;
        border-radius: 5px;
        border-width: 3px;
        border-color: #C7DCEA;
    }

    button {
        background-color: #C7DCEA;
        color: #28343D;
        font-size: 20px;
        padding: 10px;
        font-weight: 700;
        font-family: 'Avenir', sans-serif;
        width: 358px;
        border-radius: 5px;
        border-width: 3px;
        border-color: #C7DCEA;
        margin-top: 40px;
    }

    ul {
        padding: 0px;
    }

    p {
        color: white;
        font-size: 18px;
        padding-left: 30px;
    }

    th {
        text-align: right;
        padding-bottom: 10px;
    }

    .title {
        alignment: left;
        padding-top: 15px;
        padding-left: 15px;
        background: #7296B0;
    }

    .instructions {
        color: white;
        margin-bottom: 40px;
    }

    .pad {
        padding: 2px;
        background-color: white;
    }

    .model-selector {
        background-color: var(--background);
        min-width: 500px;
    }

    .arg {
        margin-right: 0px;
        display: inline;
        width: 100px;
    }

    .parameters {
        margin-left: calc(50% - 290px);
    }

    .selection {
        margin-top: 150px;
    }
</style>
