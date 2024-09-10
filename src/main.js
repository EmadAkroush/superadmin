import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/@core/assets/styles/layout.scss';

import { createApp, reactive } from 'vue';
import router from './router';
import { store } from './store.js'
import AppWrapper from './@core/components/AppWrapper.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import auth from './@core/plugin/auth/index'

import BlockViewer from './@core/components/BlockViewer';
import axios from "./@core/plugin/axios";
import VueAxios from 'vue-axios';
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Tooltip from 'primevue/tooltip';
import primevueConfig from '../src/@core/config/PrimeVue'





require('./@core/plugin/auth/check-route');

// router.beforeEach(function(to, from, next) {
//     window.scrollTo(0, 0);
//     next();
// });

const app = createApp(AppWrapper);
app.use(VueAxios, axios);
app.use(auth, {
    endPoints: {
        login: 'Auth/Login',
        user: 'Auth/GetUserInfo',
        refresh: 'Auth/RefreshToken',
    },
    redirects: {
        login: '/',
        logout: '/login',
    }
})

app.config.globalProperties.$appState = reactive({ theme: 'lara-light-indigo', darkTheme: false });

app.use(PrimeVue, primevueConfig);

app.use(ConfirmationService);
app.use(ToastService);
app.use(router);

app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);



app.use(Vue3PersianDatetimePicker, {
    name: 'CustomDatePicker',
    props: {
      format: 'YYYY-MM-DD',
      displayFormat: 'jYYYY-jMM-jDD',
      editable: false,
      inputClass: 'p-calendar p-component p-inputwrapper',
      iconClass: 'p-button p-component p-button-icon-only p-datepicker-trigger',
      altFormat: 'YYYY-MM-DD',
      color: '#00acc1',
      autoSubmit: false,
    }
  })





app.component('BlockViewer', BlockViewer);
app.use(store)
app.mount('#app');