export default [
    {
        path: '/login',
        name: 'login',
        component: () =>
            import('../../pages/Authentication/login/index.vue')
    },
    {
        path: '/forget-password',
        name: 'forget-password',
        component: () =>
            import('../../pages/Authentication/forget-password/index.vue')
    },
]