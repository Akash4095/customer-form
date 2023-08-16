import React, { useEffect, useState } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, Form as FormikForm } from 'formik'
import { FormikInputComponent, FormikAmountComponent, FormikDateComponent } from '../../../utilities/formUtils';
import { useDispatch, useSelector } from 'react-redux';

const AgeCalculator = ({ setAgeCalculatorOpen }) => {
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [show, setShow] = useState(false);


    const initialVal = {
        dob: ""
    }

    function calculateAge(values, resetForm) {

        let bdayYear = values.dob.split("-")[0]
        let bdayMonth = values.dob.split("-")[1]
        let bdayDay = values.dob.split("-")[2]

        var date = new Date();
        var currYear = date.getFullYear();
        var currMonth = 1 + date.getMonth();
        var currDay = date.getDate();

        var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (bdayDay > currDay) {
            currDay = currDay + month[currMonth - 1];
            currMonth = currMonth - 1;
        }
        if (bdayMonth > currMonth) {
            currMonth = currMonth + 12;
            currYear = currYear - 1;
        }
        var d = currDay - bdayDay;
        var m = currMonth - bdayMonth;
        var y = currYear - bdayYear;

        setYear(y ? y : "")
        setMonth(m ? m : "")
        setDay(d ? d : "")
        setShow(true)
        resetForm()
    }


    return (
        <Container>
            <Formik
                initialValues={initialVal}
                validationSchema={null}
                onSubmit={(values, { resetForm }) => calculateAge(values, resetForm)}
                render={({ handleSubmit, onChange, resetForm, values, handleChange }) => (
                    <Form as={FormikForm} size="small" width={12} onSubmit={handleSubmit} className="CustomForm">
                        <Form.Group widths={1}>
                            <Field name='dob' label='Enter Date Of Birth' component={FormikDateComponent} />
                            <Button type="submit" size="medium" color='blue' className="CustomeBTN"> Calculate </Button>
                        </Form.Group>
                        

                    </Form>
                )}
            />
            <br></br>
            {
                show ?
                    <p style={{fontSize:"18px"}}>{`${year === "" ? 0 : year} Years ${month === "" ? 0 : month} Months ${day === "" ? 0 : day} Days`}</p>
                    : ""
            }
            <br></br>
        </Container>
    );
}

export default AgeCalculator