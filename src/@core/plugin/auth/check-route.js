import router from '../../../router';
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token') || null;

        if(!token){
            if(to.name !== 'login'){
                next({ name: 'login' })
            }else{
                window.scrollTo(0, 0);
                next();
            }
        }else{
            if(to.name === 'login'){
                next({ name: 'dashboard' })
            }else{
                window.scrollTo(0, 0);
                next();
            }

        }
    
})