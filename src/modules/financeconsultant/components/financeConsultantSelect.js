import React, { useEffect } from 'react'
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import * as select from '../data/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinanceBank, fetchFinanceConsultant } from '../data/actions'
import { merge } from 'lodash'
import userACL from '../../../store/access'

const FinanceConsultantSelect = ({ name, isTxn, label, isLabel, setOnCall, focus, placeholder, validation, computeValue, index, fieldName, fromField, otherList, isSelection, passFunct, classNameGet, getValue: callback }, props) => {

    const financeConsultantObj = useSelector(state => state.financeConsultant.byId)
    const finConsultantFetched = useSelector(state => select.getIsFinanceConsultantFetched(state, props))
    const options = useSelector(state => select.selectFinanceConsultant(state, props))
    const dispatch = useDispatch()

    const data = merge({}, userACL.atFetch())
    useEffect(() => {
        if (!finConsultantFetched && data.cid !== 0)
            dispatch(fetchFinanceConsultant())
    }, [])

    const getValue = (values) => {
        if (passFunct) {
            passFunct(values)
        }
    }
    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} classNameGet={classNameGet} validation={validation} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options, getValue }} focus={focus} placeholder={placeholder} />
    )
}

export default FinanceConsultantSelect;