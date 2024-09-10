const Config = {
    services: {
        Template: {
         endpointName: 'Template',
         version: 1,
         base: 'giftcard/api/',
        },
        Music: {
            endpointName: 'Music',
            version: 1,
            base: 'giftcard/api/',
           },
        File: {
        endpointName: 'File',
        version: 1,
        base: 'file/api/',
        },
        TemplateCategory: {
        endpointName: 'TemplateCategory',
        version: 1,
        base: 'giftcard/api/',
       },
       MusicCategory: {
        endpointName: 'TemplateCategory',
        version: 1,
        base: 'giftcard/api/',
       },
       Transaction: {
        endpointName: 'Transaction',
        version: 1,
        base: 'payment/api/',
       },
       GiftCardList: {
        endpointName: 'GiftCardList',
        version: 1,
        base: 'giftcard/api/',
       },
       OrganizationProfile: {
        endpointName: 'OrganizationProfile',
        version: 1,
        base: 'api/identityprovider/',
       },
       Ticket: {
        endpointName: 'Ticket',
        version: 1,
        base: '/api/ticket/',
       },
       
    }
}

export default Config