import { call, takeEvery, put, all, select } from 'redux-saga/effects'
import { VEHICAL_URL } from '../../../store/path'
import { deletedCustomer, fetchedCustomer, savedCustomer, storeSearchedCustomer, fetchedXmlCountry, fetchedXmlState } from "./actions";
import { getIsCustomerFetched } from './selectors'
import { handlError, parseError } from "../../app/serverError";
import userACL from "../../../store/access";
import { merge } from "lodash";
import axios from "axios";
import countryXML from "../../app/country.xml"
import stateXML from "../../app/state.xml"
import XMLParser from 'react-xml-parser';




// region for create customer

function* createCustomer() {
    yield takeEvery("CREATE_CUSTOMER", saveCustomer)
}

function* saveCustomer(action) {
    try {
        const { response, error } = yield call(saveCustomerAPI, action.payload)
        if (response) yield put(savedCustomer(action.payload, response.data))
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

function saveCustomerAPI(data) {
    return axios.post(VEHICAL_URL + "/customer/add", data)
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

// End region


function* editCustomer() {
    yield takeEvery('EDIT_CUSTOMER', saveEditedCustomer)
}

function* saveEditedCustomer(action) {
    try {
        const { response, error } = yield call(editCustomerAPI, action.payload)
        if (response) yield put(savedCustomer(action.payload))
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

function editCustomerAPI(data) {
    let id = data.id;
    return axios.post(VEHICAL_URL + "/customer/update/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//#end region

// region for delete customer

function* deleteCustomer() {
    yield takeEvery('DELETE_CUSTOMER', saveDeletedCustomer)
}

function* saveDeletedCustomer(action) {
    try {
        const { response, error } = yield call(deleteCustomerAPI, action.payload)
        if (response) yield put(deletedCustomer({ id: action.payload.id, msg: response.data }));
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

function deleteCustomerAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/customer/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for fetch customer

function* fetchCustomer() {
    yield takeEvery('FETCH_CUSTOMER', requestCustomer)
}

function* requestCustomer(action) {
    try {
        const isCustomerFetched = yield select(getIsCustomerFetched)
        if (!isCustomerFetched) {
            let { response, error } = yield call(requestCustomerAPI);
            if (response) yield put(fetchedCustomer(response.data))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function requestCustomerAPI(data) {
    data = merge({}, data, userACL.atFetch())
    return axios.post(VEHICAL_URL + "/customer/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

function* searchCustomer() {
    yield takeEvery('SEARCH_CUSTOMER', initiateCustSearch)
}

function* initiateCustSearch(action) {
    try {
        let { response, error } = yield call(searchCustdetails, action.payload)
        if (response) {
            yield put(storeSearchedCustomer(response.data))
        } else {
            yield put(storeSearchedCustomer({}))
        }
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function searchCustdetails(data) {
    return axios.post(VEHICAL_URL + '/ciform/rlbCustomerSearch', data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region



function* fetchCountry() {
    yield takeEvery('FETCH_COUNTRY_XML', initiateFetchCountry)
}

function* initiateFetchCountry(action) {
    try {
        let { data } = yield call(searchFetchCountry, action.payload)
        var xml = new XMLParser().parseFromString(data),
            countries = xml.children,
            modifiedCountry = countries.map((contry) => {
                let obj = {}
                obj.countryId = contry.attributes.countryid
                obj.countryName = contry.attributes.value
                obj.countryText = contry.value
                obj.key = contry.attributes.value
                obj.value = contry.attributes.value
                obj.text = contry.attributes.value
                return obj
            });
        yield put(fetchedXmlCountry(modifiedCountry))
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

function searchFetchCountry(data) {
    return axios.get(countryXML, {
        "Content-Type": "application/xml; charset=utf-8"
    })

}

function* fetchState() {
    yield takeEvery('FETCH_STATE_XML', initiateFetchState)
}

function* initiateFetchState(action) {
    try {
        let { data } = yield call(searchFetchState, action.payload)
        var xml = new XMLParser().parseFromString(data),
            state = xml.children,
            modifiedState = state.map((stat) => {
                let obj = {}
                obj.stateId = stat.attributes.stateid
                obj.stateName = stat.attributes.value
                obj.stateText = stat.value
                obj.key = stat.attributes.value
                obj.value = stat.attributes.value
                obj.text = stat.attributes.value
                return obj
            });
        yield put(fetchedXmlState(modifiedState))
    }
    catch (error) {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }


}

function searchFetchState(data) {
    return axios.get(stateXML, {
        "Content-Type": "application/xml; charset=utf-8"
    })

}

// end region

const sagaErrorMessage = (error, action) => {
    console.group("Saga Error:" + action.type);
    console.log(error);
    console.groupEnd();
}

export default function* customer() {
    yield all([
        createCustomer(),
        editCustomer(),
        fetchCustomer(),
        deleteCustomer(),
        searchCustomer(),
        fetchCountry(),
        fetchState()
    ])
}
