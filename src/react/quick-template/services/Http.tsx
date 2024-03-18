import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { endsWith } from "lodash";

export interface IHttp {
    get(url: string, params?: any, config?: any): Promise<any>;
    post(url: string, data?: any, config?: any): Promise<any>;
    put(url: string, data?: any, config?: any): Promise<any>;
    delete(url: string, config?: any): Promise<any>;
    patch(url: string, data?: any, config?: any): Promise<any>;
    upload(url: string, data: any, config?: any): Promise<any>;
    download(url: string, config?: any): Promise<any>;
    token: string | undefined;
    alert: any;
    isReady: boolean;
}   



class Http implements IHttp {

    private static _instance: IHttp | undefined;
    private _axios: any
    private _token: string | undefined
    private _alert: any
    public isReady: boolean = false

    public static getInstance(): IHttp {
        
        if (!Http._instance) {
            Http._instance = new Http();
        }
        return Http._instance;
    }

    constructor(){
        let me = this;
        let host = process.env.NEXT_PUBLIC_AUTH_ISSUER_BASE_URL;
        if(!endsWith(host, '/')) host += '/';
        me._axios =Axios.create({
            baseURL: `${host}api`,
            timeout: 30 * 60 * 1000, // 30 minutes
        });
        me._axios.interceptors.request.use(me.requestInterceptor.bind(me), me.requestInterceptorError.bind(me));
        me._axios.interceptors.response.use(me.responseInterceptor.bind(me), me.errorInterceptor.bind(me))
        console.log(' Http constructor',me._axios)
    }

    private requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
        if (this._token) {
            config!.headers!.Authorization = `Bearer ${this._token}`;
        }
        return config
    }

    private requestInterceptorError(message: string): any {
        this._alert.error(message);
    }

    private responseInterceptor(response: AxiosResponse): Promise<any> {
        const { data } = response;
        const { code, msg } = data;

        if (typeof code !== 'undefined' && code !== 0) {
            //data?.msg && this.alert!.error(data.msg);
            return Promise.reject(msg || 'Error')
        }

        if (!data) {
            return Promise.reject(data);
        }

        return Promise.resolve(data);
    }

    private errorInterceptor(error: any): any {
        let msg = '请求失败，请稍后再试';
        const response: any = { ...error.response };
        // 处理500类型，自定义报错信息
        if (response?.data?.code) {
            //msg = CodeMessage[response?.data?.code]
        }

        // 如果已经有错误信息
        if (response?.data?.msg) {
            msg = response?.data?.msg
        }

        this._alert!.error(msg);

        return Promise.reject(error)
    }

    set token(token: string | undefined) {        
        this._token = token;
    }

    set alert(alert: any) {
        this._alert = alert;
    }

    public get(url: string, params?: any, config?: any): Promise<any> {
        return this._axios({ method: 'get', url, params,...config});
    }

    public post(url: string, data?: any, config?: any): Promise<any> {
        return this._axios({ method:'post' , url, data,...config});
    }

    public put(url: string, data?: any, config?: any): Promise<any> {
        return this._axios({ method: 'put', url, data,...config});
    }

    public delete(url: string, config?: any): Promise<any> {
        return this._axios({ method: 'delete', url, ...config});
    }


    public patch(url: string, data?: any, config?: any): Promise<any> {
        return this._axios({ method: 'patch', url, data,...config});
    }

    /**
     * upload
     */
    public upload(url: string, data: any, config?: any): Promise<any> {
        return this._axios({ method: 'post', url, data, headers: { 'Content-Type': 'multipart/form-data' }, ...config})
    }

    /**
     * download
     */
    public download(url: string, config?: any): Promise<any> {
        return this._axios({ method: 'get', url,  responseType: 'blob', ...config });
    }


}

export default Http.getInstance()
