<template>
    <div class="model-selector">
        <div class="selection">
            <div class="instructions">
                <p class="text-header">Looking for a new car?</p>
                <p class="text-center">Fill out the search options below</p>
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
</template>

<script>
    import { executeSearch } from '../main.js'

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
            title: function(str) {
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
