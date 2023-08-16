export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('taskState')
      if (serializedState === null){
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveState = (state) => {
    try{
      const serializedState = JSON.stringify(state)
      localStorage.setItem('taskState',serializedState)
    } catch (err) {
      // ignore write error
    }
  }