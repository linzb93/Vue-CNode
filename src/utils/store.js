// 操作localStrorage值
function store(name, value) {
    if (!name) {
        return;
    }
    if (arguments.length === 1) {
        return localStorage.getItem(name);
    } else if (arguments.length === 2) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        return localStorage.setItem(name, value);
    }
}

function remove(name) {
    localStorage.removeItem(name);
}

;

export var ls = {
    store,
    remove
}