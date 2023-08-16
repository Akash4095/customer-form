import * as type from './types'

export function createMtax(props) {
    return {
        type: type.CREATE_MTAX,
        payload: props,
        txn: 'initiated'
    };
}

export function savedMtax(props, res) {
    return {
        type: type.SAVED_MTAX,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editMtax(props) {
    return {
        type: type.EDIT_MTAX,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchMtax() {
    return {
        type: type.FETCH_MTAX
    };
}

export function fetchedMtax(props) {
    return {
        type: type.FETCHED_MTAX,
        payload: props
    };
}


export function deleteMtax(props) {
    return {
        type: type.DELETE_MTAX,
        payload: props,
    };
}

export function deletedMtax(msg) {
    return {
        type: type.DELETED_MTAX,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_MTAX,
        payload: props
    };
}

export function downloadMtaxExcel(props) {
    return {
        type: type.DOWNLOAD_MTAX_EXCEL,
        payload: props
    }
}