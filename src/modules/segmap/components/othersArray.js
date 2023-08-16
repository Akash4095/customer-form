import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button, Icon, Modal, TableHeader, Table, } from 'semantic-ui-react'
import { FormikInputComponent, FormikDateFromComponent } from '../../../utilities/formUtils';
import { numdetailsArray, othersArrayValues } from '../data/model';
import { Field } from 'formik'
import userACL from '../../../store/access';
import { getOthersList } from '../data/selectors';
import { useSelector } from 'react-redux';


const OthersArray = ({ name, move, swap, push, insert, unshift, remove, pop, form: { initialValues, values, errors },
    ...props }) => {

    const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: '' })

    let arrKeys = []
    const fieldName = name

    if (values[fieldName] && values[fieldName].length) {
        arrKeys = Object.keys(values[fieldName])

    }
    const [rank, setRank] = useState(1)

    const getNewLine = (index) => {
        let numbering = othersArrayValues()
        numbering.id = ""
        push(numbering)
    }

    const getNewLineItem = (index) => {
        if (index < 3) {
            getNewLine(index)
        } else {
            setIsModalOpen({ status: true, msg: 'Maximum 4 rows can be created' })
        }
    }



    const callToRemove = (index, remove) => {
        if (values[fieldName].length > 1) {
            remove(index);
        } else {
            setIsModalOpen({ status: true, msg: 'You are not allowed to delete remaining last row' })
        }

    }

    return (
        <>


            <Table basic='very'>
                <Table.Header className="TableHeader">
                    <Table.Row key="header" className="stickyHead">
                        <Table.HeaderCell width={1}>Others Type</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Others Name <font color="red">*</font></Table.HeaderCell>
                        <Table.HeaderCell width={1} >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {
                        values[fieldName] && values[fieldName].length > 0 ? (
                            arrKeys.map((index) => (
                                <Table.Row key={`${fieldName}[${index}]`} className="AccessoriesInputPanel">

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].key`} value={"Others" + (parseInt(index) + 1)} component={FormikInputComponent} className="vnumGet" isLabel='false' isTxn='true' />
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        <Field name={`${fieldName}[${index}].value`} component={FormikInputComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>
                                    <Table.Cell width={1} >
                                    <Icon title='Add Row' className="fontSizeAddDeleteIcon AddIcon" name='add' color='green' onClick={() => getNewLineItem(index)} style={{ cursor: 'pointer' }} />
                                        {/* <Icon title='Delete Row' className="" name='cancel' color='red' onClick={(e) => callToRemove(index, remove)} style={{ cursor: 'pointer' }} /> */}
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

        </>
    )
}

export default OthersArray

