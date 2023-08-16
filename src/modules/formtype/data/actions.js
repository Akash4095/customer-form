import * as type from './types'

export function createFormType(props) {
    return {
        type: type.CREATE_FORM_TYPE,
        payload: props,
        txn: 'initiated'
    };
}

export function savedFormType(props, res) {
    return {
        type: type.SAVED_FORM_TYPE,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editFormType(props) {
    return {
        type: type.EDIT_FORM_TYPE,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchFormType() {
    return {
        type: type.FETCH_FORM_TYPE
    };
}

export function fetchedFormType(props) {
    return {
        type: type.FETCHED_FORM_TYPE,
        payload: props
    };
}


export function deleteFormType(props) {
    return {
        type: type.DELETE_FORM_TYPE,
        payload: props,
    };
}

export function deletedFormType(msg) {
    return {
        type: type.DELETED_FORM_TYPE,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_FORM_TYPE,
        payload: props
    };
}

export function downloadFormtypeExcel(props) {
    return {
        type: type.DOWNLOAD_FORM_TYPE_EXCEL,
        payload: props
    }
}