import * as type from './types'

export function createFinanceBank(props) {
    return {
        type: type.CREATE_FINANCE_BANK,
        payload: props,
        txn: 'initiated'
    };
}

export function savedFinanceBank(props, res) {
    return {
        type: type.SAVED_FINANCE_BANK,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editFinanceBank(props) {
    return {
        type: type.EDIT_FINANCE_BANK,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchFinanceBank() {
    return {
        type: type.FETCH_FINANCE_BANK,
    }
}

export function fetchedFinanceBank(props) {
    return {
        type: type.FETCHED_FINANCE_BANK,
        payload: props,
    }
}

export function deleteFinanceBank(props) {
    return {
        type: type.DELETE_FINANCE_BANK,
        payload: props
    }
}

export function deletedFinanceBank(msg) {
    return {
        type: type.DELETED_FINANCE_BANK,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_FINANCE_BANK,
        payload:props
    }
}

export function downloadFinanceBankExcel(props) {
    return {
        type: type.DOWNLOAD_FINANCE_BANK_EXCEL,
        payload: props
    }
}