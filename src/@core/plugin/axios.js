import axios from 'axios';

import {Auth} from './auth/index';

// import store from '../store/index'

const LOGIN_API_ROUTE = 'Auth/Login';
const BASE_URL = `${process.env.VUE_APP_BASE_URL}`;

axios.defaults.baseURL = BASE_URL 
const auth = new Auth( { endPoints: {
    login: LOGIN_API_ROUTE,
    user: 'Auth/GetUserInfo',
    refresh: 'Auth/RefreshToken',
  },
  redirects:{
    login:'/',
    logout:'/login',
}});

//*************** Run on request sended to server ********************/
axios.interceptors.request.use(
    async config => {
        if (config.url !== LOGIN_API_ROUTE) {
            config.headers.common['Authorization'] = JSON.parse(localStorage.getItem('token')) || '';
        }
        // if(auth.checkExpiration('token'))
        return config;
    },
    err => {
        return err.response
    }
)
//*************** Run on response get from server ********************/
axios.interceptors.response.use(
    async res => {
        // if(res.config.method == 'get'){
        //     errorHandler.methods.showToast(res.status);
        // }
        return res;
    },
    async err => {
        const { config,response  } = err;
        if (response.status !== 401) {
            // errorHandler.methods.showToast(response.status);
            return response;
        }
        //TODO: Complete commit state when refresh get 500 error
        if(response.status === 401){
            const {status , token} = await auth.refreshToken()
                if(status == 200){
                    config.headers['Authorization'] = token
                    const res = await axios(config)
                    return res;
                }
                if(status == 500){
                    // store.commit('setRelogin' , true)
                    auth.logout()
                }
            // config.retry -= 1;
            // const delayRetryRequest = new Promise((resolve) => {
            //     setTimeout(() => {
            //         console.log("retry the request", config.url);
            //         debugger;
            //         resolve();
            //       }, config.retryDelay || 1000);
            // });
            // delayRetryRequest.then(() => axios(config));
        }
})

export default axios;