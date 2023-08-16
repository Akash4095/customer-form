import { startsWith, cloneDeep, at } from 'lodash';
import { saletype } from './model'


export const getIsFetchingSaleType = (state, props) => state.saletype.params.isFetching;
export const getIsSaleTypeFetched = (state, props) => state.saletype.params.saleTypeFetched;
export const getAssettypeList = (state, prop) => state.saletype.byListId
export const getAssettypeObj = (state, id) => state.saletype.byListId[id]

export const getNotification = (state, id) => state.saletype.notifications[id]


export const getSaleType = (state, props) => {
    if(props.match.path==='/sale-type/create'){
        return saletype()
    }
    if(props.match.path==='/sale-type/edit/:id'){
        let _id = props.match.params.id
        let obj = cloneDeep(state.saletype.byListId[_id]);
        return obj        
    }
}

export const getSaleTypeParams = (state, props) => {
    const params =  {}

    if(startsWith(state.router.location.pathname,'/sale-type/create')){ 
        params.title = state.saletype.params.createTitle
        params.submitButtonText = state.saletype.params.createSubmitButtonText        
    };

    if(startsWith(state.router.location.pathname,'/sale-type/edit/')){ 
        params.title = state.saletype.params.editTitle
        params.submitButtonText = state.saletype.params.editSubmitButtonText        
    };

    return params
}



export const selectSaleType = (state, props ) => {
    const saletype = state.saletype.byListId
    const keys = Object.keys(saletype)
    const obj = keys.map( (key) => { 
        return { key : key,  value : key, text : saletype[key].saletype_name }
    });
    return obj
            
}