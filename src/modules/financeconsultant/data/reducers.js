import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const financeConsultantSchema = new schema.Entity('financeconsultants', {}, { idAttribute: 'id' })
const financeConsultantListSchema = [financeConsultantSchema]

const defaultFinanceConsultantParams = {
    financeConsultantFetched: false,
    createTitle: 'Create New Finance Consultant',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Finance Consultant',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === 'SAVED_FINANCE_CONSULTANT') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const FCId = action.payload.id
            return {
                ...state,
                [FCId]: action.payload
            }
        }else{
            return state
        }
    }
    if (action.type === 'FETCHED_FINANCE_CONSULTANT') {
        const normalizeFinanceConsultant = normalize(action.payload.data, financeConsultantListSchema)
        return merge({}, state, normalizeFinanceConsultant.entities.financeconsultants)
    }
    if (action.type === 'DELETED_FINANCE_CONSULTANT') {
        if (action.payload.msg.type === 'success' || action.payload.msg.type === 'Success') {
            const FCId = action.payload.id
            let finalState = { ...state }
            delete finalState[FCId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function params(state = defaultFinanceConsultantParams, action) {
    if (action.type === 'FETCHED_FINANCE_CONSULTANT') {
        return {
            ...state,
            financeConsultantFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_FINANCE_CONSULTANT') {
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
    if (action.type === 'DELETED_FINANCE_CONSULTANT') {
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

    if (action.type === 'NOTIFICATION_DONE_FINANCE_CONSULTANT') {
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

const financeConsultant = combineReducers({
    byId,
    params,
    notifications

})

export default financeConsultant