import service from './entry';

/**
 * 函数参数的设计规范：
 * 1. 只传2个及以内数量非Object类型参数的，直接写。
 *    参数位置遵守顺序，例如token和id，token在前，id在后。
 * 2. 传2个以上的，放入一个Object参数内，参数位置按接口提供方提供的顺序填写。
 *    Object的属性和接口提供的属性同名。
 */

// 主题首页
export function getTopicList(tab, page = 0) {
    return service.get('/topics', {
        params: {
            page,
            tab,
            limit: 20,
            mdrender: false
        }
    });
}

// 主题详情
export function getTopicDetail(accesstoken, id) {
    return service.get('/topic/' + id, {
        params: {
            accesstoken
        }
    });
}

// 新建主题
export function createNewTopic(option) {
    var tab = process.env.NODE_ENV === 'development'
        ? 'dev'
        : option.tab
    return service.post('/topics', {
        accesstoken: option.accesstoken,
        title: option.title,
        tab,
        content: option.content
    });
}

// 编辑主题
export function updateTopic(option) {
    var tab = process.env.NODE_ENV === 'development'
    ? 'dev'
    : option.tab
    return service.post('/topics/update', {
        accesstoken: option.accesstoken,
        topic_id: option.topic_id,
        title: option.title,
        tab,
        content: option.content
    });
}

// 主题收藏
export function collectTopic(accesstoken, topic_id) {
    return service.post('/topic_collect/collect', {
        accesstoken,
        topic_id
    });
}

// 取消收藏主题
export function decollectTopic(accesstoken, topic_id) {
    return service.post('/topic_collect/de_collect', {
        accesstoken,
        topic_id
    });
}

// 获取用户收藏的主题
export function getUserCollect(username) {
    return service.get('topic_collect/' + username);
}

// 新建评论
export function createReply(option) {
    return service.get('topic/' + option.topic_id + '/replies', {
        params: {
            accesstoken: option.accesstoken,
            content: option.content,
            reply_id: option.reply_id
        }
    });
}

// 为评论点赞
export function upReply(accesstoken, reply_id) {
    return service.post('/reply/' + reply_id + '/ups', {
        accesstoken
    });
}

// 用户详情
export function getUserDetail(loginName) {
    return service.get('/user/' + loginName);
}

// 验证accessToken的正确性
export function tokenValidate(accesstoken) {
    return service.post('/accesstoken', {
        accesstoken
    });
}

// 获取未读消息数
export function getUnreadMsgCount(accesstoken) {
    return service.get('/message/count', {
        params: {
            accesstoken
        }
    });
}

// 获取已读和未读消息
export function getAllMsg(accesstoken) {
    return service.get('/messages', {
        params: {
            accesstoken,
            mdrender: false
        }
    });
}

// 标记所有消息为已读
export function markAllMsgRead(accesstoken) {
    return service.post('/message/mark_all', {
        accesstoken
    });
}

// 标记一条消息为已读
export function markOneMsgRead(accesstoken, msg_id) {
    return service.post('/message/mark_one/' + msg_id, {
        accesstoken
    });
}
