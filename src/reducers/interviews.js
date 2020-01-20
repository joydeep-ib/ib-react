import {
  FETCH_INTERVIEWS_START,
  FETCH_INTERVIEWS_ERROR ,
  FETCH_INTERVIEWS_SUCCESS
} from '../constants/index';

const initialState = {
  loading: true,
  interviews: {},
}

export const interviewsReducer = (state = initialState, action) => {
  if (action.type === FETCH_INTERVIEWS_START) {
    return {
      ...state,
      loading: true,
    }
  }

  if (action.type === FETCH_INTERVIEWS_SUCCESS) {
    return {
      ...state,
      loading: false,
      interviews: action.payload,
    }
  }

  return state;
}

