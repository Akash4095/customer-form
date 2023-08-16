import * as type from './types'

export function createSaleType(props) {
    return {
        type: type.CREATE_SALE_TYPE,
        payload: props,
        txn: 'initiated'
    };
}

export function savedSaleType(props, res) {
    return {
        type: type.SAVED_SALE_TYPE,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editSaleType(props) {
    return {
        type: type.EDIT_SALE_TYPE,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchSaleType() {
    return {
        type: type.FETCH_SALE_TYPE
    };
}

export function fetchedSaleType(props) {
    return {
        type: type.FETCHED_SALE_TYPE,
        payload: props
    };
}


export function deleteSaleType(props) {
    return {
        type: type.DELETE_SALE_TYPE,
        payload: props
    };
}

export function deletedSaleType(msg) {
    return {
        type: type.DELETED_SALE_TYPE,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_SALE_TYPE,
        payload: props
    };
}

export function downloadSaleTypeExcel(props) {
    return {
        type: type.DOWNLOAD_SALE_TYPE_EXCEL,
        payload: props
    }
}