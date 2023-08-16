import React, { useState } from "react";
import { Button, Checkbox, Icon, Modal, Popup, Table } from "semantic-ui-react";
import userACL from "../../../store/access";
import { Field } from "formik";
import {
  FormikDisplayLabelComponent,
  FormikInputComponent,
  FormikAmountComponent,
  FormikHiddenInputComponent,
} from "../../../utilities/formUtils";
import { callPriceListForAccessories, ciFormAccessories } from "../data/model";
import * as lfns from "./allCalculation";
import { useSelector } from "react-redux";
import UsedCarItemSearch from "./usedCarItemSearch";
import AccesoriesItemSearch from "./accesoriesSearch";

let rank = 1;
const AccessoriesArray = ({
  name,
  move,
  swap,
  push,
  insert,
  unshift,
  remove,
  pop,
  form: { initialValues, values, errors, setFieldValue },
  ...props
}) => {
  const mtaxObj = useSelector((state) => state.mtax.byId);
  const saleTypeObj = useSelector((state) => state.saletype.byId);

  const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: "" });
  let arrKeys = [];
  const fieldName = name;

  if (values[fieldName] && values[fieldName].length) {
    arrKeys = Object.keys(values[fieldName]);
  }
  const typeOfSale = saleTypeObj[values.sale_type_id]
    ? saleTypeObj[values.sale_type_id].saletype_name
    : "";

  const [rank, setRank] = useState(1);
  let ciformAcc = ciFormAccessories();

  if (values.accdetails.length === 1) {
    values.accdetails[0].sr_no = 1;
  }

  const getNewLineItem = (index) => {
    if (
      (values[fieldName][index].accessories &&
        values[fieldName][index].paid_inflow) ||
      values[fieldName][index].foc_outflow
    ) {
      getNewLine();
    }
  };

  const getNewLine = () => {
    userACL.atCreate(ciformAcc);
    ciformAcc.sr_no =
      parseInt(values.accdetails[values.accdetails.length - 1].sr_no) + 1;
    ciformAcc.txn_id = initialValues.id;
    push(ciformAcc);
    setRank(rank + 1);
  };

  const callToRemove = (index, remove, values, setFieldValue) => {
    if (parseInt(values[fieldName].length, 10) > 1) {
      if (
        values[fieldName][index].amount &&
        values[fieldName][index].amount !== undefined &&
        values[fieldName][index].amount !== null &&
        values[fieldName][index].amount !== "" &&
        parseFloat(values[fieldName][index].amount) !== 0
      ) {
        let insum = 0;
        for (let j = 0; j < values[fieldName].length; j++) {
          if (parseInt(j, 10) !== parseInt(index, 10)) {
            let amount =
              values[fieldName][j].amount &&
              values[fieldName][j].amount !== undefined &&
              values[fieldName][j].amount !== null &&
              values[fieldName][j].amount !== ""
                ? parseFloat(values[fieldName][j].amount)
                : 0;
            insum = parseFloat(amount) + parseFloat(insum);
          }
        }
        setFieldValue("paid_acc", insum);
        lfns.computeAllcalc(
          insum,
          values,
          index,
          setFieldValue,
          "paid_acc",
          mtaxObj,
          typeOfSale
        );
      }
      // if ((values[fieldName][index].foc_outflow && values[fieldName][index].foc_outflow !== undefined && values[fieldName][index].foc_outflow !== null && values[fieldName][index].foc_outflow !== "" && parseFloat(values[fieldName][index].foc_outflow) !== 0)) {
      //     let outsum = 0
      //     for (let i = 0; i < values[fieldName].length; i++) {
      //         if (parseInt(i, 10) !== parseInt(index, 10)) {
      //             let foc_outflow = (values[fieldName][i].foc_outflow && values[fieldName][i].foc_outflow !== undefined && values[fieldName][i].foc_outflow !== null && values[fieldName][i].foc_outflow !== "") ? parseFloat(values[fieldName][i].foc_outflow) : 0
      //             outsum = parseFloat(foc_outflow) + parseFloat(outsum)
      //         }
      //     }
      //     setFieldValue("out_foc_acc", outsum)
      //     lfns.computeAllcalc(outsum, values, index, setFieldValue, 'out_foc_acc', mtaxObj, typeOfSale)
      // }
      remove(index);
      setRank(rank - 1);
    } else {
      setIsModalOpen({
        status: true,
        msg: "You are not allowed to delete remaining last row",
      });
    }
  };
  
  const inflowSum = (value, values, index, setFieldValue, textFrom) => {
    let sum = 0;
    for (let i = 0; i < values[fieldName].length; i++) {
      let paid_inflow =
        parseInt(i, 10) === parseInt(index, 10)
          ? value
          : values[fieldName][i].paid_inflow &&
            values[fieldName][i].paid_inflow !== undefined &&
            values[fieldName][i].paid_inflow !== null &&
            values[fieldName][i].paid_inflow !== ""
          ? parseFloat(values[fieldName][i].paid_inflow)
          : 0;
      sum = parseFloat(sum) + parseFloat(paid_inflow);
    }
    setFieldValue("paid_acc", sum);
    lfns.computeAllcalc(
      sum,
      values,
      index,
      setFieldValue,
      "paid_acc",
      mtaxObj,
      typeOfSale
    );
  };

  const outflowSum = (value, values, index, setFieldValue, textFrom) => {
    let sum = 0;
    for (let i = 0; i < values[fieldName].length; i++) {
      let foc_outflow =
        parseInt(i, 10) === parseInt(index, 10)
          ? value
          : values[fieldName][i].foc_outflow &&
            values[fieldName][i].foc_outflow !== undefined &&
            values[fieldName][i].foc_outflow !== null &&
            values[fieldName][i].foc_outflow !== ""
          ? parseFloat(values[fieldName][i].foc_outflow)
          : 0;
      sum = parseFloat(sum) + parseFloat(foc_outflow);
    }
    setFieldValue("out_foc_acc", sum);
    lfns.computeAllcalc(
      sum,
      values,
      index,
      setFieldValue,
      "out_foc_acc",
      mtaxObj,
      typeOfSale
    );
  };

  const ammountChangedFunc = (
    value,
    values,
    index,
    setFieldValue,
    textFrom
  ) => {
    let sum = 0;
    if (value > 0) {
      setFieldValue(`${fieldName}[${index}].foc_outflow`, 0);
      setFieldValue(`${fieldName}[${index}].paid_inflow`, 1);
    } else if (value == 0 || value === "") {
      setFieldValue(`${fieldName}[${index}].foc_outflow`, 1);
      setFieldValue(`${fieldName}[${index}].paid_inflow`, 0);
    }
    for (let i = 0; i < values[fieldName].length; i++) {
      if (value !== "" && value !== null && value !== undefined) {
        let amount =
          parseInt(i, 10) === parseInt(index, 10)
            ? value
            : values[fieldName][i].amount &&
              values[fieldName][i].amount !== undefined &&
              values[fieldName][i].amount !== null &&
              values[fieldName][i].amount !== ""
            ? parseFloat(values[fieldName][i].amount)
            : 0;
        sum = parseFloat(sum) + parseFloat(amount);
      }
    }
    // console.log('sum==============================', sum)
    setFieldValue("paid_acc", sum);
    lfns.computeAllcalc(
      sum,
      values,
      index,
      setFieldValue,
      "paid_acc",
      mtaxObj,
      typeOfSale
    );
  };
  const setPaidInflowCheckBox = (
    e,
    { checked },
    setFieldValue,
    amount,
    index,
    values
  ) => {
    // console.log(values.accdetails,"======================acccdetails")
    if (checked === true && amount > 0) {
      setFieldValue(`${fieldName}[${index}].paid_inflow`, 1);
      setFieldValue(`${fieldName}[${index}].foc_outflow`, 0);
    } else {
      setFieldValue(`${fieldName}[${index}].paid_inflow`, 0);
    }
  };
  const setFocOutflowCheckBox = (
    e,
    { checked },
    setFieldValue,
    amount,
    index,
    values
  ) => {
    if (checked === true) {
      setFieldValue(`${fieldName}[${index}].foc_outflow`, 1);
      setFieldValue(`${fieldName}[${index}].paid_inflow`, 0);
      setFieldValue(`${fieldName}[${index}].amount`, 0);
    } else {
      setFieldValue(`${fieldName}[${index}].foc_outflow`, 0);
    }
  };

  const setPricListAmountFunc = (value, setFieldValue, values, index) => {
    let plNameGet = values.sale_type_id
      ? saleTypeObj[values.sale_type_id]
        ? saleTypeObj[values.sale_type_id].price_list
          ? saleTypeObj[values.sale_type_id].price_list
          : ""
        : ""
      : "";

    callPriceListForAccessories(
      value,
      values.booking_date,
      plNameGet,
      setFieldValue,
      index
    );
  };

  return (
    <>
      <Table className="accessoriesPanel">
        <Table.Header className="TableHeader">
          <Table.Row key="header" className="stickyHead">
            <Table.HeaderCell width={1}>SR NO</Table.HeaderCell>
            <Table.HeaderCell width={5}>ACCESSORIES</Table.HeaderCell>
            <Table.HeaderCell width={3}>Amount</Table.HeaderCell>
            <Table.HeaderCell width={2}>PAID (inflow)</Table.HeaderCell>
            <Table.HeaderCell width={2}>FOC (outflow)</Table.HeaderCell>
            <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {values[fieldName] && values[fieldName].length >= 0
            ? arrKeys.map((index) => (
                <Table.Row
                  key={`${fieldName}[${index}]`}
                  className="AccessoriesInputPanel"
                >
                  {/* <Table.Cell> <label>{(parseInt(index) + 1)}</label></Table.Cell> */}
                  <Table.Cell width={1} className="input-text-left ">
                    <label className="leftPadd">{parseInt(index) + 1}</label>
                  </Table.Cell>
                  <Field
                    name={`${fieldName}[${index}].sr_no`}
                    component={FormikHiddenInputComponent}
                    isTxn="true"
                  />
                  <Table.Cell width={4} className="">
                    <AccesoriesItemSearch
                      name={`${fieldName}[${index}].accessories`}
                      isLabel="false"
                      index={index}
                      isTxn="true"
                      getValue={setPricListAmountFunc}
                      isSelection={true}
                      className="accesoryDropdown"
                    />
                  </Table.Cell>
                  <Table.Cell width={3} className="">
                    <Field
                      name={`${fieldName}[${index}].amount`}
                      component={FormikAmountComponent}
                      index={index}
                      onValChangeFunc={ammountChangedFunc}
                      compute={ammountChangedFunc}
                      isLabel="false"
                      isTxn="true"
                    ></Field>
                  </Table.Cell>

                  <Table.Cell width={2} className="input-text-left ">
                    {values[fieldName][index].foc_outflow &&
                    parseFloat(values[fieldName][index].foc_outflow) === 1 ? (
                      <Popup
                        content="Please Fill Amount"
                        on="click"
                        pinned
                        trigger={
                          <Checkbox
                            className=""
                            checked={
                              values[fieldName][index].foc_outflow === 1
                                ? false
                                : true
                            }
                            onClick={(e, { checked }) =>
                              setPaidInflowCheckBox(
                                e,
                                { checked },
                                setFieldValue,
                                values.accdetails[index].amount,
                                index,
                                values
                              )
                            }
                          />
                        }
                      />
                    ) : (
                      <Checkbox
                        name={`${fieldName}[${index}].paid_inflow`}
                        className=""
                        checked={
                          values.accdetails[index].paid_inflow == 1
                            ? true
                            : false
                        }
                        onClick={(e, { checked }) =>
                          setPaidInflowCheckBox(
                            e,
                            { checked },
                            setFieldValue,
                            values.accdetails[index].amount,
                            index,
                            values
                          )
                        }
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell width={2} className="input-text-left ">
                    {values[fieldName][index].paid_inflow &&
                    values[fieldName][index].paid_inflow !== undefined &&
                    parseFloat(values[fieldName][index].paid_inflow) === 1 ? (
                      <Checkbox
                        className=""
                        checked={
                          parseFloat(values[fieldName][index].paid_inflow) === 1
                            ? false
                            : true
                        }
                        onClick={(e, { checked }) =>
                          setFocOutflowCheckBox(
                            e,
                            { checked },
                            setFieldValue,
                            values.accdetails[index].amount,
                            index,
                            values
                          )
                        }
                      />
                    ) : (
                      <Checkbox
                        name={`${fieldName}[${index}].foc_outflow`}
                        className=""
                        checked={
                          parseFloat(values.accdetails[index].foc_outflow) == 1
                            ? true
                            : false
                        }
                        onClick={(e, { checked }) =>
                          setFocOutflowCheckBox(
                            e,
                            { checked },
                            setFieldValue,
                            values.accdetails[index].amount,
                            index,
                            values
                          )
                        }
                      />
                    )}
                  </Table.Cell>

                  <Table.Cell width={1}>
                    <Icon
                      title="Add Row"
                      className="fontSizeAddDeleteIcon AddIcon"
                      name="add"
                      color="green"
                      onClick={() => getNewLineItem(index)}
                      style={{ cursor: "pointer" }}
                    />
                    <Icon
                      title="Delete Row"
                      className="fontSizeAddDeleteIcon"
                      name="cancel"
                      color="red"
                      onClick={(e) =>
                        callToRemove(index, remove, values, setFieldValue)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table>
      <Modal open={isModalOpen.status} size="mini">
        <Modal.Header>Error</Modal.Header>
        <Modal.Content>
          <p>{isModalOpen.msg}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            negative
            icon="thumbs down outline"
            content="Okay"
            labelPosition="right"
            onClick={() => {
              setIsModalOpen({ status: false, msg: "" });
            }}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default AccessoriesArray;
