export default [
    {
        path: '/musiclist',
        name: 'MusicList',
        component: () =>
            import('../../pages/MusicPages/List.vue')
    },
    {
        path: '/musicadd',
        name: 'MusicAdd',
        component: () =>
            import('../../pages/MusicPages/Add.vue')
    },
  
    {
        path: '/music-edit/:Music_id',
        name: 'MusicEdit',
        component: () =>
            import('../../pages/MusicPages/Edit.vue')
    },
    {
        path: '/musiccategory',
        name: 'MusicCategory',
        component: () =>
            import('../../pages/MusicPages/Category.vue')
    },
    {
        path: '/musiccategoryadd',
        name: 'MusicCategoryAdd',
        component: () =>
            import('../../pages/MusicPages/CategoryAdd.vue')
    },
    {
        path: '/musiccategoryedit/:musiccategory_id',
        name: 'MusicCategoryEdit',
        component: () =>
            import('../../pages/MusicPages/CategoryEdit.vue')
    },
]