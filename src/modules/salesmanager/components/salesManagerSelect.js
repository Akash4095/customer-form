import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { fetchSalesmanager } from '../data/actions'
import * as select from '../data/selectors'
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import { merge } from 'lodash';
import userACL from '../../../store/access';


const SalesManagerSelect = ({ name, isTxn, isLabel, label, isSelection, focus, placeholder, validation, computeValue, index, fieldName, fromField, otherList, passFunct, classNameGet, getValue: callback }, props) => {


    const salesManagerFetched = useSelector(state => select.getIsSalesmanagerFetched(state, props))
    const options = useSelector(state => select.selectSalesManager(state, props))
    const dispatch = useDispatch()

    const data = merge({}, userACL.atFetch())
    useEffect(() => {
        if (!salesManagerFetched && data.cid !== 0)
            dispatch(fetchSalesmanager());
    }, []);


    const getValue = (values) => {
        if (passFunct) {
            passFunct(values)
        }
    }


    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} classNameGet={classNameGet} validation={validation} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options, getValue }} focus={focus} placeholder={placeholder}> </Field>
    )


}


export default SalesManagerSelect;
