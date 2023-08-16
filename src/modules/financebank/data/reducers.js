import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const financeBankSchema = new schema.Entity('financebanks', {}, { idAttribute: 'id' })
const financeBankListSchema = [financeBankSchema]

const defaultFinanceBankParams = {
    financeBankFetched: false,
    createTitle: 'Create New Finance Bank',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Finance Bank',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === 'SAVED_FINANCE_BANK') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const bankId = action.payload.id
            return {
                ...state,
                [bankId]: action.payload
            }
        }else{
            return state
        }
    }
    if (action.type === 'FETCHED_FINANCE_BANK') {
        const normalizeFinanceBank = normalize(action.payload.data, financeBankListSchema)
        return merge({}, state, normalizeFinanceBank.entities.financebanks)
    }
    if (action.type === 'DELETED_FINANCE_BANK') {
        if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
            const bankId = action.payload.id
            let finalState = { ...state }
            delete finalState[bankId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function params(state = defaultFinanceBankParams, action) {
    if (action.type === 'FETCHED_FINANCE_BANK') {
        return {
            ...state,
            financeBankFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_FINANCE_BANK') {
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
    if (action.type === 'DELETED_FINANCE_BANK') {
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

    if (action.type === 'NOTIFICATION_DONE_FINANCE_BANK') {
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

const financebank = combineReducers({
    byId,
    params,
    notifications

})

export default financebank