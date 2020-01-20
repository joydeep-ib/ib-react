import {
    FETCH_PARTICIPANTS_START,
    FETCH_PARTICIPANTS_SUCCESS
} from '../constants';

const initialState = {
    loading: true,
    interviews: {},
};

export const participantReducer = (state=initialState, action) => {
    if (action.type === FETCH_PARTICIPANTS_START) {
        return {
            ...state,
            loading: true,
        }
    }
    if (action.type === FETCH_PARTICIPANTS_SUCCESS) {
        return {
            ...state,
            loading: false,
            participants: action.payload
        }
    }

    return state;
}