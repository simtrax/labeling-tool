<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Count plants</h5>

                <h6 class="card-subtitle mb-2 text-muted">Please select a model to be used when counting plants.</h6>

                <select class="form-control" v-model="model_id">
                    <option v-for="model in models" :value="model.id" :key="model.id" v-text="model.title"></option>
                </select>

                <hr>
                <!-- Some quick validation, don't want to waste time on that in this stage -->
                <h6 class="card-subtitle mb-2 text-muted" v-if="!model_id">A model must be selected.</h6>
                <h6 class="card-subtitle mb-2 text-muted" v-if="selectedGeometries.length == 0">One or more geometries has to be created to proceed.</h6>

                <button class="btn btn-default" @click="clearPlants()" :disabled="points.length == 0">Clear</button>
                <button class="btn btn-primary float-right" @click="countPlants()" :disabled="!model_id || selectedGeometries.length == 0">Process</button>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

    data() {
        return {
            model_id: '',
        }
    },

    computed: {

        ...mapGetters({
            selectedGeometries:     'geometries/selectedGeometries',
            models:                 'models/models',
            points:                 'points/points',
        }),

    },

    methods: {

        countPlants() {
            this.$store.dispatch('points/DETECT_PLANTS', {geometries: this.selectedGeometries, model_id: this.model_id})
        },

        clearPlants() {
            this.$store.commit('points/removePoints')
        }

    }

}
</script>