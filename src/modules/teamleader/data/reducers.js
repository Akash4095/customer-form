import { combineReducers } from "redux";
import { merge } from "lodash";
import { normalize, schema } from "normalizr";


// define a salesman schema
const teamleaderSchema = new schema.Entity('teamleaders', {}, { idAttribute: 'id' });
const teamleaderListSchema = [teamleaderSchema];

const defaultTeamleaderParams = {
    teamleaderFetched: false,
    createTitle: 'Create New Team Leader',
    createSubmitButtonText: 'Submit',
    editTitle: 'Edit Team Leader',
    editSubmitButtonText: 'Update'

}

function byId(state = {}, action) {
    if (action.type === 'SAVED_TEAMLEADER') {
        if(action.txn === 'success' || action.txn === 'Success'){
            const teamleaderID = action.payload.id;
            return {
                ...state,
                [teamleaderID]: action.payload
            }
        }
    }

    if (action.type === 'FETCHED_TEAMLEADER') {
        const normalizeTeamleader = normalize(action.payload.data, teamleaderListSchema)
        return merge({}, state, normalizeTeamleader.entities.teamleaders);
    }

    if (action.type === 'DELETED_TEAMLEADER') {
        if (action.payload.msg.type === 'success') {
            const teamleaderID = action.payload.id;
            let finalState = { ...state }
            delete finalState[teamleaderID]
            return finalState

        } else {
            return state
        }
    }
    else {
        return state
    }
}



function params(state = defaultTeamleaderParams, action) {
    if (action.type === 'FETCHED_TEAMLEADER') {
        return {
            ...state,
            teamleaderFetched: true,
            isFetching: false
        }
    }
    else {
        return state
    }
}

function notifications(state = {}, action) {
    if (action.type === 'SAVED_TEAMLEADER') {
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
    if (action.type === 'DELETED_TEAMLEADER') {
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

    if (action.type === 'NOTIFICATION_DONE_TEAMLEADER') {
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

const teamleader = combineReducers({
    byId,
    params,
    notifications
})

export default teamleader;