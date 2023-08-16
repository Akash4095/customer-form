import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from "normalizr";

const segmapSchema = new schema.Entity("segmaps", {}, { idAttribute: 'id' })
const segmapsListSchema = [segmapSchema]

const defaultSegmapParams = {
    segmapFetched: false,
    createTitle: 'Create New Voucher Mapping',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Voucher Mapping',
    editSubmitButtonText: 'Update'
}


function byId(state = {}, action) {
    if (action.type === "SAVED_SEGMAP") {
        if (action.txn === "success" || action.txn === "Success") {
            const segmapId = action.payload.id
            return {
                ...state,
                [segmapId]: action.payload
            }
        } else {
            return state
        }
    }

    if (action.type === "FETCHED_SEGMAP") {
        const normalizeSegmap = normalize(action.payload.data, segmapsListSchema)
        return merge({}, state, normalizeSegmap.entities.segmaps)
    }
    if (action.type === "DELETED_SEGMAP") {
        if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
            const segmapId = action.payload.id
            let finalState = { ...state }
            delete finalState[segmapId]
            return finalState
        } else {
            return state
        }
    } else {
        return state
    }
}

function savedOthers(state = {}, action) {
    if (action.type === "SAVED_OTHERS") {
        return action.payload
    } else {
        return state
    }
}

function fetchedOthersList(state = {}, action) {
    if (action.type === "FETCHED_OTHERS_LIST") {
        return action.payload
    } else {
        return state
    }
}


function params(state = defaultSegmapParams, action) {
    if (action.type === "FETCHED_SEGMAP") {
        return {
            ...state,
            segmapFetched: true,
            isFetching: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {
    if (action.type === "SAVED_SEGMAP") {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                save: {
                    status: (action.txn === "success" || action.txn === "Success") ? 'success' : 'error',
                    msg: action.msg
                }
            }
        }
    }
    if (action.type === 'DELETED_SEGMAP') {
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

    if (action.type === 'NOTIFICATION_DONE_SEGMAP') {
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

const segmap = combineReducers({
    byId,
    params,
    savedOthers,
    fetchedOthersList,
    notifications
})

export default segmap