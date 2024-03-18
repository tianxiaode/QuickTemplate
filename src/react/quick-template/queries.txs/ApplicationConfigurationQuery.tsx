import { IApplicationConfiguration } from "@/models/ApplicationConfiguration";
import { BaseQuery } from "./BaseQuery";

export class ApplicationConfigurationQuery extends BaseQuery<IApplicationConfiguration> {
    protected method = "GET";
    protected endpoint = "application-configuration";
    
}