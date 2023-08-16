import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from 'normalizr'

const ciFormSchema = new schema.Entity('ciforms', {}, { idAttribute: 'id' });
const ciFormListSchema = [ciFormSchema]

const segidSchema = new schema.Entity('ciforms', {}, { idAttribute: 'segid' });
const segidListSchema = [segidSchema]

const accesoriesSchema = new schema.Entity('accesories', {}, { idAttribute: 'id' });
const accesoriesListSchema = [accesoriesSchema]


const defaultCiFormParams = {
    itemsFetched: false,
    isFetching: false,
    createTitle: 'CI FORM',
    createSubmitButtonText: 'Save',
    editTitle: 'Edit CI FORM',
    editSubmitButtonText: 'Update',
    isSuccessFullySave: false

}

function byId(state = {}, action) {
    if (action.type === 'SAVED_CIFORM') {
        if (action.txn === 'success' || action.txn === 'Success') {
            const formId = action.payload.id
            return {
                ...state,
                [formId]: action.payload
            }
        } else {
            return state
        }
    }
    if (action.type === 'FETCHED_CIFORM') {
        const normalizeCiForm = normalize(action.payload.data, ciFormListSchema)
        return merge({}, state, normalizeCiForm.entities.ciforms)
    }
    if (action.type === 'DELETED_CIFORM') {
        if (action.payload.msg.type === 'success' || action.payload.msg.type === 'Success') {
            const formID = action.payload.id;
            let finalState = { ...state }
            delete finalState[formID]
            return finalState

        } else {
            return state
        }
    }
    else {
        return state
    }
}

function saveFetchedCiFormDate(state = {}, action) {
    if (action.type === 'SAVE_FETCHED_CIFORM_DATE') {
        return action.payload
    } else {
        return state
    }
}

function storeSearchedVin(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_VIN') {
        if (action.payload.type !== "error") {
            return action.payload.data
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedUsedCarItem(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_USED_CAR_ITEM') {
        if (action.payload.type !== "error") {
            return action.payload.data
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedAccesoriesItem(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_ACCESSORIES_ITEM') {
        // console.log('action.payload.data', action.payload.data)
        if (action.payload.type !== "error") {
            let accList = normalize(action.payload.data, accesoriesListSchema);
            return merge({}, state, accList.entities.accesories);
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedVariant(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_VARIANT') {
        if (action.payload.type !== "error") {
            return action.payload.data
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedSegList(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_SEG_LIST') {
        if (action.payload.type !== "error") {
            const normalizeSegList = normalize(action.payload.data, segidListSchema)
            return merge({}, state, normalizeSegList.entities.ciforms)
        } else {
            return state
        }
    } else {
        return state
    }
}

function storeSearchedItemBatch(state = {}, action) {
    if (action.type === 'STORE_SEARCHED_ITEM_BATCH') {
        return action.payload
    }
    if (action.type === 'CLEAR_SEARCHED_ITEM_BATCH') {
        console.log('clear called', )
        return {}
    }
    else {
        return state
    }
}

function storePriceList(state = {}, action) {
    if (action.type === 'STORE_PRICE_LIST') {
        return action.payload.data
    } else {
        return state
    }
}

function storeSegmap(state = {}, action) {
    if (action.type === 'STORE_CIFORM_SEGMAP') {
        return action.payload.data
    } else {
        return state
    }
}

function fetchedRlbSyncCiform(state = {}, action) {
    if (action.type === 'FETCHED_RLB_SYNC_CIFORM ') {
        return action.payload
    } else {
        return state
    }
}

function fetchedRlbDiscSyncCiform(state = {}, action) {
    if (action.type === 'FETCHED_RLB_DISC_SYNC_CIFORM ') {
        return action.payload
    } else {
        return state
    }
}

function params(state = defaultCiFormParams, action) {
    if (action.type === 'FETCHED_CIFORM') {
        return {
            ...state,
            itemsFetched: true,
            isFetching: false
        }
    } if (action.type === 'SAVED_CIFORM') {
        if (action.txn === 'success' || action.txn === 'Success') {
            return {
                ...state,
                isSuccessFullySave: true
            }
        } else {
            return {
                ...state,
                isSuccessFullySave: false
            }
        }
    } if (action.type === 'REMOVE_IS_SAVED_CIFORM') {
        return {
            ...state,
            isSuccessFullySave: false
        }
    } else {
        return state
    }
}

function notifications(state = {}, action) {
    if (action.type === 'SAVED_CIFORM') {
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
    if (action.type === 'DELETED_CIFORM') {
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

    if (action.type === 'NOTIFICATION_DONE_CIFORM') {
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

const ciform = combineReducers({
    byId,
    params,
    storeSearchedVin,
    storeSearchedSegList,
    storeSegmap,
    storePriceList,
    fetchedRlbSyncCiform,
    fetchedRlbDiscSyncCiform,
    notifications,
    saveFetchedCiFormDate,
    storeSearchedUsedCarItem,
    storeSearchedAccesoriesItem,
    storeSearchedVariant,
    storeSearchedItemBatch,
})

export default ciform;