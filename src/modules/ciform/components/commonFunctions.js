import moment from "moment"



export function setSalesManagerOnEdit(teamleader, ciform, setSalesManagerName, setTeamLeaderName) {
    if (teamleader) {
        if (teamleader[ciform.sales_consultant_id]) {
            if (teamleader[ciform.sales_consultant_id].history) {
                let array = teamleader[ciform.sales_consultant_id].history
                let data = array.filter((obj) => {
                    let fromDate = moment(obj.team_lead_4mdate).format("YYYY-MM-DD"),
                        toDate = moment(obj.team_lead_2date).format("YYYY-MM-DD")

                    return moment(ciform.ci_form_date).isBetween(fromDate, toDate, undefined, '[]')
                })
                if (data.length > 0) {
                    let teamleaderId = data[0].prnt_id
                    let salesmanagerId = teamleaderId ? teamleader[teamleaderId].prnt_id : ""
                    let salesmanagerName = salesmanagerId ? teamleader[salesmanagerId].emp_name : ""
                    let teamLeaderName = salesmanagerId ? teamleader[teamleaderId].emp_name : ""
                    setSalesManagerName(salesmanagerName)
                    setTeamLeaderName(teamLeaderName)

                }

            } else {
                setSalesManagerName("")
                setTeamLeaderName("")
            }
        } else {
            setSalesManagerName("")
            setTeamLeaderName("")
        }
    }
}


export const calculateAgeFromDob = (value) => {

    let bdayYear = value.split("-")[0]
    let bdayMonth = value.split("-")[1]
    let bdayDay = value.split("-")[2]

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
    // console.log('y,m,d', y, m, d)
    return y
}

