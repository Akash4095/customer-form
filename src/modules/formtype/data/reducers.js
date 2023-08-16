import { combineReducers } from 'redux';
import { merge } from 'lodash'
import { normalize, schema } from 'normalizr';

// Define a assettypes schema
const formTypeSchema = new schema.Entity('formtypes', {}, { idAttribute: 'id' });
const formTypeListSchema = [formTypeSchema];

const defaultFormTypeParams = {
  formTypeFetched: false,
  createTitle: 'Create New Form Type',
  createSubmitButtonText: 'Submit',
  editTitle: 'Edit Form Type',
  editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
  if (action.type === 'SAVED_FORM_TYPE') {
    if(action.txn === "success" || action.txn === "Success"){
      const formTypeID = action.payload.id;
      return {
        ...state,
        [formTypeID]: action.payload
      }
    }else{
      return state
    }
  }
  if (action.type === 'FETCHED_FORM_TYPE') {
    const normalizedFormType = normalize(action.payload.data, formTypeListSchema);
    return merge({}, state, normalizedFormType.entities.formtypes)
  }
  if (action.type === 'DELETED_FORM_TYPE') {
    if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
      const formTypeID = action.payload.id;
      let finalState = { ...state }
      delete finalState[formTypeID]
      return finalState
    } else {
      return state
    }
  } else {
    return state
  }
}
function byListId(state = {}, action) {
  if (action.type === 'SAVED_FORM_TYPE') {
    if(action.txn === "success" || action.txn === "Success"){
      const ID = action.payload.id;
      return {
        ...state,
        [ID]: action.payload
      }
    }
  }
  if (action.type === 'FETCHED_FORM_TYPE') {
    const normalizedFormType = normalize(action.payload.data, formTypeListSchema);
    return merge({}, state, normalizedFormType.entities.formtypes)
  }
  if (action.type === 'DELETED_FORM_TYPE') {
    if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
      const formTypeID = action.payload.id;
      let finalState = { ...state }
      delete finalState[formTypeID]
      return finalState
    } else {
      return state
    }
  } else {
    return state
  }
}

function params(state = defaultFormTypeParams, action) {
  if (action.type === 'FETCHED_FORM_TYPE') {
    return {
      ...state,
      formTypeFetched: true,
      isFetching: false
    }
  }
  else {
    return state
  }
}


function notifications(state = {}, action) {
  if (action.type === 'SAVED_FORM_TYPE') {
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
  if (action.type === 'DELETED_FORM_TYPE') {
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
  if (action.type === 'NOTIFICATION_DONE_FORM_TYPE') {
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

const formtype = combineReducers({
  byId,
  byListId,
  notifications,
  params
});

export default formtype;

