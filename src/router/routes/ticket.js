export default [
    {
        path: '/ticket',
        name: 'ticket',
        component: () =>
            import('../../pages/TickedPages/List.vue')
    },
    {
        path: '/answer-ticket/:ticket_id',
        name: 'AnswerTicket',
        component: () =>
            import('../../pages/TickedPages/Answer.vue')
    },
]