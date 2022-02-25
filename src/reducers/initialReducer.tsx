export interface InintalStateIprops {
    music: null | [];
}

type ReducerType = (state: {}, action: {type: {}}) => void;

const initialState:InintalStateIprops = {
    music: null
}

const initialReducer:ReducerType = function(state = initialState, action) {
    switch (action.type) {

        

        default:
            return state;

    }
}

export default initialReducer