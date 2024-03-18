
import { IHttp } from "./Http";
import Deferred from "@/utils/Deferred";

export interface IAbpApplicationConfiguration {
    loadConfig(): any;
}

class AbpApplicationConfiguration {

    private static _instance: AbpApplicationConfiguration;
    private _apiUrl: string = "/application-configuration";
    private _config: any;

    public static getInstance(): AbpApplicationConfiguration {
        if (!AbpApplicationConfiguration._instance) {
            AbpApplicationConfiguration._instance = new AbpApplicationConfiguration();
        }
        return AbpApplicationConfiguration._instance;        
    }

    public loadConfig(http: IHttp): any {
        const me = this;
        const deferred = new Deferred<any>();
        http.get(me._apiUrl).then(data => {
            me._config = data;
            console.log(me._config, data)
            return deferred.resolve(me._config);
        }, error => {
            return deferred.reject(error);   
        });
    }

    public getClock(){
        const me = this;        
        const config = me._config;

        return config!.clock;
    }


}

export default AbpApplicationConfiguration.getInstance()