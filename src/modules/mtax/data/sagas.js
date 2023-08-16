import { call, takeEvery, all, put, select } from 'redux-saga/effects'
import { VEHICAL_URL } from '../../../store/path'
import { getIsMtaxFetched } from './selectors'
import { deletedMtax, fetchedMtax, savedMtax } from './actions'
import { handlError, parseError } from '../../app/serverError'
import userACL from '../../../store/access'
import { merge } from 'lodash'
import axios from 'axios'


//#region saga for Create Mtax

function* createMtax() {
    yield takeEvery('CREATE_MTAX', saveMtax)
}

function* saveMtax(action) {
    try {
        const { response, error } = yield call(saveMtaxAPI, action.payload)
        if (response) yield put(savedMtax(action.payload, response.data))
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

function saveMtaxAPI(data) {
    return axios.post(VEHICAL_URL + '/m-tax/add', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion


//#region saga for Edit FormType

function* editMtax() {
    yield takeEvery('EDIT_MTAX', saveEditedMtax)
}

function* saveEditedMtax(action) {
    try {
        const { response, error } = yield call(editedMtaxAPI, action.payload)
        if (response) yield put(savedMtax(action.payload, response.data))
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

function editedMtaxAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + '/m-tax/update/' + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

//#region saga for delete FormType

function* deleteMtax() {
    yield takeEvery('DELETE_MTAX', saveDeleteMtax)
}

function* saveDeleteMtax(action) {
    try {
        const { response, error } = yield call(deleteMtaxAPI, action.payload)
        if (response) yield put(deletedMtax({ id: action.payload.id, msg: response.data }))
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

function deleteMtaxAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/m-tax/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

function* fetchMtax() {
    yield takeEvery('FETCH_MTAX', requestMtax)
}

function* requestMtax(action) {
    try {
        const isMtaxFetched = yield select(getIsMtaxFetched)
        if (!isMtaxFetched) {
            let { data } = yield call(requestMtaxAPI)
            yield put(fetchedMtax(data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestMtaxAPI(data) {
    data = merge({}, data, userACL.atFetch())
    return axios.post(VEHICAL_URL + '/m-tax/list', data, { crossDomain: true })
}

//#endregion

// region for excel download 

function* downloadMtaxExcel() {
    yield takeEvery('DOWNLOAD_MTAX_EXCEL', fetchMtaxExcel)

}

function* fetchMtaxExcel(action) {
    try {
        const { response, error } = yield call(fetchMtaxExcelAPI, action.payload)

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

function fetchMtaxExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    return axios.post(VEHICAL_URL + '/m-tax/download-ciexcel', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("saga Error:" + action.type)
    console.log(error)
    console.groupEnd()
}

export default function* mtax() {
    yield all([
        createMtax(),
        deleteMtax(),
        fetchMtax(),
        editMtax(),
        downloadMtaxExcel()
    ])
}