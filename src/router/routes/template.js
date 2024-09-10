export default [
    
    {
        path: '/templateadd',
        name: 'templateadd',
        component: () =>
            import('../../pages/TemplatePages/Add.vue')
    },
    {
        path: '/templatelist',
        name: 'templatelist',
        component: () =>
            import('../../pages/TemplatePages/List.vue')
    },
    {
        path: '/templatecategory',
        name: 'templatecategory',
        component: () =>
            import('../../pages/TemplatePages/Category.vue')
    },
    {
        path: '/templatecategoryadd',
        name: 'templatecategoryadd',
        component: () =>
            import('../../pages/TemplatePages/CategoryAdd.vue')
    },
    {
        path: '/templatecategoryadd',
        name: 'templatecategoryadd',
        component: () =>
            import('../../pages/TemplatePages/CategoryAdd.vue')
    },
   
    {
        path: '/templateedit/:template_id',
        name: 'TemplateListEdit',
        component: () =>
            import('../../pages/TemplatePages/Edit.vue')
    }
        ,
    {
        path: '/categoryedit/:category_id',
        name: 'TemplateCategoryEdit',
        component: () =>
            import('../../pages/TemplatePages/CategoryEdit.vue')
    },
]