import { startsWith, cloneDeep } from 'lodash'
import { leadsource } from './model'
import { createSelector } from 'reselect'

export const getIsFetchingLeadSource = (state, props) => state.leadsource.params.isFetching
export const getIsLeadSourceFetched = (state, props) => state.leadsource.params.leadSourceFetched
export const getLeadSourceList = (state, props) => state.leadsource.byId
export const getNotification = (state, id) => state.leadsource.notifications[id]

export const getLeadSource = (state, props) => {
    if (props.match.path === '/leadsource/create') {
        return leadsource()
    }
    if (props.match.path === '/leadsource/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.leadsource.byId[_id]);
        return obj
    }
}

export const getLeadSourceParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/leadsource/create')) {
        params.title = state.leadsource.params.createTitle
        params.submitButtonText = state.leadsource.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/leadsource/edit')) {
        params.title = state.leadsource.params.editTitle
        params.submitButtonText = state.leadsource.params.editSubmitButtonText
    };

    return params
}

export const selectLeadSource = createSelector(
    getLeadSourceList,
    leadsource => {
        const keys = Object.keys(leadsource)
        const obj = keys.map((key) => {
            return { key: key, value: key, text: (leadsource[key].smType === 'Lead Source') ? leadsource[key].emp_name.concat(leadsource[key].emp_code ? ` [ ${leadsource[key].emp_code} ]` : "") : "", code: leadsource[key].emp_code }

        }).filter((item) => {
            return item.text !== ''
        })
        return obj
    }
)