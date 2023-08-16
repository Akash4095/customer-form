import { call, takeEvery, all, put, select } from 'redux-saga/effects'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { getIsSaleTypeFetched } from './selectors'
import { deletedSaleType, fetchedSaleType, savedSaleType } from './actions'
import { handlError, parseError } from '../../app/serverError'
import userACL from '../../../store/access'
import { merge } from 'lodash'


//#region saga for Create SaleType

function* createSaleType() {
    yield takeEvery('CREATE_SALE_TYPE', saveSaleType)
}

function* saveSaleType(action) {
    try {
        const { response, error } = yield call(saveSaleTypeAPI, action.payload)
        if (response) yield put(savedSaleType(action.payload, response.data))
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

function saveSaleTypeAPI(data) {
    return axios.post(VEHICAL_URL + '/sale-type/add', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion


//#region saga for Edit SaleType

function* editSaleType() {
    yield takeEvery('EDIT_SALE_TYPE', saveEditedSaleType)
}

function* saveEditedSaleType(action) {
    try {
        const { response, error } = yield call(editedSaleTypeAPI, action.payload)
        if (response) yield put(savedSaleType(action.payload, response.data))
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

function editedSaleTypeAPI(data) {
    let sale_id = data.id
    return axios.post(VEHICAL_URL + '/sale-type/update/' + sale_id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

//#region saga for delete SaleType

function* deleteSaleType() {
    yield takeEvery('DELETE_SALE_TYPE', saveDeleteSaleType)
}

function* saveDeleteSaleType(action) {
    try {
        const { response, error } = yield call(deleteSaleTypeAPI, action.payload)
        if (response) yield put(deletedSaleType({ id: action.payload.id, msg: response.data }))
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

function deleteSaleTypeAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + '/sale-type/delete/' + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

function* fetchSaleType() {
    yield takeEvery('FETCH_SALE_TYPE', requestSaleType)
}

function* requestSaleType(action) {
    try{
        const isSaleTypeFetched = yield select(getIsSaleTypeFetched)
        if (!isSaleTypeFetched) {
            let { response, error } = yield call(requestSaleTypeAPI)
            if (response) yield put(fetchedSaleType(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }
}

function requestSaleTypeAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + '/sale-type/list', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

// region for excel download 

function* downloadSaleTypeExcel() {
    yield takeEvery('DOWNLOAD_SALE_TYPE_EXCEL', fetchSaleTypeExcel)

}

function* fetchSaleTypeExcel(action) {
    try{
        const { response, error } = yield call(fetchSaleTypeExcelAPI, action.payload)

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

function fetchSaleTypeExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    return axios.post(VEHICAL_URL + '/sale-type/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("saga Error:" + action.type)
    console.log(error)
    console.groupEnd()
}

export default function* saleTypeSaga() {
    yield all([
        createSaleType(),
        deleteSaleType(),
        fetchSaleType(),
        editSaleType(),
        downloadSaleTypeExcel()
    ])
}