<template>
    <body>
    <div id="app">
        <ModelSelector v-bind:searchModels="searchModels"/>
        <!--<img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    </div>
    </body>
</template>

<script>
    import ModelSelector from './components/ModelSelector.vue'

    export default {
        name: 'app',
        components: {
            ModelSelector
        },
        data: function() {
            return {
                searchModels: ['bmw', 'infiniti', 'jeep', 'lexus', 'mercedes']
            }
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
        color: #2c3e50;
        /*margin-top: 60px; */
        background-color: white;
    }
</style>
