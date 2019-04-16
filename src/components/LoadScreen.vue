<template>
    <div>
        <div>
            <h1>LOADING: {{ imageCount }}</h1>
        </div>
        <div>
            <b-progress class="bar" variant="info" :value="imageCount" :max="max"/>
        </div>
        <div v-if="imageCount === 15"></div>
        <!--<img src="../assets/image.jpeg" width="50%"> -->
    </div>
</template>

<script>
    export default {
        props: {
            imageCount: Number
        },
        name: "LoadScreen",
        data() {
            return {
                max: 15
            }
        },
        watch: {
            imageCount: function(countNew) {
                if (countNew === 15) {
                    this.$emit('loadDone');
                }
            }
        }
    }
</script>

<style scoped>

    h1 {
        color: var(--text-dark);
        margin: 20px;
    }

    .bar {
        margin: auto;
        alignment: center;
        height: 30px;
        width: 50%;
        background-color: white;
        color: var(--button);
    }
</style>
