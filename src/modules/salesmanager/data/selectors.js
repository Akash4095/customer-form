import { createSelector } from 'reselect'
import { startsWith, cloneDeep } from 'lodash'
import { salesmanager } from './model'

export const getIsFetchingSalesmanager = (state, props) => state.salesmanager.params.isFetching
export const getIsSalesmanagerFetched = (state, props) => state.salesmanager.params.salesmanagerFetched
export const getSalesmanagerList = (state, props) => state.salesmanager.byId

export const getNotification = (state, id) => state.salesmanager.notifications[id]

export const getSalesmanager = (state, props) => {
    if (props.match.path === '/salesmanager/create') {
        return salesmanager()
    }
    if (props.match.path === '/salesmanager/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.salesmanager.byId[_id]);
        return obj
    }
}

export const getSalesmanagerParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/salesmanager/create')) {
        params.title = state.salesmanager.params.createTitle
        params.submitButtonText = state.salesmanager.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/salesmanager/edit')) {
        params.title = state.salesmanager.params.editTitle
        params.submitButtonText = state.salesmanager.params.editSubmitButtonText
    };

    return params
}



export const selectSalesManager = createSelector(
    getSalesmanagerList,
    salesmanager => {
        const keys = Object.keys(salesmanager)
        const obj = keys.map((key) => {
            return { key: key, value: key, text: (salesmanager[key].smType === 'Sales Manager') ? salesmanager[key].emp_name.concat(salesmanager[key].emp_code ? ` [ ${salesmanager[key].emp_code} ]` : "") : "", code: salesmanager[key].emp_code }

        }).filter((item) => {
            return item.text !== ''
        })
        return obj
    }
)