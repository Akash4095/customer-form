import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { Field } from "formik";
import {
  FormikSelectComponent,
  FormikAsyncSelectComponent,
} from "../../../utilities/formUtils"; //FormikAsyncSelectComponent
import { searchVin } from "../data/actions";
import userACL from "../../../store/access";
import { filter, find, matches, merge } from "lodash";
import moment from "moment";

const VinSearch = (
  {
    name,
    isTxn,
    isLabel,
    label,
    fullData,
    isError,
    values,
    focus,
    defaultOpen,
    isSelection,
    isMandatory,
    type,
    placeholder,
    appendLabel,
    appendLabelText,
    isFetching,
    width,
    getLabelClass,
    ledgerSearchBy,
    sefFocus,
    getValue: callback,
  },
  props
) => {
  const searchOptions = useSelector((state) =>
    select.selectVinName(state, props)
  );
  const searchOptions2 = useSelector((state) =>
    select.selectVinNameByItemBatch(state, props)
  );
  // console.log('searchOptions2', searchOptions2)
  let options = [];
  const dispatch = useDispatch();

  const data = merge({}, userACL.atFetch());

  const getInputValue = (value, setFieldValue) => {
    if (value.length > 3) {
      let values = {
        batchName: value,
      };
      values.segid = data.segid;
      values.cid = data.cid;
      if (values.cid !== 0) {
        setTimeout(() => {
          dispatch(searchVin(values));
        }, 1000);
      }
    }
  };

  const getValue = (value, setFieldValue) => {
    if (callback) {
      callback(value, setFieldValue, fullData.ex_delivery_date, fullData);
    }
  };

  // Loading Logic if tasks not fetched
  return (
    <Field
      name={name}
      sefFocusCalled={sefFocus}
      isError={isError}
      className={appendLabel ? "goRelative" : ""}
      isLabel={isLabel}
      isTxn={isTxn}
      placeholder={placeholder}
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
      getLabelClass={getLabelClass}
    >
    </Field>
    //component={FormikAsyncSelectComponent}
  );
};

export default VinSearch;
