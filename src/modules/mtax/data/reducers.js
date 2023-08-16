import { combineReducers } from 'redux';
import { merge } from 'lodash'
import { normalize, schema } from 'normalizr';

// Define a assettypes schema
const mtaxSchema = new schema.Entity('mtaxs', {}, { idAttribute: 'id' });
const mtaxListSchema = [mtaxSchema];

const defaultMtaxParams = {
  mtaxFetched: false,
  createTitle: 'Create New M-Tax',
  createSubmitButtonText: 'Submit',
  editTitle: 'Edit New M-Tax',
  editSubmitButtonText: 'Update'
}


function byId(state = {}, action) {
  if (action.type === "SAVED_MTAX") {
    if (action.txn === "success" || action.txn === "Success") {
      const mtaxId = action.payload.id
      return {
        ...state,
        [mtaxId]: action.payload
      }
    } else {
      return state
    }
  }
  if (action.type === "FETCHED_MTAX") {
    const normalizedMtax = normalize(action.payload.data, mtaxListSchema)
    return merge({}, state, normalizedMtax.entities.mtaxs)
  }
  if (action.type === "DELETED_MTAX") {
    if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
      const mtaxId = action.payload.id
      let finalState = { ...state }
      delete finalState[mtaxId]
      return finalState
    } else {
      return state
    }
  } else {
    return state
  }
}

function params(state = defaultMtaxParams, action) {
  if (action.type === 'FETCHED_MTAX') {
    return {
      ...state,
      mtaxFetched: true,
      isFetching: false
    }
  }
  else {
    return state
  }
}


function notifications(state = {}, action) {
  if (action.type === 'SAVED_MTAX') {
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
  if (action.type === 'DELETED_MTAX') {
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
  if (action.type === 'NOTIFICATION_DONE_MTAX') {
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

const mtax = combineReducers({
  byId,
  notifications,
  params
});

export default mtax;

