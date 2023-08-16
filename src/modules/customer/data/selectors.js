import { startsWith, cloneDeep, at } from 'lodash';
import { createSelector } from "reselect";
import { customer } from './model'


export const getIsFetchingCustomer = (state, props) => state.customer.params.isFetching;
export const getIsCustomerFetched = (state, props) => state.customer.params.customerFetched;
export const getCustomerList = (state, prop) => state.customer.byId
export const getSearchCustResults = (state, props) => state.customer.storeSearchedCustomer
export const getCountryNames= (state,props)=> state.customer.storeCountryXml
export const getStateNames= (state,props)=> state.customer.storeStateXml
export const getNotification = (state, id) => state.customer.notifications[id]


export const getCustomer = (state, props) => {
    // if (props.match.path === '/customer/create') {
    //     return customer()
    // }
    // if (props.match.path === '/customer/edit/:id') {
    //     let _id = props.match.params.id
    //     let obj = cloneDeep(state.customer.byId[_id]);
    //     return obj
    // }
    return customer()
}

export const getCustomerParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/customer/create')) {
        params.title = state.customer.params.createTitle
        params.submitButtonText = state.customer.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/customer/edit/')) {
        params.title = state.customer.params.editTitle
        params.submitButtonText = state.customer.params.editSubmitButtonText
    };

    return params
}



export const selectCustomer = (state, props) => {
    const customer = state.customer.storeSearchedCustomer
    const keys = Object.keys(customer)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: customer[key].customerName }
    });
    return obj


}

export const selectCustomerName = createSelector(
    getSearchCustResults,
    customer => {
        const keys = Object.keys(customer)
        const obj = keys.map((key) => { 
            customer[key].key = parseInt(customer[key].id, 10)
            customer[key].value = parseInt(customer[key].id, 10)
            customer[key].text = customer[key].ledger_name
            return customer[key]
         })
        return obj

    })

    export const selectCountry = (state, props) => {
        const country = state.customer.storeCountryXml
        const keys = Object.keys(country)
        const obj = keys.map((key) => {
            return { key: country[key].countryName, value: country[key].countryName , text: country[key].countryName, countryId: country[key].countryId}
        });
        return obj
    
    }

    export const selectState = (state, props) => {
        const stateList = state.customer.storeStateXml
        const keys = Object.keys(stateList)
        const obj = keys.map((key) => {
            return { key: key, value:stateList[key].stateId, text: stateList[key].stateName }
        });
        return obj
    
    }