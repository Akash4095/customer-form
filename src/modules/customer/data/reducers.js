import { combineReducers } from "redux";
import { normalize, schema } from "normalizr"
import { merge } from "lodash";


const customerSchema = new schema.Entity('customers', {}, { idAttribute: 'id' })
const customerListSchema = [customerSchema]



const defaultCustomerParams = {
    customerFetched: false,
    createTitle: 'Create New Customer',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Customer',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === "SAVED_CUSTOMER") {
        if(action.txn === 'success' || action.txn === 'Success'){
            const custID = action.payload.id
            return {
                ...state,
                [custID]: action.payload
            }
        }else{
            return state
        }
    }

    if (action.type === "FETCHED_CUSTOMER") {
        // const normalizedCustomer = normalize(action.payload.data, customerListSchema)
        // return merge({}, state, normalizedCustomer.entities.customers)
        return action.payload.data
    }

    if (action.type === "DELETED_CUSTOMER") {
        if (action.payload.msg.type === 'success' || action.payload.msg.type === 'Success') {
            const custId = action.payload.id
            let finalState = { ...state }
            delete finalState[custId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedCustomer(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_CUSTOMER') {
        if(action.payload.type !== "error"){
            const normalizedCustomer = normalize(action.payload.data, customerListSchema)
            return merge({}, state, normalizedCustomer.entities.customers)
        }else{
            return state
        }
    } else {
        return state
    }
}

function storeCountryXml(state = {}, action) {
    if (action.type === 'FETCHED_COUNTRY_XML') {
        return action.payload
    } else {
        return state
    }
}

function storeStateXml(state = {}, action) {
    if (action.type === 'FETCHED_STATE_XML') {
        return action.payload
    } else {
        return state
    }
}

function params(state = defaultCustomerParams, action) {
    if (action.type === 'FETCHED_CUSTOMER') {
        return {
            ...state,
            customerFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_CUSTOMER') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                save: {
                    status: (action.txn === 'success' || action.txn === 'Success') ? 'success' : 'error',
                    msg: action.txn
                }
            }
        }
    }
    if (action.type === 'DELETED_CUSTOMER') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                delete: {
                    status: (action.payload.msg.type === 'success' || action.payload.msg.type === 'Success') ? 'success' : 'error',
                    msg: action.payload.msg.msg
                }
            }
        }
    }

    if (action.type === 'NOTIFICATION_DONE_CUSTOMER') {
        const { id, type } = action.payload
        // Remove the 'id' element from state
        const { [id]: idValue, ...restOfState } = state;
        // Remove the 'type' from the 'id' element
        const { [type]: removedValue, ...restOfId } = idValue;
        // Merge back together
        const finalState = { ...restOfState, [id]: restOfId };
        return finalState

    } else {
        return state
    }

}

const customer = combineReducers({
    byId,
    params,
    storeSearchedCustomer,
    storeCountryXml,
    storeStateXml,
    notifications

})

export default customer