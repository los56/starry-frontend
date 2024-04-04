import axios, { AxiosError } from 'axios';

export async function get(url: string) {
    const res = await axios.get(url);
    if(res.status === 200) {
        return res.data;
    } else {
        switch(res.status) {
            case 401:
            case 403:
                throw Error("Auth need");
            case 404:
                throw Error("Not found");
            case 500:
                throw Error("Internal server error");
        }
    }
}

export async function post(url: string, payload: object) {
    const res = await axios.post(url, payload);
    switch(res.status) {
        case 200:
            return res.data;
        case 401:
        case 403:
            throw Error("Auth need");
        case 404:
            throw Error("Not found");
        case 500:
            throw Error("내부 서버 오류입니다.");
    }
}

export async function authGet(url: string): Promise<any> {
    const cookies: any = getCookies();

    if(!cookies.accessToken) {
        throw Error("로그인이 필요합니다.");
    }

    try { 
        const res = await axios.get(url, {headers: {Authorization: `Bearer ${cookies.accessToken}`}});
        return res.data;
    } catch(error) {
        const axiosError = error as AxiosError;
        switch(axiosError.response?.status) {
            case 401:
                const reissued = await reissue();
                if(!reissued) {
                    throw Error("로그인이 필요합니다.");
                }
                return await authGet(url);
            case 403:
                throw Error("권한이 없습니다.")
            case 500:
                throw Error("내부 서버 오류입니다.")
        }
    }
}

export async function authPost(url: string, payload: object): Promise<any> {
    const cookies = getCookies();

    if(!cookies.accessToken) {
        throw Error("로그인이 필요합니다.");
    }
    try {
        const res = await axios.post(url, payload, {headers: {Authorization: `Bearer ${cookies.accessToken}`}});  
        return res.data;
    } catch(error) {
        const axiosError = error as AxiosError;
        switch(axiosError.response?.status) {
            case 401:
                const reissued = await reissue();
                if(!reissued) {
                    throw Error("로그인이 필요합니다.");
                }
                return await authPost(url, payload);
            case 403:
                throw Error("권한이 없습니다.")
            case 500:
                throw Error("내부 서버 오류입니다.")
        }
    }
}

export async function reissue() {
    const cookies = getCookies();

    if(!cookies.refreshToken) {
        return false;
    }

    try {
        const res = await axios.patch("/api/user/reissue",{},{headers: {refreshToken: `Bearer ${cookies.refreshToken}`}});
        if(res.status === 200 && res.data.data.accessToken) {
            updateAccessToken(res.data.data.accessToken);
            return false;
        }
        return false
    } catch(e) {
        removeTokens();
        return false;
    }
}

function removeTokens() {
    const date = new Date(0);
    document.cookie = `accessToken=; expires=${date.toUTCString()}; path=/`
    document.cookie = `refreshToken=; expires=${date.toUTCString()}; path=/`
}

function updateAccessToken(accessToken: string) {
    const date = new Date(Date.now() + (1000 * 60 * 60 * 24));
    document.cookie = `accessToken=${accessToken};expires=${date.toUTCString()};path=/`
}

function getCookies() {
    const cookieStr = decodeURIComponent(document.cookie);
    const cookieObj: {[k: string]: string} = {};

    cookieStr.split(';').forEach(v => {
        const _s = v.trim().split('=');
        cookieObj[_s[0]] = _s[1];
    });

    return cookieObj;
}