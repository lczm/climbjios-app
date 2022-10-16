import { useEffect, useState } from 'react';
import { UserIdentity } from 'src/@types/user';
import { useProfile } from 'src/contexts/auth/ProfileContext';
import useAuthProvider from './useAuthProvider';

interface State {
  loading: boolean;
  loaded: boolean;
  identity?: UserIdentity;
  error?: any;
}

const useGetIdentity = () => {
  const [state, setState] = useState<State>({
    loading: true,
    loaded: false,
  });

  const { userIdentity, setUserIdentity } = useProfile();
  const authProvider = useAuthProvider();

  useEffect(() => {
    const callGetIdentity = async () => {
      try {
        const identity = await authProvider.getIdentity();
        setUserIdentity(identity);
        setState({
          loading: false,
          loaded: true,
          identity: identity,
        });
      } catch (error) {
        setState({
          loading: false,
          loaded: true,
          error,
        });
      }
    };

    if (userIdentity) {
      setState({
        loading: false,
        loaded: true,
        identity: userIdentity,
      });
    } else {
      callGetIdentity();
    }
  }, [authProvider, setUserIdentity, userIdentity]);

  return state;
};

export default useGetIdentity;
