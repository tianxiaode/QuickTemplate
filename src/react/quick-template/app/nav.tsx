'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from "react-oidc-context";
  
export default function Nav() {
    const pathname = usePathname();
    const pageName = pathname?.split('/').pop();
    const auth = useAuth();
    const user = useCurrentUser();

    console.log('Nav is rendering', user)
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
