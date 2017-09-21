import {
    SAVE_TOKEN,
    SAVE_INFO,
    LOGOUT
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
    }
};
