import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const leadSourceSchema = new schema.Entity('leadsources', {}, { idAttribute: 'id' })
const leadSourceListSchema = [leadSourceSchema]

const defaultLeadSourceParams = {
    leadSourceFetched: false,
    createTitle: 'Create New Lead Source',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Lead Source',
    editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
    if (action.type === 'SAVED_LEAD_SOURCE') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const LSId = action.payload.id
            return {
                ...state,
                [LSId]: action.payload
            }
        }else{
            return state
        }
    }
    if (action.type === 'FETCHED_LEAD_SOURCE') {
        const normalizeLeadSource = normalize(action.payload.data, leadSourceListSchema)
        return merge({}, state, normalizeLeadSource.entities.leadsources)
    }
    if (action.type === 'DELETED_LEAD_SOURCE') {
        if (action.payload.msg.type === 'success' || action.payload.msg.type === 'Success') {
            const LSId = action.payload.id
            let finalState = { ...state }
            delete finalState[LSId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function params(state = defaultLeadSourceParams, action) {
    if (action.type === 'FETCHED_LEAD_SOURCE') {
        return {
            ...state,
            leadSourceFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {

    if (action.type === 'SAVED_LEAD_SOURCE') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                save: {
                    status: (action.txn === 'success' || action.txn === 'Success')  ? 'success' : 'error',
                    msg: action.msg
                }
            }
        }
    }
    if (action.type === 'DELETED_LEAD_SOURCE') {
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

    if (action.type === 'NOTIFICATION_DONE_LEAD_SOURCE') {
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

const leadsource = combineReducers({
    byId,
    params,
    notifications

})

export default leadsource