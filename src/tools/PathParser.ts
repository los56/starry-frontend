
export function getId() {
    const paths = window.location.pathname.split('/');
    for(let k of paths) {
        if(k.length === 32) {
            return k;
        }
    }
    return null;
}

export function getQueries() {
    const arr = window.location.search.slice(1).split('&');
    const obj: any = {};
    for(let s of arr) {
        const _t = s.split("=");
        obj[_t[0]] = _t[1];
    }

    return obj;
}