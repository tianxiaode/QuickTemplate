'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "react-oidc-context";
import ApplicationConfiguration from "@/services/AbpApplicationConfiguration";

export default function Nav() {
    const auth = useAuth();;
    const pathname = usePathname();
    const pageName = pathname?.split('/').pop();

    if(auth.isAuthenticated){
        ApplicationConfiguration.getClock();
    }

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
                        {auth.isAuthenticated ? (
                            <>
                                <li>
                                    <div>
                                        Hello {auth.user?.profile.sub}{" "}
                                        <button onClick={() => void auth.removeUser()}>Log out</button>
                                    </div>                                
                                    </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button onClick={() => void auth.signinRedirect()}>Log in</button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    );
}
