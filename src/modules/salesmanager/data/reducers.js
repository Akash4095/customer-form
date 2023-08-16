import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const salesmanagerSchema = new schema.Entity('salesmanagers', {}, { idAttribute: 'id' })
const salesmanagerListSchema = [salesmanagerSchema]

const defaultSalesmanagerParams = {
    salesmanagerFetched: false,
    createTitle: 'Create New Sales Manager',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Sales Manager',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === 'SAVED_SALESMANAGER') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const salesmanagerId = action.payload.id
            return {
                ...state,
                [salesmanagerId]: action.payload
            }
        }else{
            return state
        }
    }
    if (action.type === 'FETCHED_SALESMANAGER') {
        const normalizeSalesmanager = normalize(action.payload.data, salesmanagerListSchema)
        return merge({}, state, normalizeSalesmanager.entities.salesmanagers)
    }
    if (action.type === 'DELETED_SALESMANAGER') {
        if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
            const salesmanagerId = action.payload.id
            let finalState = { ...state }
            delete finalState[salesmanagerId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function params(state = defaultSalesmanagerParams, action) {
    if (action.type === 'FETCHED_SALESMANAGER') {
        return {
            ...state,
            salesmanagerFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_SALESMANAGER') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                save: {
                    status: (action.txn === 'success' || action.txn === 'Success') ? 'success' : 'error',
                    msg: action.msg
                }
            }
        }
    }
    if (action.type === 'DELETED_SALESMANAGER') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                delete: {
                    status: (action.payload.msg.type === "success" || action.payload.msg.type === "Success") ? 'success' : 'error',
                    msg: action.payload.msg.msg
                }
            }
        }
    }

    if (action.type === 'NOTIFICATION_DONE_SALESMANAGER') {
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

const salesmanager = combineReducers({
    byId,
    params,
    notifications

})

export default salesmanager