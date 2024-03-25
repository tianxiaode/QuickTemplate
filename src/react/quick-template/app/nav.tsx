'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequest } from 'ahooks';
import  ApplicationConfigurationQuery  from "@/queries/ApplicationConfigurationQuery";  
import axios  from 'axios';
import { useAuth} from "react-oidc-context";

export default function Nav() {
    const pathname = usePathname();
    const pageName = pathname?.split('/').pop();
    const auth = useAuth();
    const token = useAuth().user?.access_token;
    const apiFn = async (token: string | undefined) => {
        const url = `${process.env.NEXT_PUBLIC_AUTH_ISSUER_BASE_URL}/api/application-configuration`;
        const config = { headers: {} };
        if(token){
            config.headers = {  Authorization: `Bearer ${token}` };
        }
      
        // 发起GET请求，带上参数
        const response = await axios.get(url);
      
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Failed to fetch data');
        }
      };
      
    //const user = useApplicationConfiguration()?.appConfig?.currentUser;
    const { data, error, loading } = useRequest(apiFn);
    const user = data?.currentUser;
    console.log('Nav is rendering', data, error, loading)
    return (

        <>
            <div className={`header ${pageName || 'home'} secondary`}>
                <nav>
                    <ul>
                        <li>
                            <Link href="/" legacyBehavior>
                                <a>Home</a>
                            </Link>
                        </li>
                        {user?.isAuthenticated ? (
                            <>
                                <li>
                                    <div>
                                        {user?.userName}{" "}
                                        <button onClick={() => auth.signoutSilent()}>Log out</button>
                                    </div>                                
                                    </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button onClick={() => auth.signinRedirect()}>Log in</button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    );
}
