import { call, takeEvery, all, put, select } from 'redux-saga/effects'
import { savedCiForm, fetchedCiForm, deletedCiForm, storeSearchedVin, storeSegmap, storePriceList, fetchedRlbSyncCiform, fetchedRlbDiscSyncCiform, storeSearchedSegList, storeSearchedPurchasePrice, saveFetchedCiFormDate, storeSearchedUsedCarItem, storeSearchedAccesoriesItem, storeSearchedVariant, storeSearchedItemBatch } from './actions'
import { editFormType } from '../../formtype/data/actions'
import axios from 'axios';
import { handlError, parseError } from '../../app/serverError'
import { getHeader, VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { merge, cloneDeep, values } from 'lodash'



//#region Saga for Create CIFORM 

function* createCiForm() {
  yield takeEvery('CREATE_CIFORM', saveCiForm)
}

function* saveCiForm(action) {

  try {
    const { response, error } = yield call(saveCiFormAPI, action.payload)
    if (response) {
      yield put(savedCiForm(action.payload, response.data))
      yield put(editFormType(action.payload1))
    } else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  } catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function saveCiFormAPI(data) {
  return axios.post(VEHICAL_URL + '/ciform/add', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion


//#region Saga for Edited CIFORM 

function* editCiForm() {
  yield takeEvery('EDIT_CIFORM', saveEditedCiForm)
}

function* saveEditedCiForm(action) {

  try {
    const { response, error } = yield call(editCiFormAPI, action.payload)
    let object = cloneDeep(action.payload);
    if (response) yield put(savedCiForm(action.payload, response.data))
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

function editCiFormAPI(data) {
  let user_id = data.id
  return axios.post(VEHICAL_URL + '/ciform/update/' + user_id, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion

//#region Saga for Delete CiFOrm

function* deleteCiForm() {
  yield takeEvery('DELETE_CIFORM', saveDeleteCiForm)
}

function* saveDeleteCiForm(action) {
  try {
    const { response, error } = yield call(deleteCiFormAPI, action.payload)
    if (response) yield put(deletedCiForm({ id: action.payload.id, msg: response.data }))
    else {
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  } catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }

}

function deleteCiFormAPI(data) {
  let Id = data.id
  return axios.post(VEHICAL_URL + '/ciform/delete/' + Id, data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion

//#region Saga for List Tasks 

function* fetchCiForm() {

  yield takeEvery('FETCH_CIFORM', requestCiForm)

}

function* requestCiForm(action) {
  try {
    let { response, error } = yield call(requestCiFormAPI, action.payload)
    if (response) yield put(fetchedCiForm(response.data))
    yield put(saveFetchedCiFormDate(action.payload))
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function requestCiFormAPI(data) {
  data = merge({}, data, userACL.atFetch())
  return axios.post(VEHICAL_URL + '/ciform/list', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}


//#endregion

//#region Saga for segmap

function* getSegmap() {

  yield takeEvery('GET_CIFORM_SEGMAP', requestSegmap)

}

function* requestSegmap(action) {

  try {
    let { response, error } = yield call(requestSegmapAPI, action.payload)
    // console.log(response, 'segmap--res')
    if (response) yield put(storeSegmap(response.data))
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }

}

function requestSegmapAPI(data) {
  return axios.post(VEHICAL_URL + '/ciform/get-segmap', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}


//#endregion


// region for search vin

function* searchVin() {
  yield takeEvery('SEARCH_VIN', initiateVinSearch)
}

function* initiateVinSearch(action) {
  try {
    let { response, error } = yield call(searchVindetails, action.payload)
    if (response) {
      yield put(storeSearchedVin(response.data))
    }
    else {
      yield put(storeSearchedVin({}))
      yield put(handlError(action, parseError(error)))
      sagaErrorMessage(error, action)
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }

}

function searchVindetails(data) {
  return axios.post(VEHICAL_URL + '/ciform/rlbBatchInfo', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

/// end region

// region for search segment list

function* searchSegList() {
  yield takeEvery('SEARCH_SEG_LIST', initiateSegListSearch)
}

function* initiateSegListSearch(action) {
  try {
    let { response, error } = yield call(searchSegListAPI)
    if (response) yield put(storeSearchedSegList(response.data))
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function searchSegListAPI() {
  let data = merge({}, userACL.atFetch())
  data.segid = data.cid
  return axios.post(VEHICAL_URL + '/ciform/get-seglist', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

/// end region

// region for pricelist fetch api


function* fetchPriceList() {
  yield takeEvery('FETCH_PRICE_LIST', requestFetchPriceList)
}

function* requestFetchPriceList(action) {
  try {
    let { response, error } = yield call(requestFetchListAPI, action.payload)
    if (response) yield put(storePriceList(response.data))
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function requestFetchListAPI(data) {
  let obj = merge({}, data, userACL.atFetch())
  obj.itemName = data
  return axios.post(VEHICAL_URL + '/ciform/rlbPriceList', obj, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//// end region


//#region Saga RLB sync ciform

function* rlbSyncCiform() {

  yield takeEvery('RLB_SYNC_CIFORM', requestRlbSyncCiform)

}

function* requestRlbSyncCiform(action) {
  try {
    const { response, error } = yield call(rlbSyncCiformAPI, action.payload)
    if (response) yield put(fetchedRlbSyncCiform(response.data))
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

function rlbSyncCiformAPI(data) {
  return axios.post(VEHICAL_URL + '/ciform/rlbSync', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

//#endregion

//#region Saga RLB Disc sync ciform

function* rlbDiscSyncCiform() {

  yield takeEvery('RLB_SYNC_CIFORM', requestRlbDiscSyncCiform)

}

function* requestRlbDiscSyncCiform(action) {
  try {
    const { response, error } = yield call(rlbDiscSyncCiformAPI, action.payload)
    if (response) yield put(fetchedRlbDiscSyncCiform(response.data))
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

function rlbDiscSyncCiformAPI(data) {
  return axios.post(VEHICAL_URL + '/ciform/rlbDiscSync', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

function* downloadCiformExcel() {
  yield takeEvery('DOWNLOAD_CIFORM_EXCEL', fetchCiformExcel)

}

function* fetchCiformExcel(action) {

  try {
    const { response, error } = yield call(fetchCiformExcelAPI, action.payload)

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

function fetchCiformExcelAPI(data) {
  let obj = merge({}, data, userACL.atFetch())
  data.segid = obj.segid
  data.cid = obj.cid
  return axios.post(VEHICAL_URL + '/ciform/download-ciexcel', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

// region for search vin

function* searchUsedCarItem() {
  yield takeEvery('SEARCH_USED_CAR_ITEM', initiateUsedCarItemSearch)
}

function* initiateUsedCarItemSearch(action) {
  try {
    let { response, error } = yield call(searchCarItemdetails, action.payload)
    if (response) {
      yield put(storeSearchedUsedCarItem(response.data))
    } else {
      yield put(storeSearchedUsedCarItem({}))
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function searchCarItemdetails(data) {
  return axios.post(VEHICAL_URL + '/ciform/rlbItemName', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

/// end region

// region for search vin

function* searchAccesoriesItem() {
  yield takeEvery('SEARCH_ACCESORIES_ITEM', initiateAccesoriesItemSearch)
}

function* initiateAccesoriesItemSearch(action) {
  try {
    let { response, error } = yield call(searchAccItemdetailsAPI, action.payload)
    if (response) {
      let res = response.data
      yield put(storeSearchedAccesoriesItem(res, action.payload1))
    } else {
      yield put(storeSearchedAccesoriesItem({}))
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

function searchAccItemdetailsAPI(data) {
  return axios.post(VEHICAL_URL + '/ciform/rlbItemName', data, { crossDomain: true })
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

/// end region


function* searchUsedVariant() {
  yield takeEvery('SEARCH_VARIANT', initiateVariantSearch)
}

function* initiateVariantSearch(action) {
  try {
    let { response, error } = yield call(searchVariantApi, action.payload)
    if (response) {
      yield put(storeSearchedVariant(response.data))
      // yield put(storeSearchedVin(response.data))
    } else {
      yield put(storeSearchedVariant({}))
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

async function searchVariantApi(data) {
  try {
    const response = await axios.post(VEHICAL_URL + '/ciform/rlbItemName', data, { crossDomain: true });
    return ({ response });
  } catch (error) {
    return ({ error });
  }
}

/// end region

function* searchItemBatch() {
  yield takeEvery('SEARCH_ITEM_BATCH', initiateItemBatchSearch)
}

function* initiateItemBatchSearch(action) {
  try {
    let { response, error } = yield call(searchItemBatchAPI, action.payload)
    if (response) {
      yield put(storeSearchedItemBatch(response.data))
      yield put(storeSearchedVin(response.data))
    } else {
      yield put(storeSearchedItemBatch({}))
      yield put(storeSearchedVin({}))
    }
  }
  catch (error) {
    yield put(handlError(action, parseError(error)))
    sagaErrorMessage(error, action)
  }
}

async function searchItemBatchAPI(data) {
  try {
    const response = await axios.post(VEHICAL_URL + '/ciform/ItemBatch', data, { crossDomain: true });
    return ({ response });
  } catch (error) {
    return ({ error });
  }
}

/// end region

//#endregion

const sagaErrorMessage = (error, action) => {
  console.group("Saga Error:" + action.type)
  console.log(error)
  console.groupEnd()
}

export default function* ciFormSaga() {
  yield all([
    createCiForm(),
    fetchCiForm(),
    editCiForm(),
    deleteCiForm(),
    searchVin(),
    getSegmap(),
    fetchPriceList(),
    rlbSyncCiform(),
    rlbDiscSyncCiform(),
    searchSegList(),
    downloadCiformExcel(),
    searchUsedCarItem(),
    searchAccesoriesItem(),
    searchUsedVariant(),
    searchItemBatch(),

  ])
}  