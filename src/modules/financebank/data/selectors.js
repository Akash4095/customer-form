import { startsWith, cloneDeep } from 'lodash'
import { financebank } from './model'

export const getIsFetchingFinanceBank = (state, props) => state.financebank.params.isFetching
export const getIsFinanceBankFetched = (state, props) => state.financebank.params.financeBankFetched
export const getFinanceBankList = (state, props) => state.financebank.byId
export const getNotification = (state, id) => state.financebank.notifications[id]

export const getFinanceBank = (state, props) => {
    if (props.match.path === '/financebank/create') {
        return financebank()
    }
    if (props.match.path === '/financebank/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.financebank.byId[_id]);
        return obj
    }
}

export const getFinanceBankForModel = (state, props) => {
    if(props.id === ""){
        return financebank()
    }else{
        let _id = props.id
        let obj = cloneDeep(state.financebank.byId[_id]);
        return obj
    }
    
}

export const getFinanceBankParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/financebank/create')) {
        params.title = state.financebank.params.createTitle
        params.submitButtonText = state.financebank.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/financebank/edit')) {
        params.title = state.financebank.params.editTitle
        params.submitButtonText = state.financebank.params.editSubmitButtonText
    };

    return params
}

export const selectFinanceBank = (state, props) => {
    const financebank = state.financebank.byId
    const keys = Object.keys(financebank)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: financebank[key].finbank_name.concat(financebank[key].finbank_code ? ` [ ${financebank[key].finbank_code} ]` : "") }
    });
    return obj

}