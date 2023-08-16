import { call, takeEvery, all, put, select } from 'redux-saga/effects'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { getIsFormTypeFetched } from './selectors'
import { deletedFormType, fetchedFormType, savedFormType } from './actions'
import { handlError, parseError } from '../../app/serverError'
import userACL from '../../../store/access'
import { merge } from 'lodash'


//#region saga for Create SaleType

function* createFormType() {
    yield takeEvery('CREATE_FORM_TYPE', saveFormType)
}

function* saveFormType(action) {
    try {
        const { response, error } = yield call(saveFormTypeAPI, action.payload)
        if (response) yield put(savedFormType(action.payload, response.data))
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

function saveFormTypeAPI(data) {
    return axios.post(VEHICAL_URL + '/form-type/add', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion


//#region saga for Edit FormType

function* editFormType() {
    yield takeEvery('EDIT_FORM_TYPE', saveEditedFormType)
}

function* saveEditedFormType(action) {
    try {
        const { response, error } = yield call(editedFormTypeAPI, action.payload)
        if (response) yield put(savedFormType(action.payload, response.data))
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

function editedFormTypeAPI(data) {
    let form_id = data.id
    return axios.post(VEHICAL_URL + '/form-type/update/' + form_id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

//#region saga for delete FormType

function* deleteFormType() {
    yield takeEvery('DELETE_FORM_TYPE', saveDeleteFormType)
}

function* saveDeleteFormType(action) {
    try {
        const { response, error } = yield call(deleteFormTypeAPI, action.payload)
        if (response) yield put(deletedFormType({ id: action.payload.id, msg: response.data }))
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

function deleteFormTypeAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/form-type/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

function* fetchFormType() {
    yield takeEvery('FETCH_FORM_TYPE', requestFormType)
}

function* requestFormType(action) {
    try {
        const isFormTypeFetched = yield select(getIsFormTypeFetched)
        if (!isFormTypeFetched) {
            let { response, error } = yield call(requestFormTypeAPI)
            if (response) yield put(fetchedFormType(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestFormTypeAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + '/form-type/list', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#endregion

// region for excel download 

function* downloadFormTypeExcel() {
    yield takeEvery('DOWNLOAD_FORM_TYPE_EXCEL', fetchFormTypeExcel)

}

function* fetchFormTypeExcel(action) {
    try {
        const { response, error } = yield call(fetchFormTypeExcelAPI, action.payload)

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

function fetchFormTypeExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    return axios.post(VEHICAL_URL + '/form-type/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("saga Error:" + action.type)
    console.log(error)
    console.groupEnd()
}

export default function* formtype() {
    yield all([
        createFormType(),
        deleteFormType(),
        fetchFormType(),
        editFormType(),
        downloadFormTypeExcel()
    ])
}