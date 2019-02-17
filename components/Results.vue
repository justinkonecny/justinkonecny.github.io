<template>
    <div class="results">
        <h2>Some Results.</h2><br>
        <ul class="list" v-for="ad in adList" :key="ad.id">
            <button>show</button>
            {{ ad['title'].toLowerCase() }}
        </ul>
    </div>
</template>

<script>

    /* eslint-disable no-console */
    export default {
        name: 'Results',
        data: function() {
            return {
                adList: this.$parent.adList
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

    p {
        color: white;
        font-size: 18px;
        font-weight: 700;
    }

    ul {
        margin-left: 20%;
        margin-right: 20%;
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
        width: 70px;
        border-radius: 5px;
        border-width: 3px;
        border-color: #C7DCEA;
        margin-right: 10px;
    }

    .results {
        background-color: var(--background);
    }
</style>
