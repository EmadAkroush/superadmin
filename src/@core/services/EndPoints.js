export default {
    Template: {
        List : '/admin/Template',
        changeActiveStatus: '/admin/Template/ChangeActiveStatus'
    },
    Music: {
        List : '/admin/sound',
        changeActiveStatus: '/admin/sound/ChangeActiveStatus'
    },

    File: {
        create: '/file/create',
        update: '/file/update',
        delete: '/file/delete',
      },
    TemplateCategory: {
        List : '/admin/category',
        ChangeActiveStatus : '/admin/category/ChangeActiveStatus'

    },
    Transaction: {
        List : '/admin/transaction'
    },
    GiftCardList: {
        List : '/admin/giftcard'
    },
    OrganizationProfile: {
        List : '/admin/organizationProfile/authenticationRequest',
        history: '/history',
        accept: '/accept',
        reject: '/reject',
    },
    Ticket: {
        List : '/admin/ticket',
        response: '/response'
    }
    

   
   
}