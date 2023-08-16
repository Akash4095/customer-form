import * as type from './types'

export function createVtNum(props) {
    return {
        type: type.CREATE_VTNUM,
        payload: props,
        txn: 'initiated'
    };
}

export function savedVtNum(props, res) {
    return {
        type: type.SAVED_VTNUM,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editVtNum(props) {
    return {
        type: type.EDIT_VTNUM,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchVtNum() {
    return {
        type: type.FETCH_VTNUM,
    }
}

export function fetchedVtNum(props) {
    return {
        type: type.FETCHED_VTNUM,
        payload: props,
    }
}

export function deleteVtNum(props) {
    return {
        type: type.DELETE_VTNUM,
        payload: props
    }
}

export function deletedVtNum(msg) {
    return {
        type: type.DELETED_VTNUM,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_VTNUM,
        payload:props
    }
}
export function downloadVtNumExcel(props) {
    return {
        type: type.DOWNLOAD_VTNUM_EXCEL,
        payload: props
    }
}