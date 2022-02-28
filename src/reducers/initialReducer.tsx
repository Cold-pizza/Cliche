export interface InintalStateIprops {
    music: null | [];
}

type ReducerType = (
    state: InintalStateIprops,
    action: { type: {}; payload: {} }
) => void;

const initialState: InintalStateIprops = {
    music: null,
};

const SET_MUSIC = "SET_MUSIC";

const initialReducer: ReducerType = function (state = initialState, action) {
    switch (action.type) {
        case SET_MUSIC:
            return { ...state, music: action.payload };

        default:
            return state;
    }
};

export default initialReducer;
