export default [
    {
        path: '/transaction',
        name: 'Transaction',
        component: () =>
            import('../../pages/TransactionPages/List.vue')
    },
]