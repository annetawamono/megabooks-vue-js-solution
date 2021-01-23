import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#009688',
                secondary: '#03a9f4',
                accent: '#ff5722',
                error: '#f44336',
                warning: '#ffc107',
                info: '#2196f3',
                success: '#8bc34a'
            }
        }
    }
});
