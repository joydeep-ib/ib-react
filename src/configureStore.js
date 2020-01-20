import { createBrowserHistory } from "history";
import { compose, createStore, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

export default function configureStore(initState) {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        createRootReducer(history),
        initState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history),
                thunk,
            ),
        ),
    )
}