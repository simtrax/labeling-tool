<style>
    #map {
        position: absolute;
        width: 100%;
        height: 100vh;
        right: 0;
        z-index: 1;
    }
</style>

<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

    data() {
        return {
            drawnItems: null,
            drawnPoints: null,
            drawnAnnotations: null,
        }
    },

    mounted() {
        this.initiateMap()
        this.addControls()

        this.drawGeometries()
        this.drawAnnotations()
    },

    computed: {

        ...mapGetters({
            geometries:      'geometries/geometries',
            points:          'points/points',
            annotations:     'annotations/annotations',
            annotationType:  'annotations/type',
        }),

    },

    watch: {
        points() {
            this.drawPoints()
        },
        annotations() {
            this.drawAnnotations()
        },
    },

    methods: {

        /**
         * Initiate the map and set a correct view
         */
        initiateMap() {
            this.map = L.map('map').setView([-0.00083, 0.00165], 19)

            L.tileLayer('TILE_PROVIDER_HERE', {
                attribution: '',
                maxZoom: 23,
                minZoom: 17,
            }).addTo(this.map)

            this.map.zoomControl.setPosition('topright')
        },

        /**
         * Add the controls that will enable drawing
         */
        addControls() {
            this.drawnItems = new L.FeatureGroup()
            this.drawnPoints = new L.FeatureGroup()
            this.drawnAnnotations = new L.FeatureGroup()

            this.map.addLayer(this.drawnItems)

            let drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polyline: false,
                    marker: false,
                    circle: false,
                    rectangle: true,
                    circlemarker: false,
                },
                edit: {
                    featureGroup: this.drawnItems,
                    edit: false,
                    remove: false,
                }
            })

            this.map.addControl(drawControl)

            this.map.on('draw:created', this.layerDrawn)
            this.map.on('draw:deleted', this.layerDeleted)
        },

        /**
         * Add the geometries to the map
         * For simplicity the drawnItems layer is cleared
         * A bit easier than figuring out what layer to add or not to add from the store
         */
        drawGeometries() {
            this.drawnItems.clearLayers()

            L.geoJson(this.geometries, {
                onEachFeature: (feature, layer) => {

                    layer.setStyle(this.getStyle(layer.feature.properties.selected))
                    layer.bindContextMenu(this.geometryContextMenu(layer))

                    this.drawnItems.addLayer(layer)

                    layer.on("click", event => this.layerClicked(event.latlng, layer.feature.properties.id))
                }
            })
        },

        /**
         * Add the annotations to the map
         */
        drawAnnotations() {
            this.drawnAnnotations.removeFrom(this.map)

            this.drawnAnnotations = L.geoJson(this.annotations, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 4.5,
                        fillColor: feature.properties.color,
                        color: feature.properties.color,
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1
                   })
                },
                onEachFeature: (feature, layer) => {
                    layer.on("click", event => {
                        layer.removeFrom(this.drawnAnnotations)

                        this.$store.commit('annotations/deleteAnnotation', layer.feature.properties.id)
                    })
                }
            }).addTo(this.map)
        },

        /**
         * Add the counted plants to the map
         */
        drawPoints() {
            this.drawnPoints.removeFrom(this.map)

            this.drawnPoints = L.geoJson( this.points, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 2,
                        fillColor: 'blue',
                        color: 'blue',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1
                   })
                }
            }).addTo(this.map)
        },

        /**
         * A layer has been drawn on the map
         */
        layerDrawn(e) {
            let layer = e.layer

            this.$store.commit('geometries/addGeometry', layer.toGeoJSON())

            this.drawGeometries()
        },

        /**
         * A layer has been removed from the map
         */
        deleteLayer(e) {
            let layer = e.relatedTarget
            layer.removeFrom(this.drawnItems)

            this.$store.commit('geometries/deleteGeometry', layer.feature.properties.id)
            this.$store.commit('annotations/deleteRelatedAnnotations', layer.feature.properties.id)
        },

        layerClicked(coords, geometry_id) {
            this.$store.commit('annotations/addAnnotation', {coords, geometry_id})
        },

        toggleSelectionOfGeometry(e) {
            let properties = e.relatedTarget.feature.properties

            this.$store.commit('geometries/toggleSelected', {id: properties.id, currState: properties.selected})

            this.drawGeometries()
        },

        /**
        *   Returns the correct styling based on selection
        */
        getStyle(selected) {
            if(selected) {
                return {
                    color: "blue",
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0,
                    fillColor: "blue"
                }
            }

            return {
                color: "white",
                weight: 3,
                opacity: 1,
                fillOpacity: 0,
                fillColor: "white"
            }
        },

        /**
         * Contextmenu for geometries that enables deleting them
         */
        geometryContextMenu(layer) {
            let items = []

            if(layer.feature.properties.selected) {
                items.push({
                    text: 'Deselect',
                    callback: this.toggleSelectionOfGeometry
                })
            } else {
                items.push({
                    text: 'Select',
                    callback: this.toggleSelectionOfGeometry
                })
            }

            return {
                contextmenu: true,
                contextmenuItems: 
                    items.concat([
                    {
                        separator: true,
                    },
                    {
                        text: 'Remove geometry',
                        callback: this.deleteLayer
                    },
                    {
                        separator: true,
                    },
                    {
                        text: 'Cancel',
                    }
                ])
            }
        }

    }
}
</script>
