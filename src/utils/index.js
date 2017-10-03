export function isIE() {
    var ua = navigator.userAgent.toLocaleLowerCase();
    var e = -1 !== ua.indexOf("msie") || !!ua.match(/trident\/7\./) || -1 !== ua.indexOf("edge");
    if (e) {
        var t = e && !+[1]
        , o = 6
        , r = document.documentMode;
        if (r) {
            switch (r) {
                case 6:
                o = 6;
                break;
                case 7:
                o = 7;
                break;
                case 8:
                o = 8;
                break;
                case 9:
                o = 9;
                break;
                case 10:
                o = 10;
                break;
                case 11:
                o = 11
            }
        }
        else {
            if (-1 !== navigator.userAgent.toLocaleLowerCase().indexOf("edge"))
                return o = "edge";
            t && !XMLHttpRequest ? o = 6 : t && !document.documentMode && (o = 7),
            t && document.documentMode && (o = 8),
            !t && function() {
                return !!this
            }() && (o = 9),
            e && document.attachEvent && function() {
                return !this
            }() && (o = 10),
            e && !document.attachEvent && (o = 11)
        }
        return o
    }
    return !1
}