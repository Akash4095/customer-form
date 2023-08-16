import { startsWith, cloneDeep } from 'lodash'
import { createSelector } from 'reselect'
import { financeConsultant } from './model'

export const getIsFetchingFinanceConsultant = (state, props) => state.financeConsultant.params.isFetching
export const getIsFinanceConsultantFetched = (state, props) => state.financeConsultant.params.financeConsultantFetched
export const getFinanceConsultantList = (state, props) => state.financeConsultant.byId
export const getNotification = (state, id) => state.financeConsultant.notifications[id]

export const getFinanceConsultant = (state, props) => {
    if (props.match.path === '/financeconsultant/create') {
        return financeConsultant()
    }
    if (props.match.path === '/financeconsultant/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.financeConsultant.byId[_id]);
        return obj
    }
}

export const getFinanceConsultantParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/financeconsultant/create')) {
        params.title = state.financeConsultant.params.createTitle
        params.submitButtonText = state.financeConsultant.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/financeconsultant/edit')) {
        params.title = state.financeConsultant.params.editTitle
        params.submitButtonText = state.financeConsultant.params.editSubmitButtonText
    };

    return params
}

export const selectFinanceConsultant = createSelector(
    getFinanceConsultantList,
    finconsultant => {
        const keys = Object.keys(finconsultant)
        const obj = keys.map((key) => {
            return { key: key, value: key, text: (finconsultant[key].smType === 'Finance Consultant') ? finconsultant[key].emp_name.concat(finconsultant[key].emp_code ? ` [ ${finconsultant[key].emp_code} ]` : "") : "", code: finconsultant[key].emp_code }

        }).filter((item) => {
            return item.text !== ''
        })
        return obj
    }
)