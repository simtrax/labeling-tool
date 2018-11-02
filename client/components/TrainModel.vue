<template>
    <div>
        <div class="card" style="margin-top:1em;">
            <div class="card-body">
                <h5 class="card-title">Train model</h5>

                <h6 class="card-subtitle mb-2 text-muted">Select annotation type</h6>

                <div class="form-group">
                    <select class="form-control" v-model="type">
                        <option v-for="type in annotationTypes" :value="type.id" :key="type.id" v-text="type.title"></option>
                    </select>
                </div>


                <div v-if="geometries.length == 0">
                    <h6 class="card-subtitle mb-2 text-muted">Draw geometries to continue.</h6>
                </div>
                <div v-else>
                    <h6 class="card-subtitle mb-2 text-muted" v-if="selectedGeometries.length == 0">Right click on geometries and select them to proceed.</h6>

                    <h6 class="card-subtitle mb-2 text-muted" v-if="annotations.length == 0">Select annotation type and click inside geometries to add annotations.</h6>
                    
                </div>
                <div v-if="annotations.length > 0">
                    <h6 class="card-subtitle mb-2 text-muted">Left click on annotations to delete them.</h6>
                </div>

                <hr>
                <h6 class="card-subtitle mb-2 text-muted" v-if="selectedGeometries.length > 0" v-text="selectedGeometries.length + ' geometries selected for training.'"></h6>

                <button class="btn btn-primary float-right" @click="train()" :disabled="!type || selectedGeometries.length == 0">Train</button>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

    data() {
        return {
            type: 'good',
        }
    },

    computed: {

        ...mapGetters({
            geometries:         'geometries/geometries',
            selectedGeometries: 'geometries/selectedGeometries',
            annotationTypes:    'annotations/types',
            annotations:        'annotations/annotations',
        }),

    },

    watch: {
        /**
         * When the annotation type is changed we need to reflect that in the store
         */
        type() {
            this.$store.commit('annotations/setCurrentType', this.type)
        }
    },

    methods: {

        train() {
            this.$store.dispatch('models/TRAIN_MODEL', {geometries: this.selectedGeometries, annotations: this.annotations})
            this.$notify({
                type: 'success',
                title: 'Model trained',
                text: 'The new model was added to the list of models!'
            })
        }

    }

}
</script>