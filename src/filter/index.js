import Vue from 'vue';
import timeago from 'timeago.js';

var timeagoInstance = timeago();

/**
 * 数字截断.
 * 5位数的用 ‘1w+' 这种方法表示，六位数及以上的用 '10w+' 表示
 */
export var shorten = Vue.filter('shorten', function(value) {
    if (value >= 10000 && value <= 99999) {
        return value.toString().slice(0, 1) + 'w+';
    } else if (value > 99999) {
        return '10w+'
    }
    return value.toString();
});

/**
 * timeago的格式化.
 * 一个月以前的显示yyyy-mm-dd的，一个月内的用timeago格式化
 */
export var ago = Vue.filter('ago', function(value) {
    var now = new Date();
    var oneMonth = 1000 * 60 * 60 * 24 * 30;
    if (now.getTime() - new Date(value).getTime() > oneMonth) {
        return value.split('T')[0];
    } else {
        return timeagoInstance.format(value, 'zh_CN');
    }
});