import { txns } from './store/txnMiddleware'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import  salesConsultant  from './modules/salesconsultant/data/reducers'
import saletype from './modules/saletype/data/reducers'
import salesmanager from './modules/salesmanager/data/reducers'
import financebank from './modules/financebank/data/reducers'
import financeConsultant from './modules/financeconsultant/data/reducers'
import leadsource from './modules/leadsource/data/reducers'
import ciform from './modules/ciform/data/reducers'
import customer from './modules/customer/data/reducers'
import formtype from './modules/formtype/data/reducers'
import teamleader from './modules/teamleader/data/reducers'
import mtax from "./modules/mtax/data/reducers"
import segmap from "./modules/segmap/data/reducers"
import vtnum from "./modules/vtnum/data/reducers"



const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    txns,
    salesConsultant,
    saletype,
    salesmanager,
    financebank,
    financeConsultant,
    leadsource,
    ciform,
    customer,
    formtype,
    teamleader,
    mtax,
    segmap,
    vtnum,
   
})

export default rootReducer