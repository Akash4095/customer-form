import { call, takeEvery, takeLatest, all, put, select } from 'redux-saga/effects'
import { getIsSalesConsultantFetched } from './selectors'
import { deletedSalesConsultant, fetchedSalesConsultant, receivedOptionsSalesConsultant, savedSalesConsultant } from './actions'
import axios from 'axios';
import { handlError, parseError } from '../../app/serverError'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { merge } from 'lodash'


//#region Saga for Create SalesMan 

function* createSalesConsultant() {
  yield takeEvery('CREATE_SALES_CONSULTANT', saveSalesConsultant)
}

function* saveSalesConsultant(action) {
  try {
    const { response, error } = yield call(saveSalesConsultantAPI, action.payload)
    if (response) yield put(savedSalesConsultant(action.payload, response.data))
    else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }

}

function saveSalesConsultantAPI(data) {
  return axios.post(VEHICAL_URL + '/salesman/add', data)
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion


//#region Saga for Edited SalesConsultant 

function* editSalesConsultant() {
  yield takeEvery('EDIT_SALES_CONSULTANT', saveEditedSalesConsultant)
}

function* saveEditedSalesConsultant(action) {
  try {
    const { response, error } = yield call(editSalesConsultantAPI, action.payload)
    if (response) yield put(savedSalesConsultant(action.payload, response.data))
    else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function editSalesConsultantAPI(data) {
  let user_id = data.id
  return axios.post(VEHICAL_URL + '/salesman/update/' + user_id, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion



//#region Saga for Delete SalesConsultant 

function* deleteSalesConsultant() {
  yield takeEvery('DELETE_SALES_CONSULTANT', saveDeleteSalesConsultant)
}

function* saveDeleteSalesConsultant(action) {
  try {
    const { response, error } = yield call(deleteSalesConsultantAPI, action.payload)
    if (response) yield put(deletedSalesConsultant({ id: action.payload.id, msg: response.data }))
    else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function deleteSalesConsultantAPI(data) {
  let salesConsultantId = data.id
  return axios.post(VEHICAL_URL + '/salesman/delete/' + salesConsultantId, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion


//#region Saga for List Tasks 

function* fetchSalesConsultant() {

  yield takeEvery('FETCH_SALES_CONSULTANT', requestSalesConsultant)

}

function* requestSalesConsultant(action) {
  try {
    const isSalesConsultantFetched = yield select(getIsSalesConsultantFetched);
    if (!isSalesConsultantFetched) {
      let { response, error } = yield call(requestSalesConsultantAPI)
      if (response) yield put(fetchedSalesConsultant(response.data))
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }

}

function requestSalesConsultantAPI(data) {
  data = merge({}, data, userACL.atFetch())
  data.segid = data.cid
  return axios.post(VEHICAL_URL + '/salesman/list', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))

}

//#endregion

// region for excel download 

function* downloadSalesConsultantExcel() {
  yield takeEvery('DOWNLOAD_SALES_CONSULTANT_EXCEL', fetchSalesConsultantExcel)

}

function* fetchSalesConsultantExcel(action) {
  try {
    const { response, error } = yield call(fetchSalesConsultantExcelAPI, action.payload)

    if (response) {
      const fileURL = VEHICAL_URL + "/fileDownload/download-file/" + response.data
      const link = document.createElement('a');
      link.href = fileURL
      link.setAttribute('download', 'realbooks_accounts.xlsx')
      document.body.appendChild(link);
      link.click();

    }
    else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }


}

function fetchSalesConsultantExcelAPI(data) {
  data = merge({}, data, userACL.atFetch())
  let obj = {}
  obj.cid = data.cid
  obj.segid = data.cid
  obj.smType = 'Sales_Consultant'
  return axios.post(VEHICAL_URL + '/salesman/download-ciexcel', obj, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
  console.group("Saga Error:" + action.type)
  console.log(error)
  console.groupEnd()
}

export default function* salesConsultantSaga() {
  yield all([
    createSalesConsultant(),
    fetchSalesConsultant(),
    editSalesConsultant(),
    deleteSalesConsultant(),
    downloadSalesConsultantExcel()
  ])
}  