import { call, takeEvery, takeLatest, all, put, select } from 'redux-saga/effects'
import { getIsTeamleaderFetched } from './selectors'
import { deletedTeamleader, fetchedTeamleader, savedTeamleader } from './actions'
import axios from 'axios';
import { handlError, parseError } from '../../app/serverError'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { merge } from 'lodash'


//#region Saga for Create SalesMan 

function* createTeamleader() {
  yield takeEvery('CREATE_TEAMLEADER', saveTeamleader)
}

function* saveTeamleader(action) {
  try {
    const { response, error } = yield call(saveTeamleaderAPI, action.payload)
    if (response) yield put(savedTeamleader(action.payload, response.data))
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

function saveTeamleaderAPI(data) {
  return axios.post(VEHICAL_URL + '/salesman/add', data)
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion


//#region Saga for Edited SalesConsultant 

function* editSalesTeamleader() {
  yield takeEvery('EDIT_TEAMLEADER', saveEditedTeamleader)
}

function* saveEditedTeamleader(action) {
  try {
    const { response, error } = yield call(editTeamleaderAPI, action.payload)
    if (response) yield put(savedTeamleader(action.payload, response.data))
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

function editTeamleaderAPI(data) {
  let user_id = data.id
  return axios.post(VEHICAL_URL + '/salesman/update/' + user_id, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion



//#region Saga for Delete SalesConsultant 

function* deleteTeamleader() {
  yield takeEvery('DELETE_TEAMLEADER', saveDeleteTeamleader)
}

function* saveDeleteTeamleader(action) {
  try {
    const { response, error } = yield call(deleteTeamleaderAPI, action.payload)
    if (response) yield put(deletedTeamleader({ id: action.payload.id, msg: response.data }))
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

function deleteTeamleaderAPI(data) {
  let salesConsultantId = data.id
  return axios.post(VEHICAL_URL + '/salesman/delete/' + salesConsultantId, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion


//#region Saga for List Tasks 

function* fetchTeamleader() {

  yield takeEvery('FETCH_TEAMLEADER', requestTeamleader)

}

function* requestTeamleader() {
  try {
    const isTeamleaderFetched = yield select(getIsTeamleaderFetched);
    if (!isTeamleaderFetched) {
      let { response, error } = yield call(requestTeamleaderAPI)
      if (response) yield put(fetchedTeamleader(response.data))
    }
  }
  catch (error) {
    yield put(handlError(parseError(error)))
    sagaErrorMessage(error)
  }

}

function requestTeamleaderAPI(data) {
  data = merge({}, data, userACL.atFetch())
  data.segid = data.cid
  return axios.post(VEHICAL_URL + '/salesman/list', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))

}

//#endregion

// region for excel download 

function* downloadTeamleaderExcel() {
  yield takeEvery('DOWNLOAD_TEAMLEADER_EXCEL', fetchTeamleaderExcel)

}

function* fetchTeamleaderExcel(action) {
  try{
    const { response, error } = yield call(fetchTeamleaderExcelAPI, action.payload)

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

function fetchTeamleaderExcelAPI(data) {
  data = merge({}, data, userACL.atFetch())
  let obj = {}
  obj.cid = data.cid
  obj.segid = data.cid
  obj.smType = 'Team_Leader'
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

export default function* teamleader() {
  yield all([
    createTeamleader(),
    fetchTeamleader(),
    editSalesTeamleader(),
    deleteTeamleader(),
    downloadTeamleaderExcel()
  ])
}  