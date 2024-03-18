import { IApplicationConfiguration } from '@/models/ApplicationConfiguration';
import { ApplicationConfigurationQuery } from '@/queries.txs/ApplicationConfigurationQuery';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAuth } from "react-oidc-context";

export const useApplicationConfiguration = (): UseQueryResult<IApplicationConfiguration, unknown> => {
    const auth = useAuth();
    const token = auth.user?.access_token;
    const query = new ApplicationConfigurationQuery(auth.user?.access_token);
    return useQuery({
        queryKey: [query.name],
        enabled:!!token && !ApplicationConfigurationQuery.isLoading,
        queryFn: () => {
            const result = query.sendRequest(null);
            ApplicationConfigurationQuery.isLoading = true;
            return result;
        }
    });
};