export function checkIsAddressSame(customerObj, setSameAddCheck) {
    if (customerObj && customerObj !== null && customerObj !== undefined) {
        if (customerObj.party && customerObj.party !== null && customerObj.party !== undefined && customerObj.alt_party_address && customerObj.alt_party_address !== null && customerObj.alt_party_address !== undefined) {
            let party = customerObj.party
            let alt_party = customerObj.alt_party_address[0]
            // console.log('party', party)
            // console.log('alt_party', alt_party)
            let reg_address = (party && party !== undefined && party !== null && party !== {}) ? party.address : ""
            let reg_pin = (party && party !== undefined && party !== null && party !== {}) ? party.pin : ""
            let reg_city = (party && party !== undefined && party !== null && party !== {}) ? party.city : ""
            let reg_st = (party && party !== undefined && party !== null && party !== {}) ? party.st : ""
            let reg_country = (party && party !== undefined && party !== null && party !== {}) ? party.country_name : ""
            let permanent_address = (alt_party && alt_party !== null && alt_party !== undefined && alt_party !== {}) ? alt_party.address : ""
            let pa_pin = (alt_party && alt_party !== null && alt_party !== undefined && alt_party !== {}) ? alt_party.pin : ""
            let pa_city = (alt_party && alt_party !== null && alt_party !== undefined && alt_party !== {}) ? alt_party.city : ""
            let pa_st = (alt_party && alt_party !== null && alt_party !== undefined && alt_party !== {}) ? alt_party.st : ""
            let pa_country = (alt_party && alt_party !== null && alt_party !== undefined && alt_party !== {}) ? alt_party.country_name : ""
            if ((reg_address == permanent_address) && (reg_pin && pa_pin) && (reg_city == pa_city) && (reg_st == pa_st) && (reg_country == pa_country)) {
                setSameAddCheck(true)
            } else {
                setSameAddCheck(false)
            }
        }
    }
}
export function checkFieldValidation(
    values,
    setbookingDateError,
    setExpectedDateError,
    setSaleTypeError,
    setLeadSrcError,
    setCustIdError,
    setVinNoError,
    setNomineeError,
    scrollForm,
    scrollCustomer,
    scrollVehical,
    scrollSummary
) {

    if (values.booking_date == "" || values.booking_date == null) {
        scrollForm()
        setbookingDateError(true)
    } else if (values.ex_delivery_date == "" || values.ex_delivery_date == null) {
        scrollForm()
        setExpectedDateError(true)
    } else if (values.lead_source_pan !== "" && values.lead_source_pan.length < 10) {
        scrollForm()
        setLeadSrcError(true)
    } else if (values.sale_type_id == "" || values.sale_type_id == null) {
        scrollForm()
        setSaleTypeError(true)
    } else if (values.customer_id == "" || values.customer_id == null) {
        scrollCustomer()
        setCustIdError(true)
    } else if (values.vin_on == "" || values.vin_on == null) {
        scrollVehical()
        setVinNoError(true)
    } else if (values.nominee_name == "" || values.nominee_name == null) {
        scrollSummary()
        setNomineeError(true)
    } else {
        setbookingDateError(false)
        setExpectedDateError(false)
        setLeadSrcError(false)
        setSaleTypeError(false)
        setCustIdError(false)
        setVinNoError(false)
        setNomineeError(false)
    }
}
export function changeBackgroundFunction(
    formDetails,
    setFormScroll,
    setCustScroll,
    setVehicalScroll,
    setDealScroll,
    setOutflowScroll,
    setInflowScroll,
    setSupportScroll,
    setSummaryScroll,
    setNomineeScroll,
    setFinanceScroll,
    setAccessoriesScroll,
    setUsedCarAdditionalScroll,
    customer,
    vehical,
    final,
    summary,
    inflow,
    outflow,
    usedCarAddDetails,
    support,
    nominee,
    finance,
    accessories
) {
    // getting div elements height using ref

    if (formDetails && formDetails !== undefined && formDetails !== null) {
        if (formDetails.current && formDetails.current !== undefined && formDetails.current !== null) {
            const formHeight = (formDetails.current.clientHeight && (formDetails.current.clientHeight !== null)) ? formDetails.current.clientHeight : 10
            const custHeight = customer.current.clientHeight
            const vehicalHeight = vehical.current.clientHeight
            const dealHeight = final.current.clientHeight
            const summaryHeight = summary.current.clientHeight
            const inflowHeight = inflow.current.clientHeight
            const outflowHeight = outflow.current.clientHeight
            const usedCarAddHeight = usedCarAddDetails.current.clientHeight
            const supportHeight = support.current.clientHeight
            const nomineeHeight = nominee.current.clientHeight
            const financeHeight = finance.current.clientHeight
            const accessoriesHeight = accessories.current.clientHeight


            const fcHeight = custHeight + formHeight
            const fcvHeight = custHeight + formHeight + vehicalHeight
            const inHeight = custHeight + formHeight + vehicalHeight + inflowHeight
            const outHeight = custHeight + formHeight + vehicalHeight + inflowHeight + outflowHeight
            const usedCarHeight = outHeight + usedCarAddHeight
            const supHeight = usedCarHeight + supportHeight
            const sumHeight = supHeight + summaryHeight
            const nomHeight = sumHeight + nomineeHeight
            const finHeight = nomHeight + financeHeight
            const accHeight = finHeight + accessoriesHeight


            if (window.scrollY >= 0 && window.scrollY < (formHeight + 50)) {
                setFormScroll(window.scrollY)
                setCustScroll(false)
                setVehicalScroll(false)
                setDealScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            }
            else if (window.scrollY >= (formHeight + 50) && window.scrollY <= (fcHeight)) {
                setCustScroll(window.scrollY)
                setVehicalScroll(false)
                setDealScroll(false)
                setFormScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            }
            else if (window.scrollY > (fcHeight + 10) && window.scrollY <= (fcvHeight + 50)) {
                setVehicalScroll(window.scrollY)
                setCustScroll(false)
                setDealScroll(false)
                setFormScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            }
            else if (window.scrollY >= (fcvHeight + 50) && window.scrollY <= (inHeight + 100)) {
                setDealScroll(window.scrollY)
                setInflowScroll(window.scrollY)
                setOutflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)

            }
            else if (window.scrollY >= (inHeight + 100) && window.scrollY <= (outHeight + 50)) {
                setDealScroll(window.scrollY)
                setOutflowScroll(window.scrollY)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)

            }
            else if (window.scrollY >= (outHeight + 80) && window.scrollY <= (usedCarHeight + 100)) {
                setDealScroll(window.scrollY)
                setUsedCarAdditionalScroll(window.scrollY)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)

            }
            else if (window.scrollY >= (usedCarHeight + 100) && window.scrollY <= (supHeight + 150)) {
                setDealScroll(window.scrollY)
                setSupportScroll(window.scrollY)
                setOutflowScroll(false)
                setInflowScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)

            }

            else if (window.scrollY >= (supHeight + 150) && window.scrollY <= (sumHeight + 100)) {
                setSummaryScroll(window.scrollY)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setDealScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            }
            else if (window.scrollY >= (sumHeight + 100) && window.scrollY <= (nomHeight + 200)) {
                setNomineeScroll(window.scrollY)
                setSummaryScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setDealScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            } else if (window.scrollY >= (nomHeight + 200) && window.scrollY <= (finHeight + 100)) {
                setFinanceScroll(window.scrollY)
                setSummaryScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setDealScroll(false)
                setNomineeScroll(false)
                setAccessoriesScroll(false)
                setUsedCarAdditionalScroll(false)
            }
            else if (window.scrollY >= (finHeight + 100) && window.scrollY <= (accHeight + 200)) {
                setAccessoriesScroll(window.scrollY)
                setSummaryScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setCustScroll(false)
                setVehicalScroll(false)
                setFormScroll(false)
                setDealScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setUsedCarAdditionalScroll(false)

            }
            else {
                setVehicalScroll(false)
                setOutflowScroll(false)
                setInflowScroll(false)
                setSupportScroll(false)
                setFormScroll(false)
                setCustScroll(false)
                setDealScroll(false)
                setSummaryScroll(false)
                setNomineeScroll(false)
                setFinanceScroll(false)
                setAccessoriesScroll(true)
                setUsedCarAdditionalScroll(false)

            }
        }
    }
}