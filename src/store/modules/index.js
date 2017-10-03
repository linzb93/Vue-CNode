export default {
    namespace: true,
    state: {
        tabId: 'all',
        page: 1
    },
    mutations: {
        tabSwitch(state, id) {
            state.tabId = id;
        },
        changePage(state, page) {
            state.page = page;
        }
    },
}