import {
    SAVE_TOKEN,
    SAVE_INFO,
    LOGOUT,
    TOGGLE_UNREAD_MSG_STATE,
    SWITCH_LOGIN_MODAL
} from './mutation-types';
import { ls } from '@/utils/store';

export default {
    [SAVE_TOKEN] (state, token) {
        state.token = token;
    },
    [SAVE_INFO] (state, {name, id, avatar}) {
        state.userInfo = {
            name,
            id,
            avatar
        }
    },
    [LOGOUT] (state) {
        state.userInfo = {};
        state.token = '';
        ls.remove('token');
    },
    [TOGGLE_UNREAD_MSG_STATE] (state, unreadState) {
        state.hasUnreadMsg = unreadState;
    },
    [SWITCH_LOGIN_MODAL] (state, isShowed) {
        state.isShowedLoginDialog = isShowed;
    }
};
