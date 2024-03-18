import React from "react";

interface ApplicationConfigurationContextProps {
    auth: any,
    clock: any,
    currentTenant: any,
    currentUser: any,
    extraProperties: any,
    features: any,
    globalFeatures: any,
    localization: any,
    multiTenancy: any,
    objectExtensions: any,
    setting: any,
    timing: any,
}

export const ApplicationConfigurationContext = React.createContext<ApplicationConfigurationContextProps | undefined>(undefined);
ApplicationConfigurationContext.displayName = "ApplicationConfigurationContext";


/**
 * @public
 */
export const useApplicationConfiguration = (): ApplicationConfigurationContextProps => {
    const context = React.useContext(ApplicationConfigurationContext);

    if (!context) {
        console.warn("ApplicationConfiguration context is undefined, please verify you are calling useAuth() as child of a <AuthProvider> component.");
    }

    return context as ApplicationConfigurationContextProps;
};
