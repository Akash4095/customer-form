import React from 'react';
import { Container } from 'semantic-ui-react'
import { displayDate, displayAmtInLakh } from '../../../utilities/listUtils'


class CiFormPrint extends React.PureComponent  {


    // Loading Logic if tasks not fetched
    render () {
        const { ciform } = this.props
        const { saleTypeObj } = this.props
        const { saleType } = this.props
        const { segmapObj } = this.props
        const { showSegName } = this.props
        const { leadSourceObj } = this.props
        const { leadSource } = this.props
        const { scNameObj } = this.props
        const { scName } = this.props
        const { salesManagerObj } = this.props
        const { salesManager } = this.props
        const { customer_name } = this.props
        const { customer_cd } = this.props
        const { cust_registration_address } = this.props
        const { cust_permanent_address } = this.props
        const { cust_mobele_no } = this.props
        const { cust_email_id } = this.props
        const { cust_gst_no } = this.props
        const { cust_pan_no } = this.props
        const { summaryInflow } = this.props
        const { summaryoutflow } = this.props
        const { summaryInvoice } = this.props
        const { summaryOtherSpt } = this.props
        const { summaryExBasic } = this.props
        const { summaryHmilSpt } = this.props
        const { summaryRecivable } = this.props
        const { finSCName } = this.props
        const { bankName } = this.props
        const { actualShowRoom } = this.props
        const accdetails = ciform.accdetails
        const stringArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let totalPaid = 0;
        let totalFoc = 0;
        let rowStyle = {'background' : '#2385d0' , 'color': 'white', 'font-weight': 'bold'}
// 
    return (
        <Container className="printContainer">
            <div className='tablePrint' style={{width: '100%'}}>
                <div className='trPrint printTableHeader'>
                    <div className='tdPrint printCenterAlign printTableHeaderBorder' style={{width: '100%'}}>
                        CI FORM
                    </div>
                </div>
                <div className='trPrint'>
                    <div className='tdPrint printTableHeaderBorder borderTopRemovePrint' style={{width: '100%'}}>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    FORM DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    FORM NO.
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>
                                    {ciform.form_no}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                     LOCATION
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>  
                                    {segmapObj ? showSegName ? showSegName : 'Loading...' : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    DATE
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '20%'}}>
                                    {ciform.ci_form_date ? displayDate(ciform.ci_form_date) : '-'}
                                </div>
                            </div>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    DELIVERY DATE
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>
                                    {ciform.ex_delivery_date ? displayDate(ciform.ex_delivery_date) : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    BOOKING DATE
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>
                                    {ciform.booking_date ? displayDate(ciform.booking_date) : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    TYPE OF SALE
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '20%'}}>
                                    {saleTypeObj[ciform.sale_type_id] ? saleType ? saleType : 'Loading...' : "-"}
                                </div>
                            </div>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    LEAD SOURCE
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>
                                    {leadSourceObj[ciform.lead_source_id] ? leadSource ? leadSource : 'Loading...' : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    SALES CONSULTANT
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '19%'}}>
                                    {scNameObj[ciform.sales_consultant_id] ? scName ? scName : 'Loading...' : "-"}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    SALES MANAGER
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '20%'}}>
                                    {salesManagerObj[ciform.sales_manager_id] ? salesManager ? salesManager : 'Loading...' : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    CUSTOMER DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    CUSTOMER NAME
                                </div>
                                <div className='tdPrint fontSetBoldPrint rightBorderPrint bottomBorderPrint' style={{width: '55%'}}>
                                    {(customer_name !== "" && customer_name !== null) ? customer_name ? customer_name : "Loading..." : "-"}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '12%'}}>
                                    CUSTOMER ID
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '13%'}}>
                                    {customer_name ? customer_cd ? customer_cd : 'N/A' : 'Loading...'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                REGISTRATION ADDRESS
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '80%'}}>
                                    {customer_name ? cust_registration_address ? cust_registration_address : '-' : 'Loading...'}
                                </div>
                            </div>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                PERMANENT ADDRESS
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '80%'}}>
                                    {customer_name ? cust_permanent_address ? cust_permanent_address : '-' : 'Loading...'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    MOBILE NO.
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                    {customer_name ? cust_mobele_no ? cust_mobele_no : '-' : 'Loading...'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    EMAIL ID
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '25%'}}>
                                    {customer_name ? cust_email_id ? cust_email_id : '-' : 'Loading...'}
                                </div>
                                <div className='tdPrint bottomBorderPrint' style={{width: '15%'}}>
                                  
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                  
                                </div>
                            </div>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    GST NO.
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                    {customer_name ? cust_gst_no ? cust_gst_no : '-' : 'Loading...'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    PAN NO.
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '25%'}}>
                                    {customer_name ? cust_pan_no ? cust_pan_no : '-' : 'Loading...'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '15%'}}>
                                    D.O.B
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                    {ciform.customer_dob ? displayDate(ciform.customer_dob) : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    VEHICLE DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    VARIANT
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '90%'}}>   
                                    {ciform.variant ? ciform.variant : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    MODEL
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '35%'}}>
                                {ciform.model_no ? ciform.model_no : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '15%'}}>
                                    CHASSIS/VIN No.
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                    {ciform ? ciform.vin_on ? ciform.vin_on : 'Loading...' : '-'}
                                </div>
                                <div className='tdPrint bottomBorderPrint' style={{width: '10%'}}>
        
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '15%'}}>
                                   
                                </div>
                            </div>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    COLOR
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '35%'}}>
                                    {ciform.colour ? ciform.colour : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '12%'}}>
                                    ENGINE NO.
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '13%'}}>
                                    {ciform.engine_no ? ciform.engine_no : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '10%'}}>
                                    FUEL TYPE
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                    {ciform.fuel_type ? ciform.fuel_type : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    FINAL DEAL DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint setTableCellLineHeightPrint' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint' style={{width: '65%'}}>
                                    <div className='tablePrint' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printCenterAlign printTableSubNextHeader' style={{width: '100%'}}>
                                                INFLOW
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                EX SHOW ROOM PRICE
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.ex_showroom ? displayAmtInLakh(ciform.ex_showroom) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                CASH DISC
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.out_cash_disc ? displayAmtInLakh(ciform.out_cash_disc) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                TCS
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.tcs ? displayAmtInLakh(ciform.tcs) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                {/* FOC ACCESSORIES */}
                                                OTHER DISC
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {/* {ciform.out_foc_acc ? displayAmtInLakh(ciform.out_foc_acc) : displayAmtInLakh(0)} */}
                                                {ciform.inflow_other_discount ? displayAmtInLakh(ciform.inflow_other_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                AMC PLAN
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.sot ? displayAmtInLakh(ciform.sot) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                                {/* OTHER DISC */}
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint alignRightPrint' style={{width: '15%'}}>
                                                {/* {ciform.inflow_other_discount ? displayAmtInLakh(ciform.inflow_other_discount) : displayAmtInLakh(0)} */}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                INSURANCE
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.insurance ? displayAmtInLakh(ciform.insurance) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                               
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint  alignRightPrint' style={{width: '15%'}}>
                                              
                                            </div>
                                                   
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                RTO
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.rto ? displayAmtInLakh(ciform.rto) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>                                            
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                PASSING CHARGES
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.passing_charges ? displayAmtInLakh(ciform.passing_charges) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint ' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                HYPOTHECATION CHARGES
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.hypothecation_charges ? displayAmtInLakh(ciform.hypothecation_charges) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                M.TAX
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.m_tax ? displayAmtInLakh(ciform.m_tax) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                            
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                EX-WARRANTY
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.ex_warranty ? displayAmtInLakh(ciform.ex_warranty) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint topBorderPrint' style={{width: '35%'}}>
                                                BASIC PURCHASE
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint topBorderPrint' style={{width: '15%'}}>
                                                {ciform.purchase_basic ? displayAmtInLakh(ciform.purchase_basic) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                RSA
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.rsa ? displayAmtInLakh(ciform.rsa) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                BASIC RETAIL
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.ex_showroom_without_gst ? displayAmtInLakh(ciform.ex_showroom_without_gst) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                BASIC KIT
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.basic_kit ? displayAmtInLakh(ciform.basic_kit) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                ACTUAL EXSHOWROOM
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {/* {actualShowRoom ? displayAmtInLakh(actualShowRoom) : displayAmtInLakh(0)} */}
                                                {ciform.ex_shrm_wo_gst_n_disc ? displayAmtInLakh(ciform.ex_shrm_wo_gst_n_disc) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                PRICE DIFF.
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.price_diff ? displayAmtInLakh(ciform.price_diff) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                PAID ACCESSORIES
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.paid_acc ? displayAmtInLakh(ciform.paid_acc) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                FASTAG
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.fastag ? displayAmtInLakh(ciform.fastag) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                HSRP
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.hsrp ? displayAmtInLakh(ciform.hsrp) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                OTHERS 1
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.others_1 ? displayAmtInLakh(ciform.others_1) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                OTHERS 2
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.others_2 ? displayAmtInLakh(ciform.others_2) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                OTHERS 3
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.others_3 ? displayAmtInLakh(ciform.others_3) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                OTHERS 4
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.others_4 ? displayAmtInLakh(ciform.others_4) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint finalAmountBlockPrint' style={{width: '35%'}}>
                                                ON ROAD
                                            </div>
                                            <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint finalAmountBlockPrint' style={{width: '15%'}}>
                                                {ciform.on_road ? displayAmtInLakh(ciform.on_road) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint bottomBorderPrint' style={{width: '35%'}}>
                                            &nbsp;
                                            </div>
                                            <div className='tdPrint bottomBorderPrint rightBorderPrint' style={{width: '15%'}}>
                                            &nbsp;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tdPrint' style={{width: '35%'}}>
                                    <div className='tablePrint' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printCenterAlign printTableSubNextHeader' style={{width: '100%'}}>
                                                OUTFLOW
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                BROKERAGE
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.out_brokerage ? displayAmtInLakh(ciform.out_brokerage) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                EXCHANGE DISC
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.out_exchange_disc ? displayAmtInLakh(ciform.out_exchange_disc) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                USED CAR VALUE
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.used_car_value ? displayAmtInLakh(ciform.used_car_value) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                LOYALTY DISC
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.inflow_loyalty_discount ? displayAmtInLakh(ciform.inflow_loyalty_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                CORPORATE DISC
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.inflow_corporate_discount ? displayAmtInLakh(ciform.inflow_corporate_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                                ADDITIONAL DISC
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                                {ciform.outflw_adsnl_discount ? displayAmtInLakh(ciform.outflw_adsnl_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint' style={{width: '70%'}}>
                                              
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint alignRightPrint' style={{width: '30%'}}>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint bottomBorderPrint heightPrint90px remarkHeightOnly' style={{width: '100%'}}>
                                            {/* {ciform.remarks ? ciform.remarks : '-'} */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printCenterAlign printTableSubNextHeader' style={{width: '100%'}}>
                                                SUPPORT
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                EXCHANGE
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.exchange_discount ? displayAmtInLakh(ciform.exchange_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                CORPORATE
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.corporate_discount ? displayAmtInLakh(ciform.corporate_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                LOYALTY
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.loyalty_discount ? displayAmtInLakh(ciform.loyalty_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                WARRANTY
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.warranty_discount ? displayAmtInLakh(ciform.warranty_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                RSA
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.rsa_discount ? displayAmtInLakh(ciform.rsa_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                INSURANCE
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.insurance_discount ? displayAmtInLakh(ciform.insurance_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                        <div className='trPrint'>
                                            <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '70%'}}>
                                                RETAIL SUPPORT
                                            </div>
                                            <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '30%'}}>
                                                {ciform.retail_support_discount ? displayAmtInLakh(ciform.retail_support_discount) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    DEAL SUMMARY
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                    INFLOW / ON ROAD
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                    {summaryInflow ? displayAmtInLakh(summaryInflow) : displayAmtInLakh(0)}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '35%'}}>
                                    RECEIVABLE
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '15%'}}>
                                    {summaryRecivable ? displayAmtInLakh(summaryRecivable) : displayAmtInLakh(0)}
                                </div>
                            </div>                          
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    NOMINEE DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '15%'}}>
                                    NOMINEE NAME
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '35%'}}>
                                    {ciform.nominee_name ? ciform.nominee_name : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '14%'}}>
                                    RELATIONSHIP
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '21%'}}>
                                    {ciform.nominee_relationship ? ciform.nominee_relationship : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '6%'}}>
                                    AGE
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '9%'}}>
                                    {ciform.nominee_age ? ciform.nominee_age : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    FINANCE DETAILS
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    IN HOUSE / SELF / CASH
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                {ciform.through_us ? ((ciform.through_us === "INH" || ciform.through_us === "inh" )? "IN HOUSE" : ((ciform.through_us === "SEL" || ciform.through_us === "sel") ? "SELF" : ((ciform.through_us === "CAS" || ciform.through_us === "cas") ? "CASH" : "-"))) : '-'}
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    BANK NAME
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                    {bankName ? bankName : '-'}
                                </div>
                            </div>
                            <div className='trPrint'>
                            {
                                ciform.through_us === "INH" || ciform.through_us === "SEL" || ciform.through_us === "inh" || ciform.through_us === "sel"  ? 
                                <>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    FINANCE CONSULTANT
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                    {finSCName ? finSCName : '-'}
                                </div>
                                </>
                                : null
                            }
                            {
                                ciform.through_us === "CAS" || ciform.through_us === "cas"   ? 
                                <>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    Type
                                </div>
                                <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                    {ciform.through_us_type ? ciform.through_us_type : '-'}
                                </div>
                                </>
                                : null
                            }
                                <div className='tdPrint rightBorderPrint bottomBorderPrint' style={{width: '20%'}}>
                                    BRANCH NAME
                                </div>
                                <div className='tdPrint fontSetBoldPrint bottomBorderPrint' style={{width: '30%'}}>
                                    {ciform.finc_branch_name ? ciform.finc_branch_name : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint setTableCellLineHeightPrint' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint' style={{width: '70%'}}>
                                    <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                                ACCESSORIES DETAILS
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tdPrint topAlignPrint' style={{width: '30%'}}>
                                    <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                                REMARKS
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                       
                        <div className='tablePrint setTableCellLineHeightPrint' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint' style={{width: '70%'}}>
                                    <div className='tablePrint' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printTableSubNextHeader rightBorderPrint paddingLeftSet5' style={{width: '10%'}}>
                                                SR NO.
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader printCenterAlign rightBorderPrint' style={{width: '40%'}}>
                                                ACCESSORIES
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader alignRightPrint rightBorderPrint' style={{width: '25%'}}>
                                                PAID
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader alignRightPrint rightBorderPrint' style={{width: '25%'}}>
                                                FOC
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                    {
                                        stringArray.map((objectS, key1) => {
                                            let accessories = '',
                                                paid_inflow = '',
                                                foc_outflow = '',
                                                amount= ''
                                            accdetails.map((obj, key) => {
                                                if(parseInt(key1, 10) === parseInt(key, 10)){
                                                    accessories = obj.accessories
                                                    paid_inflow = obj.paid_inflow
                                                    amount = obj.amount
                                                    totalPaid = parseFloat(totalPaid) + parseFloat(amount)
                                                    foc_outflow = parseFloat(0)
                                                }
                                            })
                                            return(
                                                <div className='trPrint'>
                                                    <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint paddingLeftSet5' style={{width: '10%'}}>
                                                        {parseInt(key1, 10) + 1}
                                                    </div>
                                                    <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint' style={{width: '40%'}}>
                                                        {accessories}
                                                    </div>
                                                    <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '25%'}}>
                                                        {amount}
                                                    </div>
                                                    <div className='tdPrint rightBorderPrint fontSetBoldPrint bottomBorderPrint alignRightPrint' style={{width: '25%'}}>
                                                        {foc_outflow}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                    <div className='tablePrint' style={{width: '100%'}}>
                                        <div className='trPrint'>
                                            <div className='tdPrint printTableSubNextHeader rightBorderPrint paddingLeftSet5' style={{width: '10%'}}>
                                                TOTAL
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader printCenterAlign rightBorderPrint' style={{width: '40%'}}>
                                                &nbsp;
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader alignRightPrint rightBorderPrint' style={{width: '25%'}}>
                                                {totalPaid ? displayAmtInLakh(totalPaid) : displayAmtInLakh(0)}
                                            </div>
                                            <div className='tdPrint printTableSubNextHeader alignRightPrint rightBorderPrint' style={{width: '25%'}}>
                                                {totalFoc ? displayAmtInLakh(totalFoc) : displayAmtInLakh(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='tdPrint' style={{width: '30%'}}>&nbsp;</div> */}
                                <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                                    <div className='trPrint'>
                                        <div className='tdPrint' style={{width: '100%'}}>
                                            {ciform.remarks ? ciform.remarks : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint printTableSubHeader' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint printCenterAlign' style={{width: '100%'}}>
                                    CI VERIFICATION
                                </div>
                            </div>
                        </div>
                        <div className='tablePrint fontBodySet10' style={{width: '100%'}}>
                            <div className='trPrint'>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint printCenterAlign valignMiddlePrint fontSetBoldPrint' style={{width: '25%'}}>
                                    ---------------------------------------------------<br/>
                                    SALES CONSULTANT SIGNATURE<br/><br/>
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint printCenterAlign valignMiddlePrint fontSetBoldPrint' style={{width: '25%'}}>
                                    ---------------------------------------------------<br/>
                                    SALES MANAGER SIGNATURE<br/><br/>
                                </div>
                                <div className='tdPrint rightBorderPrint bottomBorderPrint printCenterAlign valignMiddlePrint fontSetBoldPrint' style={{width: '25%'}}>
                                    ---------------------------------------------------<br/>
                                    TEAM LEADER SIGNATURE<br/><br/>
                                </div>
                                <div className='tdPrint bottomBorderPrint printCenterAlign valignMiddlePrint fontSetBoldPrint' style={{width: '25%'}}>
                                    ---------------------------------------------------<br/>
                                    AUTHORIZED SIGNATURE<br/><br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )}
}

export default CiFormPrint;
