import { Field } from "formik";
import React from "react";
import { FormikSelectComponent } from "../../../utilities/formUtils";

const GSTRegTypeSelect = (
  {
    name,
    isTxn,
    isLabel,
    label,
    setOnCall,
    isSelection,
    setFieldValueM,
    focus,
    placeholder,
    width,
    validation,
    isMandatory,
    passFunct,
    getValue: callback,
  },
  props
) => {
  const getSelectedValue = (value, setFieldValue, values) => {
    setOnCall(value, setFieldValue, values);
  };

  const opt = [
    {
      key: "unregistered",
      value: "unregistered",
      text: "Unregistered Person",
    },
    {
      key: "registered",
      value: "registered",
      text: "Registered Person",
    },
    {
      key: "foreign",
      value: "foreign",
      text: "Foreign Person",
    },
    {
      key: "Foreign Goods Custom",
      value: "foreign_goods_custom",
      text: "Foreign Goods Custom",
    },
    {
      key: "Remind me later",
      value: "remind_me_later",
      text: "Remind me later",
    },
  ];
  return (
    <>
      <Field
        name={name}
        isLabel={isLabel}
        label={label}
        isTxn={isTxn}
        setFieldValueM={setFieldValueM}
        isSelection={isSelection}
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

export default GSTRegTypeSelect;
