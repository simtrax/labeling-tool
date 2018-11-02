<style>
    .toolbox {     
        position: absolute; 
        margin-left: 0px; 
        left: 20px; 
        top: 20px; 
        z-index: 500;
        width: 315px;
    }
</style>

<template>
    <div>

        <Map></Map>
        <Toolbox class="toolbox"></Toolbox>
        <notifications/>

    </div>
</template>

<script>

import Map from '../components/Map.vue'
import Toolbox from '../components/Toolbox.vue'

export default {

    components: {
        Map, Toolbox
    },

    created() {
        this.$store.dispatch('geometries/LOAD_GEOMETRIES')
        this.$store.dispatch('annotations/LOAD_ANNOTATIONS')
        this.$store.dispatch('models/LOAD_MODELS')
    }

}
</script>
