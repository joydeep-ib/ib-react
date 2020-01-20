import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { interviewsReducer } from './interviews';
import { participantReducer } from './participants';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    interviews: interviewsReducer,
    participants: participantReducer,
});

export default rootReducer;