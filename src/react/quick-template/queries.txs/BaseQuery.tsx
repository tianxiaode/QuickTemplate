import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import  Deferred  from "@/utils/Deferred";

export class BaseQuery<T>  {

    public static isLoading:boolean = false;

    protected endpoint:string = '';
    protected method:string = '';
    public name:string = '';

    private _token:string | undefined;

    constructor(token:string | undefined){
        this._token = token;
    }

    sendRequest(data:any | undefined):Promise<T>{
        const me = this;
        const deferred = new Deferred<T>();
        console.log(`Sending ${me.name} request`, me._token)
        if(!me._token){
            return Promise.reject("No token provided");
        }
        const config:AxiosRequestConfig = {
            url: `${process.env.NEXT_PUBLIC_AUTH_ISSUER_BASE_URL}/api/${me.endpoint}`,
            method: me.method,            
        };

        if(data){
            config.data = data;
        }


        config.headers = {
            'Authorization': `Bearer ${me._token}`
        }                            

        console.log(`Sending ${me.name} request`, config, me._token)

        Axios.request(config).then((response:AxiosResponse<T>) => {
            me.onSuccess.call(me, response, deferred);
        })
        .catch((error:any) => {
            me.onError.call(me, error, deferred);
        })

        return deferred.promise;
    }

    onSuccess(response:AxiosResponse<T>, deferred:Deferred<T>){
        console.log(`Query ${this.name} successful`, response);
        deferred.resolve(response.data);
    }

    onError(error:AxiosError<T>, deferred:Deferred<T>){
        console.log(`Query ${this.name} error`, error);
        deferred.reject(error);
    }
    
}