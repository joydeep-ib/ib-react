import {
    FETCH_PARTICIPANTS_START,
    FETCH_PARTICIPANTS_SUCCESS,
    FETCH_PARTICIPANTS_ERROR,
} from "../constants";

export const ParticipantsFetchStart = ()  => {
    return {
        type: FETCH_PARTICIPANTS_START,
    }
}
export const ParticipantsFetchSuccess = (payload) => {
    return {
        type: FETCH_PARTICIPANTS_SUCCESS,
        payload,
    }
}
export const ParticipantsFetchError = (payload) => {
    return {
        type: FETCH_PARTICIPANTS_ERROR,
        payload,
    }
}

export const fetchParticipants = () => async dispatch => {
    dispatch(ParticipantsFetchStart);
    try {
        const _participants = await fetch('/api/v1/participants');
        const _participantsJSON = await _participants.json()
        dispatch(ParticipantsFetchSuccess(_participantsJSON));
    } catch(err) {
        dispatch(ParticipantsFetchError(err));
    }
}