export default [
    {
        path: '/organization-profile',
        name: 'organization-profile',
        component: () =>
            import('../../pages/ProfilePages/organization.vue')
    },
    {
        path: '/show-organization-profile/:ticket_id',
        name: 'show-organization-profile',
        component: () =>
            import('../../pages/ProfilePages/showOrganization.vue')
    }
]