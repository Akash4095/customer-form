import diff from 'deep-diff';
import v4 from 'uuid';
import { combineReducers } from 'redux'
import moment  from 'moment'

export const txnMiddleware = store => next => action => {

  const prevState = store.getState();
  const result = next(action)
  const nextState = store.getState();

  if (action.hasOwnProperty('diff') || action.hasOwnProperty('txn')){

        let txnid = v4()        
        if (action.hasOwnProperty('txn'))
            txnid = action.payload.txnid

        let error = '';
        if (action.hasOwnProperty('err'))
            error = action.err

        let difference = '';
        if (action.hasOwnProperty('diff'))
            difference = JSON.stringify(diff(prevState, nextState));

        const txn = { 
                id: txnid,
                type: action.type !== 'SERVER_ERROR' ? action.type : action.fromAction,
                payload : action.payload,
                txnStatus: action.txn,
                err : error,
                diff: difference,
                dt: moment().toJSON() 
            }

        store.dispatch ( {type:'STORE_TXN', payload: txn } )
    }
  return result
}
  
function txnLog (state = {}, action) {
    if (action.type === 'STORE_TXN') { 
        const txnid = action.payload.id;   
        return { ...state, 
            [txnid]: action.payload }        
    } else {
        return state
    }
}

export const txns = combineReducers({
    txnLog
});
