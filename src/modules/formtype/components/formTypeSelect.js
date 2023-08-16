import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { fetchFormType } from '../data/actions'
import * as select from '../data/selectors'
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import { merge } from 'lodash';
import userACL from '../../../store/access';


const FormTypeSelect = ({ name, isTxn, isLabel, label, isSelection, focus, placeholder, setData, validation, computeValue, index, fieldName, fromField, otherList, passFunct, classNameGet, getValue: callback }, props) => {


    const formTypeFetched = useSelector(state => select.getIsFormTypeFetched(state, props))
    const options = useSelector(state => select.selectFormType(state, props))
    const dispatch = useDispatch()

    const data = merge({}, userACL.atFetch())
    useEffect(() => {
        if (!formTypeFetched && data.cid !== 0)
            dispatch(fetchFormType());
    }, []);


    const getValue = (value, setFieldValue, indGet) => {
        setData(value, setFieldValue, indGet)

    }

    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} setData={setData} classNameGet={classNameGet} validation={validation} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options, getValue }} focus={focus} placeholder={placeholder}> </Field>
    )
}


export default FormTypeSelect;
