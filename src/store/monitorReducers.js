const round = number => Math.round(number * 100) / 100

const monitorReducerEnhancer = createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const monitoredReducer = (state, action) => {
    const start = performance.now()
    const newState = reducer(state, action)
    const end = performance.now()
    const diff = round(end - start)

    console.log('reducer process time:', diff)
    if(action){
      if(action.payload){
        if(action.payload.location){
          if(action.payload.location.pathname){
            if(action.payload.location.pathname === "/"){
              if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
                if(document.getElementsByClassName("markedMenuOpt")[0].classList){
                  console.log(document.getElementsByClassName("markedMenuOpt")[0].classList)
                  document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
                }
              }
            }
          }
        }
      }
    }
    return newState
  }

  return createStore(monitoredReducer, initialState, enhancer)
}

export default monitorReducerEnhancer