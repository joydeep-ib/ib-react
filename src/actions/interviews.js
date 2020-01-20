import {
  FETCH_INTERVIEWS_START,
  FETCH_INTERVIEW_SUCCESS,
  FETCH_INTERVIEWS_ERROR,
  FETCH_INTERVIEWS_SUCCESS
} from '../constants/index'

export const InterviewFetchStart = (payload) => {
  return {
    type: FETCH_INTERVIEWS_START,
  }
}

export const InterviewFetchSuccess = (payload) => {
  return {
    type: FETCH_INTERVIEWS_SUCCESS,
    payload,
  }
}

export const InterviewFetchError = (payload) => {
  return {
    type: FETCH_INTERVIEWS_ERROR,
    payload,
  }
}

export const fetchInterviews = () => async dispatch => {
  dispatch(InterviewFetchStart);
  try {
    const _interviews = await fetch('/api/v1/interviews');
    const _interviewsJSON = await _interviews.json();
    dispatch(InterviewFetchSuccess(_interviewsJSON));
  } catch (err) {
    dispatch(InterviewFetchError(err));
  }
}