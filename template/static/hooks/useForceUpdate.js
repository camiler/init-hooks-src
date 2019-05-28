import { useState } from 'react';

const max = 9007199254740990;

const useForceUpdate = () => {
  const [, setState] = useState(0);
  
  const forceUpdate = () => {
    setState(state => (state + 1) % max);
  }

  return forceUpdate;
}

export default useForceUpdate;
