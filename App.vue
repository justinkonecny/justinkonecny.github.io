<template>
    <body>
    <div id="app">
        <ModelSelector v-if="showSelector"/>
        <Results v-else adList="adList"/>
    </div>
    </body>
</template>

<script>
    import ModelSelector from './components/ModelSelector.vue'
    import Results from './components/Results.vue'

    export default {
        name: 'app',
        data: function() {
            return {
                adList: this.$parent.advertisementList,
                showSelector: true
            }
        },
        components: {
            ModelSelector,
            Results
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
