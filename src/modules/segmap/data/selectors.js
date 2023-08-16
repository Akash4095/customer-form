import { startsWith, cloneDeep } from "lodash";
import { othersArrayValues, segmap } from './model'


export const getIsFetchingSegmap = (state, props) => state.segmap.params.isFetching
export const getIsSegmapFetched = (state, props) => state.segmap.params.segmapFetched
export const getSegmapList = (state, props) => state.segmap.byId
export const getOthersList = (state, props) => state.segmap.fetchedOthersList
export const getOthersSavedRes = (state, props) => state.segmap.savedOthers
export const getNotification = (state, id) => state.segmap.notifications[id]


export const getSegmap = (state, props) => {
    if (props.match.path === "/segmap/create") {
        return segmap()
    }
    if (props.match.path === "/segmap/edit/:id") {
        let _id = props.match.params.id
        let obj = cloneDeep(state.segmap.byId[_id])
        return obj
    }
    if (props.match.path === "/segmap/clone/:id") {
        let _id = props.match.params.id
        let obj = cloneDeep(state.segmap.byId[_id])
        return obj
    }
}

export const getOthers = (state, props, otherList) => {
    let object = segmap()
    if (otherList && otherList !== null && otherList !== undefined && otherList.length > 0) {
        object.others = otherList
    } else {
        object.others = [othersArrayValues()]
    }
    return object
}

export const getSegmapParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/segmap/create')) {
        params.title = state.segmap.params.createTitle
        params.submitButtonText = state.segmap.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/segmap/clone')) {
        params.title = state.segmap.params.createTitle
        params.submitButtonText = state.segmap.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/segmap/edit')) {
        params.title = state.segmap.params.editTitle
        params.submitButtonText = state.segmap.params.editSubmitButtonText
    };

    return params
}

export const selectSegmap = (state, props) => {
    const segmap = state.segmap.byId
    const keys = Object.keys(segmap)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: segmap[key].name }
    });
    return obj

}