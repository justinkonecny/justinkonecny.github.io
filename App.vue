<template>
    <body>
    <div id="app">
        <ModelSelector v-if="this.$parent.pageState === 0"/>
        <LoadScreen v-if="this.$parent.pageState === 1"/>
        <Results v-if="this.$parent.pageState === 2" adList="adList"/>
    </div>
    </body>
</template>

<script>
    import ModelSelector from './components/ModelSelector.vue'
    import Results from './components/Results.vue'
    import LoadScreen from './components/LoadScreen.vue'

    export default {
        name: 'app',
        data: function() {
            return {
                adList: this.$parent.advertisementList
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
