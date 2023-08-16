import { combineReducers } from 'redux';
import { merge } from 'lodash'
import { normalize, schema } from 'normalizr';

// Define a assettypes schema
const saleTypeSchema = new schema.Entity('saletypes', {}, { idAttribute: 'id' });
const saleTypeListSchema = [saleTypeSchema];

const defaultSaleTypeParams = {
  saleTypeFetched: false,
  createTitle: 'Create New Sale Type',
  createSubmitButtonText: 'Submit',
  editTitle: 'Edit Sale Type',
  editSubmitButtonText: 'Update'
}

function byId(state = {}, action) {
  if (action.type === 'SAVED_SALE_TYPE') {
    if(action.txn === "success" || action.txn === "Success"){
      const saleTypeID = action.payload.id;
      return {
        ...state,
        [saleTypeID]: action.payload
      }
    }else{
      return state
    }
  }
  if (action.type === 'FETCHED_SALE_TYPE') {
    const normalizedSaleType = normalize(action.payload.data, saleTypeListSchema);
    return merge({}, state, normalizedSaleType.entities.saletypes)
  }
  if (action.type === 'DELETED_SALE_TYPE') {
    if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
      const saleTypeID = action.payload.id;
      let finalState = { ...state }
      delete finalState[saleTypeID]
      return finalState
    } else {
      return state
    }
  } else {
    return state
  }
}
function byListId(state = {}, action) {
  if (action.type === 'SAVED_SALE_TYPE') {
    if(action.txn === "success" || action.txn === "Success"){
      const ID = action.payload.id;
      return {
        ...state,
        [ID]: action.payload
      }
    }else{
      return state
    }
  }
  if (action.type === 'FETCHED_SALE_TYPE') {
    const normalizedSaleType = normalize(action.payload.data, saleTypeListSchema);
    return merge({}, state, normalizedSaleType.entities.saletypes)
  }
  if (action.type === 'DELETED_SALE_TYPE') {
    if (action.payload.msg.type === "success" || action.payload.msg.type === "Success") {
      const saleTypeID = action.payload.id;
      let finalState = { ...state }
      delete finalState[saleTypeID]
      return finalState
    } else {
      return state
    }
  } else {
    return state
  }
}

function params(state = defaultSaleTypeParams, action) {
  if (action.type === 'FETCHED_SALE_TYPE') {
    return {
      ...state,
      saleTypeFetched: true,
      isFetching: false
    }
  }
  else {
    return state
  }
}


function notifications(state = {}, action) {
  if (action.type === 'SAVED_SALE_TYPE') {
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
  if (action.type === 'DELETED_SALE_TYPE') {
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
  if (action.type === 'NOTIFICATION_DONE_SALE_TYPE') {
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

const saletype = combineReducers({
  byId,
  byListId,
  notifications,
  params
});

export default saletype;

