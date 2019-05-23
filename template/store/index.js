import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

const Context = React.createContext();

const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider
      value={{
        data: state,
        dispatch
      }}
    >
      { props.children || null }
    </Context.Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export {
  Context,
  StoreProvider
};
