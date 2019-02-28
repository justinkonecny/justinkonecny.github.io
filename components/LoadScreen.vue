<template>
    <div>
        <h1>LOADING: {{ imageCount }}</h1>
        <div v-if="imageCount === 10"></div>
        <!--<img src="../assets/image.jpeg" width="50%"> -->
    </div>
</template>

<script>
    export default {
        props: {
            imageCount: Number
        },
        name: "LoadScreen",
        watch: {
            imageCount: function(countNew) {
                if (countNew === 10) {
                    this.$emit('loadDone');
                }
            }
        }
    }
</script>

<style scoped>

</style>
