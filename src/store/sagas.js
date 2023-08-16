import { all } from 'redux-saga/effects'
import salesConsultantSaga from '../modules/salesconsultant/data/sagas'
import saleTypeSaga from '../modules/saletype/data/sagas'
import salesmanager from '../modules/salesmanager/data/sagas'
import financebank from '../modules/financebank/data/sagas'
import financeConsultant from '../modules/financeconsultant/data/sagas'
import leadsource from '../modules/leadsource/data/sagas'
import ciFormSaga from '../modules/ciform/data/sagas'
import customer from '../modules/customer/data/sagas'
import formtype from '../modules/formtype/data/sagas'
import teamleader from "../modules/teamleader/data/sagas"
import mtax from "../modules/mtax/data/sagas"
import segmap from "../modules/segmap/data/sagas"
import vtnum from "../modules/vtnum/data/sagas"


export default function* rootSaga() {
  yield all([
    salesConsultantSaga(),
    ciFormSaga(),
    saleTypeSaga(),
    salesmanager(),
    financebank(),
    financeConsultant(),
    leadsource(),
    customer(),
    formtype(),
    teamleader(),
    mtax(),
    segmap(),
    vtnum(),
    
  ])
} 