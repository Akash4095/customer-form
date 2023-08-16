import * as type from './types'

export function createSalesConsultant(props) {
    return {
        type: type.CREATE_SALES_CONSULTANT,
        payload: props,
        txn: 'initiated'
    };

}

export function savedSalesConsultant(props, res) {

    return {
        type: type.SAVED_SALES_CONSULTANT,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editSalesConsultant(props) {
    return {
        type: type.EDIT_SALES_CONSULTANT,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchSalesConsultant() {
    return {
        type: type.FETCH_SALES_CONSULTANT,
        // payload: data
    };
}

export function fetchedSalesConsultant(props) {
    return {
        type: type.FETCHED_SALES_CONSULTANT,
        payload: props,
    };
}

export function requestOptionsSalesConsultant(props) {
    return {
        type: type.OPTIONS_REQUESTED_SALES_CONSULTANT,
        payload: props,
    };
}

export function receivedOptionsSalesConsultant(props) {
    return {
        type: type.OPTIONS_RECEIVED_SALES_CONSULTANT,
        payload: props
    };
}

export function deleteSalesConsultant(props) {
    return {
        type: type.DELETE_SALES_CONSULTANT,
        payload: props
    };
}

export function deletedSalesConsultant(msg) {
    return {
        type: type.DELETED_SALES_CONSULTANT,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_SALES_CONSULTANT,
        payload: props
    };
}

export function downloadSalesConsultantExcel(props) {
    return {
        type: type.DOWNLOAD_SALES_CONSULTANT_EXCEL,
        payload: props
    }
}