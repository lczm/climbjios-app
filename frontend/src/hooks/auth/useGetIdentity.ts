import { useEffect, useState } from 'react';
import { UserIdentity } from 'src/@types/user';
import { useProfile } from 'src/contexts/auth/ProfileContext';
import useAuthProvider from './useAuthProvider';

const defaultIdentity: UserIdentity = {
  id: '',
};

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

  const { userIdentity } = useProfile();
  const { getIdentity } = useAuthProvider();

  useEffect(() => {
    const callGetIdentity = async () => {
      try {
        const identity = await getIdentity();
        setState({
          loading: false,
          loaded: true,
          identity: identity || defaultIdentity,
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
  }, [getIdentity, userIdentity]);

  return state;
};

export default useGetIdentity;
