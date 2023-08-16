import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button, Icon, Modal, TableHeader, Table, Label } from 'semantic-ui-react'
import { FormikInputComponent, FormikAmountComponent, FormikDateComponent, FormikDateFromComponent, FormikHiddenInputComponent } from '../../../utilities/formUtils';
import { } from '../data/selectors';
import { mtaxArray } from '../data/model';
import { Field } from 'formik'
import userACL from '../../../store/access';
import moment from 'moment';


const MtaxArray = ({ name, move, swap, push, insert, unshift, remove, pop, form: { initialValues, values, errors },
    ...props }) => {


    const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: '' })
    const [amountModalOpen, setAmountModalOpen] = useState(false)
    const [newRowModalOpen, setNewRowModalOpen] = useState(false)
    const [fromAmount, setFromAmount] = useState(null)
    const [toAmount, setToAmount] = useState(null)
    const [index, setIndex] = useState(0)
    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [nextLineDateModalOpen, setNextLineDateModalOpen] = useState(false)
    const [fromDate, setValidFrom] = useState(null)
    const [toDate, setValidToDate] = useState(null)
    let arrKeys = []
    const fieldName = name

    if (values[fieldName] && values[fieldName].length) {
        arrKeys = Object.keys(values[fieldName])

    }

    if (values.taxetails.length === 1) {
        values.taxetails[0].sr_no = 1
    }

    const [rank, setRank] = useState(1)
    const getNewLineItem = (index) => {
        let numbering = mtaxArray()
        userACL.atCreate(numbering)
        numbering.sr_no = parseInt(values.taxetails[values.taxetails.length - 1].sr_no) + 1
        push(numbering)
        setRank(rank + 1)
        setIndex(parseInt(index) + 1)
    }

    useEffect(() => {
        if (values.taxetails) {
            if (values.taxetails[index]) {
                if (values.taxetails[index].from_amount && values.taxetails[index].to_amount) {
                    if (values.taxetails[index].from_amount > values.taxetails[index].to_amount) {
                        if (values.modelOpenEdit === true) {
                            setAmountModalOpen(true)
                        }

                    }
                }
            }
        }

        if (index > 0) {
            if (values.taxetails) {
                if (values.taxetails[index]) {
                    if (values.taxetails[index].from_amount && values.taxetails[index].to_amount) {
                        if (values.taxetails[index].from_amount > values.taxetails[index].to_amount) {
                            setAmountModalOpen(true)
                        }
                    }
                }
            }
        }

        if (index > 0) {
            if (values.taxetails[index].from_amount) {
                if (values.taxetails[index].from_amount > values.taxetails[index - 1].from_amount && values.taxetails[index].from_amount < values.taxetails[index - 1].to_amount) {
                    setNewRowModalOpen(true)
                }
            }
        }

        if (index > 0) {
            if (values.taxetails[index].to_amount && values.taxetails[index].to_amount) {
                if (values.taxetails[index].to_amount > values.taxetails[index - 1].from_amount && values.taxetails[index].to_amount < values.taxetails[index - 1].to_amount) {
                    setNewRowModalOpen(true)
                }
            }
        }
        return () => null
    }, [fromAmount, toAmount])

    useEffect(() => {
        if (values.taxetails[index]) {
            if (fromDate && toDate) {
                let check = moment(fromDate).isAfter(toDate)
                if (check === true) {
                    setDateModalOpen(true)
                    setTimeout(() => {
                        values.taxetails[index].valid_to = ""
                    }, 1000)
                }
            }
        }

        if (index > 0) {
            if (values.taxetails[index]) {
                if (values.taxetails[index].valid_from && values.taxetails[index].valid_to) {
                    let check = moment(values.taxetails[index].valid_from).isAfter(values.taxetails[index].valid_to)
                    if (check === true) {
                        setDateModalOpen(true)
                        setTimeout(() => {
                            values.taxetails[index].valid_to = ""
                        }, 1000)
                    }
                }
            }

        }

        return () => null
    }, [fromDate, toDate])


    const callToRemove = (index, remove) => {
        if (values[fieldName].length > 1) {
            remove(index);
        } else {
            setIsModalOpen({ status: true, msg: 'You are not allowed to delete remaining last row' })
        }

    }
    const getFromAmount = (value) => {
        setFromAmount(value)
    }
    const getToAmount = (value) => {
        setToAmount(value)
    }

    return (
        <>

            <Table basic='very'>
                <Table.Header className="TableHeader">
                    <Table.Row key="header" className="stickyHead">
                        <Table.HeaderCell width={1}>Sl</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Valid From</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Valid To</Table.HeaderCell>
                        <Table.HeaderCell width={2}>From Amount</Table.HeaderCell>
                        <Table.HeaderCell width={2}>To Amount</Table.HeaderCell>
                        <Table.HeaderCell width={2}>M-Tax Rate </Table.HeaderCell>
                        <Table.HeaderCell width={2}>Additional Amount</Table.HeaderCell>
                        <Table.HeaderCell >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {
                        values[fieldName] && values[fieldName].length > 0 ? (
                            arrKeys.map((index) => (
                                <Table.Row key={`${fieldName}[${index}]`} className="AccessoriesInputPanel">
                                    <Table.Cell width={1}>
                                        <label>{(parseInt(index) + 1)}</label>
                                    </Table.Cell>

                                    <Field name={`${fieldName}[${index}].sr_no`} component={FormikHiddenInputComponent} isTxn='true' />

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].valid_from`} component={FormikDateFromComponent} setValidFrom={setValidFrom} isLabel='false' isTxn='true' placeholder='Valid From' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].valid_to`} component={FormikDateFromComponent} setValidFrom={setValidToDate} isLabel='false' isTxn='true' placeholder='Valid To' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].from_amount`} component={FormikAmountComponent} allowNegative={true} compute={getFromAmount} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].to_amount`} component={FormikAmountComponent} allowNegative={true} compute={getToAmount} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].app_rate`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].add_amount`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell >

                                        <>
                                            <Icon title='Add Row' className="fontSizeAddDeleteIcon AddIcon" name='add' color='green' onClick={() => getNewLineItem(index)} style={{ cursor: 'pointer' }} />
                                            <Icon title='Delete Row' className="fontSizeAddDeleteIcon" name='cancel' color='red' onClick={(e) => callToRemove(index, remove)} style={{ cursor: 'pointer' }} />
                                        </>

                                    </Table.Cell>

                                </Table.Row>
                            ))
                        ) : null
                    }

                </Table.Body>
            </Table>


            <Modal open={isModalOpen.status} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>{isModalOpen.msg}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => { setIsModalOpen({ status: false, msg: '' }) }} />
                </Modal.Actions>
            </Modal>
            <Modal open={amountModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>To Amount Should be Greater than From Amount</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setAmountModalOpen(false)} />
                </Modal.Actions>
            </Modal>

            <Modal open={newRowModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>Amount Should Not be In between above Two Amounts</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setNewRowModalOpen(false)} />
                </Modal.Actions>
            </Modal>
            <Modal open={dateModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>To Date Should be Greater than From Date</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setDateModalOpen(false)} />
                </Modal.Actions>
            </Modal>

        </>
    )
}

export default MtaxArray

