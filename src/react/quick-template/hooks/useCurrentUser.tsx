import { ICurrentUser } from '@/models/CurrentUser';
import { useApplicationConfiguration } from './useApplicationConfiguration';

export const useCurrentUser = (): ICurrentUser | undefined => {
    const { data } = useApplicationConfiguration();
    return data?.currentUser;
};
