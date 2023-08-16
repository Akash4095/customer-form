import * as type from './types'

export function createSalesmanager(props) {
    return {
        type: type.CREATE_SALESMANAGER,
        payload: props,
        txn: 'initiated'
    };
}

export function savedSalesmanager(res, props) {
    return {
        type: type.SAVED_SALESMANAGER,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editSalesmanager(props) {
    return {
        type: type.EDIT_SALESMANAGER,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchSalesmanager() {
    return {
        type: type.FETCH_SALESMANAGER,
    }
}

export function fetchedSalesmanager(props) {
    return {
        type: type.FETCHED_SALESMANAGER,
        payload: props,
    }
}

export function deleteSalesmanager(props) {
    return {
        type: type.DELETE_SALESMANAGER,
        payload: props
    }
}

export function deletedSalesmanager(msg) {
    return {
        type: type.DELETED_SALESMANAGER,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_SALESMANAGER,
        payload:props
    }
}

export function downloadSalesmanagerExcel(props) {
    return {
        type: type.DOWNLOAD_SALESMANAGER_EXCEL,
        payload: props
    }
}