/*
 * @Autor: Foley Fan
 * @Date: 2021-05-14 18:31:53
 * @LastEditTime: 2021-05-18 11:03:51
 * @Description: 
 */
import PageTable from './PageTable.vue'

const install = (Vue) => {
    Vue.component(PageTable.name, PageTable)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    PageTable
}