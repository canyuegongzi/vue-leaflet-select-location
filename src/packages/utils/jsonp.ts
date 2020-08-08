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
