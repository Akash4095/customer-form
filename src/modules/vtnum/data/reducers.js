import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const vtNumSchema = new schema.Entity('vtnums', {}, { idAttribute: 'id' })
const vtNumListSchema = [vtNumSchema]

const defaultVtNumParams = {
    vtnumFetched: false,
    createTitle: 'Create New Voucher Type',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Voucher Type',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === 'SAVED_VTNUM') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const vtNumId = action.payload.id
            return {
                ...state,
                [vtNumId]: action.payload
            }
        }else{
            return state
        }
    }
    if (action.type === 'FETCHED_VTNUM') {
        const normalizeVtNum = normalize(action.payload.data, vtNumListSchema)
        return merge({}, state, normalizeVtNum.entities.vtnums)
    }
    if (action.type === 'DELETED_VTNUM') {
        if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
            const vtNumId = action.payload.id
            let finalState = { ...state }
            delete finalState[vtNumId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function params(state = defaultVtNumParams, action) {
    if (action.type === 'FETCHED_VTNUM') {
        return {
            ...state,
            vtnumFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_VTNUM') {
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
    if (action.type === 'DELETED_VTNUM') {
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

    if (action.type === 'NOTIFICATION_DONE_VTNUM') {
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

const vtnum = combineReducers({
    byId,
    params,
    notifications

})

export default vtnum