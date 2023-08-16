import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from "normalizr";


// define a salesman schema
const salesConsultantSchema = new schema.Entity('salesconsultants', {}, { idAttribute: 'id' });
const salesConsultantListSchema = [salesConsultantSchema];

const defaultSalesConsultantParams = {
    salesConsultantFetched: false,
    createTitle: 'Create New Sales Consultant',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Sales Consultant',
    editSubmitButtonText: 'Update'

}

function byId(state = {}, action) {
    if (action.type === 'SAVED_SALES_CONSULTANT') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const salesConsultantID = action.payload.id;
            return {
                ...state,
                [salesConsultantID]: action.payload
            }
        }
    }

    if (action.type === 'FETCHED_SALES_CONSULTANT') {
        const normalizeSalesConsultant = normalize(action.payload.data, salesConsultantListSchema)
        return merge({}, state, normalizeSalesConsultant.entities.salesconsultants);
    }

    if (action.type === 'DELETED_SALES_CONSULTANT') {
        if (action.payload.msg.type === 'success') {
            const salesConsultantID = action.payload.id;
            let finalState = { ...state }
            delete finalState[salesConsultantID]
            return finalState

        } else {
            return state
        }
    }
    else {
        return state
    }
}


// function options(state = {}, action) {
//     if (action.type === 'OPTIONS_RECEIVED_SALES_CONSULTANT') {
//         // return { options: action.payload }
//         const normalizedSalesman = normalize(action.payload, salesConsultantListSchema);
//         return merge({}, normalizedSalesman.entities.salesConsultants)
//     } else {
//         return state
//     }
// }

function params(state = defaultSalesConsultantParams, action) {
    if (action.type === 'FETCHED_SALES_CONSULTANT') {
        return {
            ...state,
            salesConsultantFetched: true,
            isFetching: false
        }
    }
    // if (action.type === 'OPTIONS_REQUESTED_SALES_CONSULTANT') {
    //     return {
    //         ...state,
    //         optionsFetched: false,
    //         isOptionsFetching: true
    //     }
    // }
    // if (action.type === 'OPTIONS_RECEIVED_SALES_CONSULTANT') {
    //     return {
    //         ...state,
    //         optionsFetched: true,
    //         isOptionsFetching: false
    //     }
    // }
    else {
        return state
    }
}

function notifications(state = {}, action) {
    if (action.type === 'SAVED_SALES_CONSULTANT') {
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
    if (action.type === 'DELETED_SALES_CONSULTANT') {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                delete: {
                    status: action.payload.msg.type === "success" ? 'success' : 'error',
                    msg: action.payload.msg.msg
                }
            }
        }


        
    }

    if (action.type === 'NOTIFICATION_DONE_SALES_CONSULTANT') {
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

const salesConsultant = combineReducers({
    byId,
    // options,
    params,
    notifications
})

export default salesConsultant;