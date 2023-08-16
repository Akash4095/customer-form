import { Field } from "formik";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { FormikSelectComponent } from "../../../utilities/formUtils";
import { fetchXmlState } from "../data/actions";

const CountrySelect = (
  {
    name,
    isTxn,
    isLabel,
    label,
    setOnCall,
    isSelection,
    focus,
    placeholder,
    setFieldValueM,
    width,
    validation,
    isMandatory,
    passFunct,
    getValue: callback,
  },
  props
) => {
  const dispatch = useDispatch();
  const opt = useSelector((state) => select.selectCountry(state, props));

  const getSelectedValue = (value, setFieldValue, values) => {
    setOnCall(value, setFieldValue, values);
  };

  return (
    <>
      <Field
        name={name}
        isLabel={isLabel}
        label={label}
        isTxn={isTxn}
        isSelection={isSelection}
        setFieldValueM={setFieldValueM}
        component={FormikSelectComponent}
        isMandatory={isMandatory}
        userProps={{ options: opt, getValue: getSelectedValue, placeholder }}
        placeholder={placeholder}
        focus={focus}
        width={width}
      />
    </>
  );
};

export default CountrySelect;
