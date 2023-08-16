import * as type from './types'

export function createSegmap(props) {
    return {
        type: type.CREATE_SEGMAP,
        payload: props,
        txn: 'initiated'
    };
}

export function savedSegmap(props, res) {
    return {
        type: type.SAVED_SEGMAP,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editSegmap(props) {
    return {
        type: type.EDIT_SEGMAP,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchSegmap() {
    return {
        type: type.FETCH_SEGMAP
    };
}

export function fetchedSegmap(props) {
    return {
        type: type.FETCHED_SEGMAP,
        payload: props
    };
}


export function deleteSegmap(props) {
    return {
        type: type.DELETE_SEGMAP,
        payload: props,
    };
}

export function deletedSegmap(msg) {
    return {
        type: type.DELETED_SEGMAP,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_SEGMAP,
        payload: props
    };
}

export function downloadSegmapExcel(props) {
    return {
        type: type.DOWNLOAD_SEGMAP_EXCEL,
        payload: props
    }
}

export function addOthers(props) {
    return {
        type: type.ADD_OTHERS,
        payload: props,
    };
}

export function savedOthers(props, res) {
    return {
        type: type.SAVED_OTHERS,
        payload: props,
    };
}

export function fetchOthersList(props, res) {
    return {
        type: type.FETCH_OTHERS_LIST,
        payload: props,
    };
}

export function fetchedOthersList(props, res) {
    return {
        type: type.FETCHED_OTHERS_LIST,
        payload: props,
    };
}