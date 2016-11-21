import * as actionTypes from "../constants/userConstants";
import * as viewActions from "./ViewActions";

var csrfToken = csrf;
var csrfHeader = 'X-CSRF-TOKEN';
var headers = {};
headers[csrfHeader] = csrfToken;

export const getUsers = (communityTitle) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_USERS_REQUEST
        });
        $
            .ajax({
                url: '/api/user/get_subscribed_users?communityTitle=' + communityTitle,
                type: 'post',
                headers: headers
            })
            .then((response, status, xhr) => {
                dispatch({
                    type: actionTypes.GET_USERS_SUCCESS,
                    payload: response
                })
            })
            .fail((xhr, status, error) => {
                dispatch({
                    type: actionTypes.GET_USERS_FAILURE,
                    payload: error
                })
            })
    };
};

export const logIn = (userCredentials) => {
    return dispatch => {
        dispatch({
            type: actionTypes.LOG_IN_REQUEST
        });
        let data = `username=${userCredentials.username}&password=${userCredentials.password}`;
        $
            .ajax({
                url: '/login',
                type: 'post',
                data: data,
                headers: headers
            })
            .then((response, status, xhr) => {
                dispatch({
                    type: actionTypes.LOG_IN_SUCCESS
                });
                dispatch(viewActions.hideLogInDialog())
            })
            .fail((xhr, status, error) => {
                dispatch({
                    type: actionTypes.LOG_IN_FAILURE,
                    payload: error
                })
            })
    }
};

export const logOut = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.LOG_OUT_REQUEST
        });
        $
            .ajax({
                url: '/logout',
                type: 'post',
                headers: headers
            })
            .then((response, status, xhr) => {
                dispatch({
                    type: actionTypes.LOG_OUT_SUCCESS
                })
            })
            .fail((xhr, status, error) => {
                dispatch({
                    type: actionTypes.LOG_OUT_FAILURE,
                    payload: error
                })
            })
    }
};

export const checkAuthorization = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CHECK_AUTHORIZATION_REQUEST
        });
        $
            .ajax({
                url: '/api/user/check_authorization',
                type: 'get'
            })
            .then((response, status, xhr) => {
                dispatch({
                    type: actionTypes.CHECK_AUTHORIZATION_SUCCESS,
                    payload: response
                })
            })
            .fail((xhr, status, error) => {
                dispatch({
                    type: actionTypes.CHECK_AUTHORIZATION_FAILURE,
                    payload: error
                })
            })
    }
};

export const addUser = (user) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.ADD_USER_REQUEST
        });
        $
            .ajax({
                url: '/api/user/add',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(user),
                headers: headers
            })
            .then((response, status, xhr) => {
                let location = xhr.getResponseHeader('location');
                dispatch({
                    type: actionTypes.ADD_USER_SUCCESS,
                    payload: location
                });
                dispatch(viewActions.hideSignUpDialog());
            })
            .fail((xhr, status, error) => {
                dispatch({
                    type: actionTypes.ADD_USER_FAILUER,
                    payload: error
                })
            })
    }
};