import * as type from './types'

export function createFinanceConsultant(props) {
    return {
        type: type.CREATE_FINANCE_CONSULTANT,
        payload: props,
        txn: 'initiated'
    };
}

export function savedFinanceConsultant(props, res) {
    return {
        type: type.SAVED_FINANCE_CONSULTANT,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editFinanceConsultant(props) {
    return {
        type: type.EDIT_FINANCE_CONSULTANT,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchFinanceConsultant() {
    return {
        type: type.FETCH_FINANCE_CONSULTANT,
    }
}

export function fetchedFinanceConsultant(props) {
    return {
        type: type.FETCHED_FINANCE_CONSULTANT,
        payload: props,
    }
}

export function deleteFinanceConsultant(props) {
    return {
        type: type.DELETE_FINANCE_CONSULTANT,
        payload: props
    }
}

export function deletedFinanceConsultant(msg) {
    return {
        type: type.DELETED_FINANCE_CONSULTANT,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_FINANCE_CONSULTANT,
        payload:props
    }
}

export function downloadFinanceConsultantExcel(props) {
    return {
        type: type.DOWNLOAD_FINANCE_CONSULTANT_EXCEL,
        payload: props
    }
}

