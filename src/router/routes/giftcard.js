export default [
    {
        path: '/giftcard',
        name: 'giftcard',
        component: () =>
            import('../../pages/GiftcardPages/List.vue')
    },
    {
        path: '/giftcard/:details',
        name: 'giftcarddetails',
        component: () =>
            import('../../pages/GiftcardPages/Details.vue')
    },
]