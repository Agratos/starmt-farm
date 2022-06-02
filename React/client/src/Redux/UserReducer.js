import { USER_STATE } from '../Status/UserState';
import { EMAIL, MAKEUSERKEY, MAKECHANNELKEY } from '../Action/UserAction';
import { combineReducers } from 'redux';

function userstate(state = USER_STATE, action) {
    switch(action.type) {
        case EMAIL:
            return{
                ...state,
                email: action.useremail,
            }
        case MAKEUSERKEY:
            return{
                ...state,
                userkey: action.userkey
            }
        case MAKECHANNELKEY:
            return{
                ...state,
                channelkey: action.channelkey
            }
        default:
            return state;  
    }
}

const userReducer = combineReducers({ userstate });
export default userReducer