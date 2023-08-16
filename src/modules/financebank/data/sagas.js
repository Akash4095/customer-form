import { call, takeEvery, put, all, select } from 'redux-saga/effects'
import { VEHICAL_URL } from '../../../store/path'
import { deletedFinanceBank, fetchedFinanceBank, savedFinanceBank } from "./actions";
import { getIsFinanceBankFetched } from './selectors'
import { handlError, parseError } from "../../app/serverError";
import userACL from "../../../store/access";
import { merge } from "lodash";
import axios from "axios";



// region for create finance bank

function* createFinanceBank() {
    yield takeEvery('CREATE_FINANCE_BANK', saveFinanceBank);
}

function* saveFinanceBank(action) {
    try {
        const { response, error } = yield call(saveFinanceBankAPI, action.payload)
        if (response) yield put(savedFinanceBank(action.payload, response.data))
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

function saveFinanceBankAPI(data) {
    return axios.post(VEHICAL_URL + "/financeBank/add", data)
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

// End region

function* editFinanceBank() {
    yield takeEvery('EDIT_FINANCE_BANK', saveEditedFinanceBank)
}

function* saveEditedFinanceBank(action) {
    try {
        const { response, error } = yield call(editFinanceBankAPI, action.payload)
        if (response) yield put(savedFinanceBank(action.payload, response.data))
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

function editFinanceBankAPI(data) {
    let id = data.id;
    return axios.post(VEHICAL_URL + "/financeBank/update/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#end region

// region for delete financebank

function* deleteFinanceBank() {
    yield takeEvery('DELETE_FINANCE_BANK', saveDeletedFinanceBank)
}

function* saveDeletedFinanceBank(action) {
    try {
        const { response, error } = yield call(deleteFinanceBankAPI, action.payload)

        if (response) yield put(deletedFinanceBank({ id: action.payload.id, msg: response.data }));
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

function deleteFinanceBankAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/financeBank/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch finance bank

function* fetchFinanceBank() {
    yield takeEvery('FETCH_FINANCE_BANK', requestFinanceBank)
}

function* requestFinanceBank(action) {
    try {
        let { response, error } = yield call(requestFinanceBankAPI);
        if (response) yield put(fetchedFinanceBank(response.data))
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestFinanceBankAPI(data) {
    data = merge({}, data, userACL.atFetch())
    data.segid = data.cid
    return axios.post(VEHICAL_URL + "/financeBank/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadFinanceBankExcel() {
    yield takeEvery('DOWNLOAD_FINANCE_BANK_EXCEL', fetchFinBankExcel)

}

function* fetchFinBankExcel(action) {
    try {
        const { response, error } = yield call(fetchFinBankExcelAPI, action.payload)

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

function fetchFinBankExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    return axios.post(VEHICAL_URL + '/financeBank/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

const sagaErrorMessage = (error, action) => {
    console.group("Saga Error:" + action.type);
    console.log(error);
    console.groupEnd();
}

export default function* financebank() {
    yield all([
        createFinanceBank(),
        editFinanceBank(),
        fetchFinanceBank(),
        deleteFinanceBank(),
        downloadFinanceBankExcel()
    ])
}

