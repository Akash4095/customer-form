import { call, takeEvery, put, all, select } from 'redux-saga/effects'
import { VEHICAL_URL } from '../../../store/path'
import { deletedVtNum, fetchedVtNum, savedVtNum } from "./actions";
import { getIsVtNumFetched } from './selectors'
import { handlError, parseError } from "../../app/serverError";
import userACL from "../../../store/access";
import { merge } from "lodash";
import axios from "axios";



// region for create vt-num

function* createVtNum() {
    yield takeEvery('CREATE_VTNUM', saveVtNum);
}

function* saveVtNum(action) {
    try {
        const { response, error } = yield call(saveVtNumAPI, action.payload)
        if (response) yield put(savedVtNum(action.payload, response.data))
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

function saveVtNumAPI(data) {
    return axios.post(VEHICAL_URL + "/vt-num/add", data)
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

// End region

function* editVtNum() {
    yield takeEvery('EDIT_VTNUM', saveEditedVtNum)
}

function* saveEditedVtNum(action) {
    try {
        const { response, error } = yield call(editVtNumAPI, action.payload)
        if (response) yield put(savedVtNum(action.payload, response.data))
        else {
            yield put(handlError(action, parseError(error)));
            sagaErrorMessage(error.action);
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }
}

function editVtNumAPI(data) {
    let id = data.id;
    return axios.post(VEHICAL_URL + "/vt-num/update/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#end region

// region for delete vt-num

function* deleteVtNum() {
    yield takeEvery('DELETE_VTNUM', saveDeletedVtNum)
}

function* saveDeletedVtNum(action) {
    try {
        const { response, error } = yield call(deleteVtNumAPI, action.payload)

        if (response) yield put(deletedVtNum({ id: action.payload.id, msg: response.data }));
        else {
            yield put(handlError(action, parseError(error)));
            sagaErrorMessage(error, action)
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }
}

function deleteVtNumAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/vt-num/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch vt-num

function* fetchVtNum() {
    yield takeEvery('FETCH_VTNUM', requestVtNum)
}

function* requestVtNum(action) {
    try {
        const isVtNumFetched = yield select(getIsVtNumFetched)
        if (!isVtNumFetched) {
            let { response, error } = yield call(requestVtNumAPI);
            if (response) yield put(fetchedVtNum(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestVtNumAPI(data) {
    data = merge({}, data, userACL.atFetch())
    return axios.post(VEHICAL_URL + "/vt-num/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadVtNumExcel() {
    yield takeEvery('DOWNLOAD_VTNUM_EXCEL', fetchVtNumExcel)

}

function* fetchVtNumExcel(action) {
    try {
        const { response, error } = yield call(fetchVtNumExcelAPI, action.payload)

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

function fetchVtNumExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    return axios.post(VEHICAL_URL + '/vt-num/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("Saga Error:" + action.type);
    console.log(error);
    console.groupEnd();
}

export default function* vtnum() {
    yield all([
        createVtNum(),
        editVtNum(),
        fetchVtNum(),
        deleteVtNum(),
        downloadVtNumExcel()
    ])
}

