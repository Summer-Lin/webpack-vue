export function getUrlParams(search) {
    if (!search) search = window.location.search
    var hashes = search.slice(search.indexOf('?') + 1).split('&')
    var params = {}
    hashes.map(function (hash) {
        var hashDict = hash.split('=')
        var key = hashDict[0]
        var val = hashDict[1]
        params[key] = decodeURIComponent(val)
    })

    return params
}


function toUrl(str, query) {
    window.location.href = (query)? str + '?' + query : str
}

function toBindCard() {
    toUrl('/terminal/citic/toBindCard')
}

export function dateFormat (_date, format) {
    var date = _date instanceof Date ? _date : new Date(_date)
    var dateExtra = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": String(date.getHours()).padStart(2, '0'),
        "m+": String(date.getMinutes()).padStart(2, '0'),
        "s+": String(date.getSeconds()).padStart(2, '0'),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length))
    }
    for (var k in dateExtra) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? dateExtra[k] : ('00' + dateExtra[k]).substr(dateExtra[k].toString().length))
        }
    }
    return format
}

export class storage  {

    static setItem(key, val) {
        window.localStorage.setItem(key, val)
    }

    static getItem(key) {
        return window.localStorage.getItem(key)
    }

    static removeItem(key) {
        window.localStorage.removeItem(key)
    }

    static clear() {
        window.localstorage.clear()
    }
}



