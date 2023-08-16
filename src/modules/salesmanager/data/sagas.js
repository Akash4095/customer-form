import { call, takeEvery, takeLatest, all, put, select } from 'redux-saga/effects'
import { getIsSalesmanagerFetched } from './selectors'
import { deletedSalesmanager, fetchedSalesmanager, savedSalesmanager } from './actions'
import axios from 'axios';
import { handlError, parseError } from '../../app/serverError'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { merge } from 'lodash'


// region for create salesmanager

function* createSalesmanager() {
    yield takeEvery('CREATE_SALESMANAGER', saveSalesmanager)
}

function* saveSalesmanager(action) {
    try {
        const { response, error } = yield call(saveSalesmanagerAPI, action.payload)
        if (response) yield put(savedSalesmanager(response.data, action.payload))
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

function saveSalesmanagerAPI(data) {
    return axios.post(VEHICAL_URL + '/salesman/add', data)
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

/// end region


// region for edit salesmanager


function* editSalesmanager() {
    yield takeEvery('EDIT_SALESMANAGER', saveEditedSalesmanager)
}

function* saveEditedSalesmanager(action) {
    try {
        const { response, error } = yield call(editedSalesmanagerAPI, action.payload)
        if (response) yield put(savedSalesmanager(response.data, action.payload))
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

function editedSalesmanagerAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + '/salesman/update/' + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}


// end region 

// region for delete Salesmanager

function* deleteSalesmanager() {
    yield takeEvery('DELETE_SALESMANAGER', saveDeleteSalesmanager)
}

function* saveDeleteSalesmanager(action) {
    try {
        const { response, error } = yield call(deleteSalesmanagerAPI, action.payload)
        if (response) yield put(deletedSalesmanager({ id: action.payload.id, msg: response.data }))
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

function deleteSalesmanagerAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + '/salesman/delete/' + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch salesmanager

function* fetchSalesmanager() {
    yield takeEvery('FETCH_SALESMANAGER', requestSalesmanager)
}

function* requestSalesmanager(action) {
    try {
        const isFetched = yield select(getIsSalesmanagerFetched)
        if (!isFetched) {
            let { response, error } = yield call(requestSalesmanagerAPI)
            if (response) yield put(fetchedSalesmanager(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestSalesmanagerAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + '/salesman/list', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadSalesmanagerExcel() {
    yield takeEvery('DOWNLOAD_SALESMANAGER_EXCEL', fetchSalesmanagerExcel)

}

function* fetchSalesmanagerExcel(action) {
    try {
        const { response, error } = yield call(fetchSalesmanagerExcelAPI, action.payload)

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

function fetchSalesmanagerExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.smType = 'Sales_Manager'
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


export default function* salesmanager() {
    yield all([
        createSalesmanager(),
        editSalesmanager(),
        deleteSalesmanager(),
        fetchSalesmanager(),
        downloadSalesmanagerExcel()
    ])
}