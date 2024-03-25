import { IApplicationConfiguration } from "@/models/ApplicationConfiguration";
import { BaseQuery } from "./BaseQuery";

class ApplicationConfigurationQuery extends BaseQuery<IApplicationConfiguration> {
    protected method = "GET";
    protected endpoint = "application-configuration";
    private static _instance:ApplicationConfigurationQuery | undefined;

    public static getInstance(): ApplicationConfigurationQuery {
        if (!ApplicationConfigurationQuery._instance) {
            ApplicationConfigurationQuery._instance = new ApplicationConfigurationQuery();
        }
        return ApplicationConfigurationQuery._instance;
    }
    
}

export default ApplicationConfigurationQuery.getInstance();