import { call, takeEvery, put, all, select } from 'redux-saga/effects'
import { VEHICAL_URL } from '../../../store/path'
import { savedLeadSource, deletedLeadSource, fetchedLeadSource } from "./actions";
import { getIsLeadSourceFetched } from './selectors'
import { handlError, parseError } from "../../app/serverError";
import userACL from "../../../store/access";
import { merge } from "lodash";
import axios from "axios";



// region for create lead source

function* createLeadSource() {
    yield takeEvery('CREATE_LEAD_SOURCE', saveLeadSource);
}

function* saveLeadSource(action) {
    try {
        const { response, error } = yield call(saveLeadSourceAPI, action.payload)
        if (response) yield put(savedLeadSource(action.payload, response.data))
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

function saveLeadSourceAPI(data) {
    return axios.post(VEHICAL_URL + "/salesman/add", data)
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

// End region


function* editLeadSource() {
    yield takeEvery('EDIT_LEAD_SOURCE', saveEditedLeadSource)
}

function* saveEditedLeadSource(action) {
    try {
        const { response, error } = yield call(editLeadSourceAPI, action.payload)
        if (response) yield put(savedLeadSource(action.payload, response.data))
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

function editLeadSourceAPI(data) {
    let id = data.id;
    return axios.post(VEHICAL_URL + "/salesman/update/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#end region

// region for delete lead source

function* deleteLeadSource() {
    yield takeEvery('DELETE_LEAD_SOURCE', saveDeletedLeadSource)
}

function* saveDeletedLeadSource(action) {
    try {
        const { response, error } = yield call(deleteLeadSourceAPI, action.payload)
        if (response) yield put(deletedLeadSource({ id: action.payload.id, msg: response.data }));
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

function deleteLeadSourceAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/salesman/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch leadSource

function* fetchLeadSource() {
    yield takeEvery('FETCH_LEAD_SOURCE', requestLeadSource)
}

function* requestLeadSource(action) {
    try {
        const isLeadSourceFetched = yield select(getIsLeadSourceFetched)
        if (!isLeadSourceFetched) {
            let { response, error } = yield call(requestLeadSourceAPI);
            if (response) yield put(fetchedLeadSource(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestLeadSourceAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + "/salesman/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadLeadSrcExcel() {
    yield takeEvery('DOWNLOAD_LEAD_SOURCE_EXCEL', fetchLeadSourceExcel)

}

function* fetchLeadSourceExcel(action) {
    try {
        const { response, error } = yield call(fetchLeadSourceExcelAPI, action.payload)

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

function fetchLeadSourceExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.smType = 'Lead_Source'
    return axios.post(VEHICAL_URL + '/salesman/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("Saga Error:" + action.type);
    console.log(error);
    console.groupEnd();
}

export default function* leadsource() {
    yield all([
        createLeadSource(),
        editLeadSource(),
        fetchLeadSource(),
        deleteLeadSource(),
        downloadLeadSrcExcel()
    ])
}

