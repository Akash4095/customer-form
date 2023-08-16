import React, { useEffect } from 'react'
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import * as select from '../data/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLeadSource } from '../data/actions'
import userACL from '../../../store/access'
import { merge } from 'lodash'

const LeadSourceSelect = ({ name, isTxn, label, isLabel, setOnCall, focus, placeholder, validation, computeValue, index, fieldName, fromField, otherList, isSelection, passFunct, classNameGet, getValue: callback }, props) => {

    const leadSourceObj = useSelector(state => state.leadsource.byId)
    const leadSourceFetched = useSelector(state => select.getIsLeadSourceFetched(state, props))
    const options = useSelector(state => select.selectLeadSource(state, props))
    const dispatch = useDispatch()

    const data = merge({}, userACL.atFetch())
    useEffect(() => {
        if (!leadSourceFetched && data.cid !== 0)
            dispatch(fetchLeadSource())
    }, [])

    const getValue = (values) => {
        setOnCall(leadSourceObj[values] ? leadSourceObj[values].emp_name : "")
        if (passFunct) {
            passFunct(values)
        }
    }
    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} classNameGet={classNameGet} validation={validation} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options, getValue }} focus={focus} placeholder={placeholder} />
    )
}

export default LeadSourceSelect;