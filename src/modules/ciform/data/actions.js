import * as type from './types'

export function createCiForm(props, ftObj) {
    return {
        type: type.CREATE_CIFORM,
        payload: props,
        payload1: ftObj,
        txn: 'initiated'
    };
}

export function savedCiForm(props, res) {
    return {
        type: type.SAVED_CIFORM,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editCiForm(props) {
    return {
        type: type.EDIT_CIFORM,
        payload: props,
        txn: 'initiated'
    };
}

export function editedCiForm(props) {
    return {
        type: type.EDITED_CIFORM,
        payload: props,
        txn: 'success'
    };
}

export function fetchCiForm(props, setCiFetch) {
    return {
        type: type.FETCH_CIFORM,
        payload: props,
        setCiFetch: setCiFetch
    };
}

export function fetchedCiForm(props) {
    return {
        type: type.FETCHED_CIFORM,
        payload: props
    };
}

export function saveFetchedCiFormDate(props) {
    return {
        type: type.SAVE_FETCHED_CIFORM_DATE,
        payload: props
    };
}

export function deleteCiForm(props) {
    return {
        type: type.DELETE_CIFORM,
        payload: props
    };
}

export function deletedCiForm(msg) {
    return {
        type: type.DELETED_CIFORM,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_CIFORM,
        payload: props
    };
}

export function searchVin(props) {
    return {
        type: type.SEARCH_VIN,
        payload: props
    }
}

export function storeSearchedVin(props) {
    return {
        type: type.STORE_SEARCHED_VIN,
        payload: props
    }
}
export function searchSegList() {
    return {
        type: type.SEARCH_SEG_LIST,
    }
}

export function storeSearchedSegList(props) {
    return {
        type: type.STORE_SEARCHED_SEG_LIST,
        payload: props
    }
}
export function fetchPriceList(props) {
    return {
        type: type.FETCH_PRICE_LIST,
        payload: props
    }
}

export function storePriceList(props) {
    return {
        type: type.STORE_PRICE_LIST,
        payload: props
    }
}
export function getSegmap(props) {
    return {
        type: type.GET_CIFORM_SEGMAP,
        payload: props
    }
}

export function storeSegmap(props) {
    return {
        type: type.STORE_CIFORM_SEGMAP,
        payload: props
    }
}

export function rlbSyncCiform(props) {
    return {
        type: type.RLB_SYNC_CIFORM,
        payload: props
    }
}

export function fetchedRlbSyncCiform(props) {
    return {
        type: type.FETCHED_RLB_SYNC_CIFORM,
        payload: props
    }
}

export function fetchedRlbDiscSyncCiform(props) {
    return {
        type: type.FETCHED_RLB_DISC_SYNC_CIFORM,
        payload: props
    }
}
export function rlbDiscSyncCiform(props) {
    return {
        type: type.RLB_DISC_SYNC_CIFORM,
        payload: props
    }
}

export function downloadCiformExcel(props) {
    return {
        type: type.DOWNLOAD_CIFORM_EXCEL,
        payload: props
    }
}

export function removeIsSavedCIForm() {
    return {
        type: type.REMOVE_IS_SAVED_CIFORM
    }
}

export function searchUsedCarItem(props) {
    return {
        type: type.SEARCH_USED_CAR_ITEM,
        payload: props
    }
}

export function storeSearchedUsedCarItem(props) {
    return {
        type: type.STORE_SEARCHED_USED_CAR_ITEM,
        payload: props
    }
}

export function searchAccesoriesItem(props, index) {
    return {
        type: type.SEARCH_ACCESORIES_ITEM,
        payload: props,
        payload1: index,
    }
}

export function storeSearchedAccesoriesItem(props, index) {
    return {
        type: type.STORE_SEARCHED_ACCESSORIES_ITEM,
        payload: props,
        payload1: index,
    }
}

export function searchVariant(props) {
    return {
        type: type.SEARCH_VARIANT,
        payload: props
    }
}

export function storeSearchedVariant(props) {
    return {
        type: type.STORE_SEARCHED_VARIANT,
        payload: props
    }
}

export function searchItemBatch(props) {
    return {
        type: type.SEARCH_ITEM_BATCH,
        payload: props
    }
}

export function storeSearchedItemBatch(props) {
    return {
        type: type.STORE_SEARCHED_ITEM_BATCH,
        payload: props
    }
}


export function clearSearchedItemBatch() {
    return {
        type: type.CLEAR_SEARCHED_ITEM_BATCH,
    }
}