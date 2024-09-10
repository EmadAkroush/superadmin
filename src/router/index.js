import { createRouter, createWebHashHistory } from 'vue-router';
import App from '../App.vue';
import authRoutes from './routes/auth'
import ticketRoutes from './routes/ticket'
import organizationRoutes from './routes/organization'
import templateRoutes from './routes/template'
import musicRoutes from './routes/music'
import giftcardRoutes from './routes/giftcard'
import transactionRoutes from './routes/transaction'


const routes = [
{
    path: '/',
    name: 'app',
    component: App,
    children: [
 
    
    ...ticketRoutes ,
    ...organizationRoutes,
    ...templateRoutes,
    ...musicRoutes,
    ...giftcardRoutes,
    ...transactionRoutes

    ]

},
{
    path: '/error-404',
    name: 'error-404',
    component: () => import('../pages/Error/Error404.vue'),
   
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: 'error-404',
  },
  
...authRoutes


];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;