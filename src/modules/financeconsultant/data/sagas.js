import { call, takeEvery, all, put, select } from "redux-saga/effects";
import { getIsFinanceConsultantFetched } from "./selectors";
import { deletedFinanceConsultant, fetchedFinanceConsultant, savedFinanceConsultant } from "./actions";
import axios from "axios";
import { handlError, parseError } from "../../app/serverError";
import { VEHICAL_URL } from "../../../store/path";
import userACL from "../../../store/access";
import { merge } from "lodash";


//#region for create finance consultant

function* createFinanceConsultant() {
    yield takeEvery("CREATE_FINANCE_CONSULTANT", saveFinanceConsultant)
}

function* saveFinanceConsultant(action) {
    try {
        const { response, error } = yield call(saveFinanceConsultantAPI, action.payload)
        if (response) yield put(savedFinanceConsultant(action.payload, response.data));
        else {
            yield put(handlError(action, parseError(error)));
            sagaErrorMessage(error, action)
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)));
        sagaErrorMessage(error, action)
    }

}


function saveFinanceConsultantAPI(data) {
    return axios.post(VEHICAL_URL + "/salesman/add", data)
        .then(response => ({ response }))
        .catch(error => ({ error }));
}

//#end region

//# region saga for Edit financeconsultant

function* editFinanceConsultant() {
    yield takeEvery("EDIT_FINANCE_CONSULTANT", saveEditedFinanceConsultant)
}

function* saveEditedFinanceConsultant(action) {
    try {
        const { response, error } = yield call(editFinanceConsultantAPI, action.payload)
        if (response) yield put(savedFinanceConsultant(action.payload, response.data))
        else {
            yield put(handlError(action, parseError(error)));
            sagaErrorMessage(error.action);
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)));
        sagaErrorMessage(error, action)
    }


}

function editFinanceConsultantAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/salesman/update/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))

}

//#end region

//# region delete finance consultant

function* deleteFinanceConsultant() {
    yield takeEvery('DELETE_FINANCE_CONSULTANT', saveDeletedFinanceConsultant)
}

function* saveDeletedFinanceConsultant(action) {
    try {
        const { response, error } = yield call(deleteFinanceConsultantAPI, action.payload)
        if (response) yield put(deletedFinanceConsultant({ id: action.payload.id, msg: response.data }));
        else {
            yield put(handlError(action, parseError(error)));
            sagaErrorMessage(error, action)
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)));
        sagaErrorMessage(error, action)
    }

}

function deleteFinanceConsultantAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/salesman/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch finance consultant

function* fetchFinanceConsultant() {
    yield takeEvery('FETCH_FINANCE_CONSULTANT', requestFinanceConsultant)
}

function* requestFinanceConsultant(action) {
    try {
        const isFinanceConsultantFetched = yield select(getIsFinanceConsultantFetched)
        if (!isFinanceConsultantFetched) {
            let { response, error } = yield call(requestFinanceConsultantAPI);
            if (response) yield put(fetchedFinanceConsultant(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)));
        sagaErrorMessage(error, action)
    }

}

function requestFinanceConsultantAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + "/salesman/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadFinanceConsultantExcel() {
    yield takeEvery('DOWNLOAD_FINANCE_CONSULTANT_EXCEL', fetchFinConsultantExcel)

}

function* fetchFinConsultantExcel(action) {

    try {
        const { response, error } = yield call(fetchFinConsultantExcelAPI, action.payload)
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
        yield put(handlError(action, parseError(error)));
        sagaErrorMessage(error, action)
    }

}

function fetchFinConsultantExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.smType = "Finance_Consultant"
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


export default function* financeConsultant() {
    yield all([
        createFinanceConsultant(),
        editFinanceConsultant(),
        fetchFinanceConsultant(),
        deleteFinanceConsultant(),
        downloadFinanceConsultantExcel()
    ])
}
