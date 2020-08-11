/**
 * 函数防抖( => void 无法拿到arguments )
 */
export function debounce(
    cb: (...args: any[]) => void,
    wait = 250,
    immediate = false,
): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout> | null;

    return (...args: any[]): void => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;

            if (!immediate) {
                cb(...args);
            }
        }, wait);

        if (immediate && !timeout) {
            cb(...args);
        }
    };
}
/**
 * jsonp搜索工具
 * @param url
 * @param params
 * @param success
 */
export const jsonpHttp = (url, params= {}) => {
    return new Promise(((resolve, reject) => {
        try {
            const callbackName: string = `jsonp_${new Date().getTime()}`;
            const script: any = document.createElement('script');
            let baseUrl = `${url}?callback=${callbackName}`;
            for (const item of Object.keys(params)) {
                baseUrl += `&${item}=${params[item]}`;
            }
            script.src = baseUrl;
            document.body.appendChild(script);
            window[callbackName] = (res) => {
                resolve(res);
                delete window[callbackName];
                document.body.removeChild(script);
            };
        } catch (e) {
            reject(e);
        }
    }));
};

