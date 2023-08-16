import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Notification = ({ id, notifySelector, type, notifyDoneAction, setCiFormDataId, resetForm }, props) => {
    const notifyObj = useSelector(state => notifySelector(state, id))
    const dispatch = useDispatch()
    useEffect(() => {
        if (id !== 0 && notifyObj) {
            const options = {
                className:"toast-position",
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true
            }
            const getNotObj = type === "save" ? notifyObj.save : type === "edit" ? notifyObj.edit : type === "delete" ? notifyObj.delete : {}
            if(getNotObj){
                if(setCiFormDataId){
                    if(getNotObj.status === "success" || getNotObj.status === "Success"){
                        setCiFormDataId(id)
                    }
                }
                if (getNotObj.status === "success" || getNotObj.status === "Success") {
                    if (resetForm) {
                        resetForm()
                    }
                }
                toast[getNotObj.status](getNotObj.msg, options);
                dispatch(notifyDoneAction({ id, type }))
            }
        }
    })
    if (notifyObj) {
        return (
            <ToastContainer />
        )
    } else return null
}

export default Notification;