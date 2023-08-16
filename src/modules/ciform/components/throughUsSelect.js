import { Field } from 'formik'
import React from 'react'
import { FormikSelectComponent } from '../../../utilities/formUtils'

const ThroughUsSelect = ({name, isTxn, isLabel, label,setOnCall, isSelection, focus, placeholder, width, validation, isMandatory,  passFunct, getValue : callback }, props) => {


    const getSelectedValue = (value, setFieldValue, values) => {
       setOnCall(value, setFieldValue, values)
    }

    const opt =[
        {
            key:'INHOUSE',
            value:'INH',
            text:'IN HOUSE'
        },
        {
            key:'SELF',
            value:'SEL',
            text:'SELF'
        },
        {
            key:'CASH',
            value:'CAS',
            text:'CASH'
        }
      
    ]
    return (
        <>
            <Field name={name} isLabel={isLabel} label={label} isTxn={isTxn} isSelection={isSelection} component={FormikSelectComponent} isMandatory={isMandatory} userProps={{ options: opt, getValue: getSelectedValue, placeholder }} placeholder={placeholder} focus={focus} width={width} />
        </>
    )
}

export default ThroughUsSelect