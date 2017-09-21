var strategyList = {
    required(str) {
        return str.length > 0;
    },
    lengthScope(str, min, max) {
        if (!min) {
            return str.length <= max;
        } else if (!max) {
            return str.length >= min;
        } else {
            return str.length >= min
                && str.length <= max
        }
    },
    isEmail(str) {
        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        return reg.test(str);
    },
    isTel(str) {
        var reg = '';
        return reg.test(str);
    }
};

export default function Validate() {
    this.errBreak = false;
    this.middleware = function() {};
}

Validate.prototype = {
    constructor: Validate,
    exec(value, strategy, msg) {
        if (this.errBreak) {
            return;
        }
        var errorMsg = msg;
        var args = value.split(':');
        if (strategyList[strategy].apply(this, args)) {
            errorMsg = '';
        } else {
            this.errBreak = true;
        }
        this.middleware(errorMsg);
    },
    use(cb) {
        this.middleware = cb;
    }
};

export default Validate;