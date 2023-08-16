import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { fetchSalesConsultant } from '../data/actions'
import * as select from '../data/selectors'
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import { merge } from 'lodash';
import userACL from '../../../store/access';


const SalesConsultantSelect = ({ name, isTxn, isLabel, label, isSelection, focus, setData, placeholder, validation, computeValue, index, fieldName, fromField, otherList, passFunct, classNameGet, getValue: callback }, props) => {


    const salesconsultantFetched = useSelector(state => select.getIsSalesConsultantFetched(state, props))
    const options = useSelector(state => select.selectSalesConsultant(state, props))
    const dispatch = useDispatch()

    const data = merge({}, userACL.atFetch())
    useEffect(() => {
        if (!salesconsultantFetched && data.cid !== 0)
            dispatch(fetchSalesConsultant());
    }, []);


    const getValue = (value, setFieldValue, values) => {
        setData(value, setFieldValue, values)
        if (passFunct) {
            passFunct(value)
        }
    }


    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} classNameGet={classNameGet} validation={validation} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options, getValue }} focus={focus} placeholder={placeholder}> </Field>
    )

}


export default SalesConsultantSelect;
