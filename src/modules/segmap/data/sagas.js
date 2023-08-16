import { call, takeEvery, put, all, select } from "redux-saga/effects";
import { VEHICAL_URL } from "../../../store/path";
import { deletedSegmap, fetchedOthersList, fetchedSegmap, savedOthers, savedSegmap } from "../data/actions"
import { getIsSegmapFetched } from "../data/selectors"
import { handlError, parseError } from "../../app/serverError";
import userACL from "../../../store/access";
import { merge } from "lodash";
import axios from "axios";


// region for create segmap

function* createSegmap() {
    yield takeEvery("CREATE_SEGMAP", saveSegmap)
}

function* saveSegmap(action) {
    try {
        const { response, error } = yield call(saveSegmapAPI, action.payload)
        if (response) yield put(savedSegmap(action.payload, response.data))
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

function saveSegmapAPI(data) {
    return axios.post(VEHICAL_URL + "/seg-map/add", data, { crossDomain: true })
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

// end region


// region for edit segmap

function* editSegmap() {
    yield takeEvery("EDIT_SEGMAP", saveEditedSegmap)
}

function* saveEditedSegmap(action) {
    try {
        const { response, error } = yield call(editSegmapAPI, action.payload)
        if (response) yield put(savedSegmap(action.payload, response.data))
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

function editSegmapAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/seg-map/update/" + id, data, { crossDomain: true })
        .then((response) => ({ response }))
        .catch((error) => ({ error }))
}

//#end region

// region for delete segmap

function* deleteSegmap() {
    yield takeEvery('DELETE_SEGMAP', saveDeletedSegmap)
}

function* saveDeletedSegmap(action) {
    try {
        const { response, error } = yield call(deleteSegmapAPI, action.payload)
        if (response) yield put(deletedSegmap({ id: action.payload.id, msg: response.data }));
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

function deleteSegmapAPI(data) {
    let id = data.id
    return axios.post(VEHICAL_URL + "/seg-map/delete/" + id, data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region


// region for segmap bank

function* fetchSegmap() {
    yield takeEvery('FETCH_SEGMAP', requestSegmap)
}

function* requestSegmap() {
    try {
        const isSegmapFetched = yield select(getIsSegmapFetched)
        if (!isSegmapFetched) {
            let { response, error } = yield call(requestSegmapAPI);
            if (response) yield put(fetchedSegmap(response.data))
        }
    }
    catch (error) {
        yield put(handlError(parseError(error)))
        sagaErrorMessage(error)
    }
}

function requestSegmapAPI(data) {
    data = merge({}, data, userACL.atFetch())
    // for listing view make cid segid ==
    // let obj={}
    // obj.cid=data.cid
    // obj.segid=data.cid
    return axios.post(VEHICAL_URL + "/seg-map/list", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

// region for excel download 

function* downloadSegmapExcel() {
    yield takeEvery('DOWNLOAD_SEGMAP_EXCEL', fetchSegmapExcel)

}

function* fetchSegmapExcel(action) {
    try {
        const { response, error } = yield call(fetchSegmapExcelAPI, action.payload)

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
        yield put(handlError(parseError(error)))
        sagaErrorMessage(error)
    }

}

function fetchSegmapExcelAPI(data) {
    data = merge({}, data, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    return axios.post(VEHICAL_URL + '/seg-map/download-ciexcel', obj, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

//end region

// region for create others

function* createOthers() {
    yield takeEvery("ADD_OTHERS", addOthers)
}

function* addOthers(action) {
    const { response, error } = yield call(addOthersAPI, action.payload)
    if (response) yield put(savedOthers(response.data))
    else {
        yield put(handlError(action, parseError(error)))
        sagaErrorMessage(error, action)
    }

}

async function addOthersAPI(data) {
    try {
        const response = await axios.post(VEHICAL_URL + "/seg-map/otrsadd", data, { crossDomain: true });
        return ({ response });
    } catch (error) {
        return ({ error });
    }
}

// end region

// region for segmap bank

function* fetchOthers() {
    yield takeEvery('FETCH_OTHERS_LIST', requestOthers)
}

function* requestOthers() {

    let { response, error } = yield call(requestOthersAPI);
    if (response) {
        yield put(fetchedOthersList(response.data.data))
    } else {
        yield put(handlError(parseError(error)))
        sagaErrorMessage(error)
    }

}

function requestOthersAPI(data) {
    data = merge({}, data, userACL.atFetch())
    return axios.post(VEHICAL_URL + "/seg-map/otrslist", data, { crossDomain: true })
        .then(response => ({ response }))
        .catch(error => ({ error }))
}

// end region

const sagaErrorMessage = (error, action) => {
    console.group("Saga Error:" + action.type);
    console.log(error);
    console.groupEnd();
}

export default function* () {
    yield all([
        createSegmap(),
        editSegmap(),
        fetchSegmap(),
        deleteSegmap(),
        downloadSegmapExcel(),
        createOthers(),
        fetchOthers(),
    ])
}