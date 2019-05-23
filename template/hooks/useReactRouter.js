import { useContext, useEffect } from 'react';
import { __RouterContext } from 'react-router';
import useForceUpdate from './useForceUpdate';

const useReactRouter = () => {
  const forceUpdate = useForceUpdate();
  const routerContext = useContext(__RouterContext);
  useEffect(() => {
    const unlisten = routerContext.history.listen(forceUpdate);

    return () => {
      unlisten();
    }
  }, [routerContext]);

  return routerContext;
}

export default useReactRouter;
