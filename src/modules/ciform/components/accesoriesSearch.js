import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { Field } from "formik";
import { searchAccesoriesItem } from "../data/actions";
import userACL from "../../../store/access";
import { merge } from "lodash";
import { FormikAsyncSelectComponent } from "../../../utilities/formUtils";

const AccesoriesItemSearch = (
  {
    name,
    isTxn,
    isLabel,
    label,
    values,
    focus,
    className,
    onBlurCall,
    onFocusCall,
    isSelection,
    isMandatory,
    type,
    index,
    placeholder,
    appendLabel,
    appendLabelText,
    isFetching,
    width,
    sefFocus,
    getValue: callback,
  },
  props
) => {
  const searchOptions = useSelector((state) =>
    select.selectAccesoriesItem(state, props)
  );
  let options = [];
  const dispatch = useDispatch();

  const data = merge({}, userACL.atFetch());

  const getInputValue = (value, setFieldValue) => {
    if (value.length > 2) {
      let values = {
        srchStr: value,
      };
      values.segid = data.segid;
      values.cid = data.cid;
      if (values.cid !== 0) {
        dispatch(searchAccesoriesItem(values, index));
      }
    }
  };

  const getValue = (value, setFieldValue, values) => {
    if (callback) {
      callback(value, setFieldValue, values, index);
    }
  };

  return (
    <Field
      name={name}
      sefFocusCalled={sefFocus}
      onFocusCall={onFocusCall}
      onBlurCall={onBlurCall}
      className={appendLabel ? "goRelative" : className}
      isLabel={isLabel}
      placeholder={placeholder}
      isTxn={isTxn}
      label={label}
      isFetching={isFetching}
      tabindex={5}
      width={width}
      appendLabel={appendLabel}
      appendLabelText={appendLabelText}
      isMandatory={isMandatory}
      isSelection={isSelection}
      focus={focus}
      component={FormikAsyncSelectComponent}
      userProps={{ options, searchOptions, getInputValue, getValue }}
    >
    </Field>
  );
};

export default AccesoriesItemSearch;
