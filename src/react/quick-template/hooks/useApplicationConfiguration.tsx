import { useEffect, useRef } from 'react'
import { IApplicationConfiguration } from '@/models/ApplicationConfiguration';
import  ApplicationConfigurationQuery  from '@/queries/ApplicationConfigurationQuery';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAuth } from "react-oidc-context";
import { useSetState } from 'ahooks'
import  Axios  from "axios";

export const useMounted = () => {
    const mountedRef = useRef(false)
    useEffect(() => {
      mountedRef.current = true
      return () => {
        mountedRef.current = false
      }
    }, [])
    return () => mountedRef.current
  }

  
export function useApplicationConfiguration() {
    // const [state, setState] = useSetState<{ appConfig: any, isLoading: boolean, token: string | undefined, run: any }>({ appConfig: {} as IApplicationConfiguration, isLoading: false, token: undefined, run: () => { } })

    // const isMounted = useMounted()

    // const auth = useAuth();
    // const token = auth.user?.access_token;


    // useEffect(() => {
    //     const fetchData = async () => {
    //         const config = { headers: {} };
    //         if(token) {
    //             config.headers = { 'Authorization': `Bearer ${token}` }
    //         const response = await Axios.get(`${process.env.NEXT_PUBLIC_AUTH_ISSUER_BASE_URL}/api/application-configuration`,config);
    //         const data = response.data as IApplicationConfiguration;

    //         if (!isMounted() || !data) {
    //             return
    //           }
    
    //         setState({ appConfig: data, isLoading: true, token: token })
    //     }

    

    //     setState({ isLoading: true, run: fetchData });
    //     fetchData();
    // },[token, isMounted])

    // return state;

    // const query = new ApplicationConfigurationQuery(auth.user?.access_token);
    // return useQuery({
    //     queryKey: [query.name],
    //     enabled:!!token && !ApplicationConfigurationQuery.isLoading,
    //     queryFn: () => {
    //         const result = query.sendRequest(null);
    //         ApplicationConfigurationQuery.isLoading = true;
    //         return result;
    //     }
    // });
};
