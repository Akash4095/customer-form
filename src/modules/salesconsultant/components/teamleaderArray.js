import { Field } from 'formik'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Modal, Table } from 'semantic-ui-react'
import userACL from '../../../store/access'
import { FormikDateComponent, FormikDateFromComponent, FormikHiddenInputComponent } from '../../../utilities/formUtils'
import TeamLeaderSelect from '../../teamleader/components/teamLeaderSelect'
import { teamleaderArray } from '../data/model'


const TeamleaderArray = ({ name, move, swap, push, insert, unshift, remove, pop, form: { initialValues, values, errors, status },
    ...props }) => {

    let check = false
    const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: '' })
    const [dateModalOpen, setDateModalOpen] = useState(false)
    const pageType = (values.pageType && values.pageType !== undefined && values.pageType !== null && values.pageType !== "") ? values.pageType : "entry"
    const [fromDate, setValidFrom] = useState(null)

    let id = values.id
    const salesObj = useSelector(state => state.salesConsultant.byId)
    let rows = salesObj ? salesObj[id] ? salesObj[id].history : "" : ""
    let lastItem = rows[rows.length - 1]
    let toDate = moment(lastItem ? lastItem.team_lead_2date : "").format("YYYY-MM-DD")
    let arrayKeys = []
    const [index, setIndex] = useState(0)
    const fieldName = name

    if (values[fieldName] && values[fieldName].length) {
        arrayKeys = Object.keys(values[fieldName])
    }

    const [rank, setRank] = useState(1)

    if (values.history.length === 1) {
        values.history[0].sr_no = 1
    }

    const getNewLineItem = (index) => {
        let numbering = teamleaderArray()
        userACL.atCreate(numbering)
        numbering.sr_no = parseInt(values.history[values.history.length - 1].sr_no) + 1
        push(numbering)
        setRank(rank + 1)
        setIndex(parseInt(index) + 1)
    }
    
    useEffect(() => {
        if (index > 0) {
            if (values.history[index].team_lead_4mdate) {
                let fDate = (values.history[index].team_lead_4mdate)
                let tDate = moment(values.history[index - 1].team_lead_2date).format("YYYY-MM-DD")
                let check = moment(tDate).isSameOrAfter(fDate)
                if (check === true) {
                    setDateModalOpen(true)
                }
            }
        }
        return () => null
    }, [fromDate])

    const callToRemove = (index, remove) => {
        if (values[fieldName].length > 1) {
            remove(index)
        } else {
            setIsModalOpen({ status: true, msg: 'You are not allowed to delete remaining last row' })
        }
    }

    return (

        <>
            <Table basic="very">
                <Table.Header className="TableHeader">
                    <Table.Row key="header" className="stickyHead">
                        <Table.HeaderCell width={1}>Sl</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Team Leader</Table.HeaderCell>
                        <Table.HeaderCell width={2}>From Date</Table.HeaderCell>
                        <Table.HeaderCell width={2}>To Date</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {
                        values[fieldName] && values[fieldName].length > 0 ? (
                            arrayKeys.map((index) => (
                                <Table.Row key={`${fieldName}[${index}]`} className="AccessoriesInputPanel">
                                    <Table.Cell width={1}>
                                        <label>{(parseInt(index) + 1)}</label>
                                    </Table.Cell>
                                    <Field name={`${fieldName}[${index}].sr_no`} component={FormikHiddenInputComponent} isTxn='true' />

                                    <Table.Cell width={2} className="border-bottom">
                                        <TeamLeaderSelect name={`${fieldName}[${index}].prnt_id`} isSelection={true} isMandatory={true} isTxn='false' isLabel='false' />
                                    </Table.Cell>
                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].team_lead_4mdate`} component={FormikDateFromComponent} setValidFrom={setValidFrom} isLabel='false' isTxn='true' placeholder='From Date' />
                                    </Table.Cell>
                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].team_lead_2date`} component={FormikDateComponent} isLabel='false' isTxn='true' placeholder='To Date' />
                                    </Table.Cell>

                                    <Table.Cell >
                                        {pageType === "edit" ?
                                            <>
                                                <Icon title='Add Row' className="fontSizeAddDeleteIcon AddIcon" name='add' color='green' onClick={() => getNewLineItem(index)} style={{ cursor: 'pointer' }} />
                                                <Icon title='Delete Row' className="fontSizeAddDeleteIcon" name='cancel' color='red' onClick={(e) => callToRemove(index, remove)} style={{ cursor: 'pointer' }} />
                                            </>
                                            : null}
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
                    <Button type="button" negative icon="thumbs down outline" content="Okay" labelPosition='right' onClick={() => { setIsModalOpen({ status: false, msg: '' }) }} />
                </Modal.Actions>
            </Modal>
            <Modal open={dateModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>Form Date Should be Greater than Above To Date</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setDateModalOpen(false)} />
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default TeamleaderArray