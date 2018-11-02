import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)
import Notifications from 'vue-notification'
Vue.use(Notifications)

import { sync } from 'vuex-router-sync'
import App from './views/App'
import router from './router'
import store from './store'

import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-contextmenu'
import uuid from 'uuid'

import axios from 'axios'
window.axios = axios
var MockAdapter = require('axios-mock-adapter');

/**
 * Mock all axios calls
 */
var mock = new MockAdapter(axios);

/**
 * Returns an array of previously created models
 * As a proof of concept
 */
mock.onGet('/api/model').reply(200, [
    {id: uuid.v4(), title: 'Model 1'},
    {id: uuid.v4(), title: 'Model 2'},
    {id: uuid.v4(), title: 'Model 3'},
]);

/**
 * Return points that represents detected plants
 * We fake some points that we know are in the specific image
 * They will always look the same since the function will be called once when the app starts
 * Works as a proof of concept
 */
mock.onPost('/api/detect_areas').reply(200, 
    Array.from(new Array(100), () => {
        let min = 0.00001
        let max = 0.00030

        return {
            "type": "Feature",
            "properties": {
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    0.00165 + (Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min)),
                    -0.00083 + (Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min))
                ]
            }
        }
    })
)

/**
 * This will fail the second time since uuid wont be updated.
 * But as a proof of concept it works
 */
mock.onPost('/api/train').reply(200, {
    id: uuid.v4(),
    title: 'New Model name'
})

import 'style/style.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

sync(store, router)

const app = new Vue({
    // localStorage: {
    //     geometries: ''
    // },
    router,
    store,
    ...App
})



export { app, router, store }
