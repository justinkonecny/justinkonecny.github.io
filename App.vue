<template>
    <body>
    <div id="app">
        <ModelSelector v-on:loadStart="pageState = 2" v-if="pageState === 0"/>
        <Results v-else-if="pageState === 1" :toDisplay="adList.slice(0, 10)" />
        <LoadScreen v-on:loadDone="pageState = 1" v-else :imageCount="this.$parent.imageCount"/>
    </div>
    </body>
</template>

<script>
    import ModelSelector from './components/ModelSelector.vue'
    import LoadScreen from './components/LoadScreen.vue'
    import Results from './components/Results.vue'

    export default {
        name: 'app',
        data: function() {
            return {
                adList: this.$parent.advertisementList,
                pageState: 0
            }
        },
        components: {
            ModelSelector,
            Results,
            LoadScreen
        }
    }
</script>


<style>
    :root {
        --background: #2F3C47;
    }

    body {
        background-color: var(--background);
        margin: 0px;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        background-color: white;
        color: #2c3e50;
    }
</style>
