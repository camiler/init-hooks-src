import React, {useState, useContext, useEffect} from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter } from 'react-router-dom';
import { Context, StoreProvider } from './store';
import { LocaleProvider, Spin} from 'antd';

import routes from '../routes';

const Root = (props) => {
  const [preDataReady, setPreDataReady] = useState(false);

  const {dispatch} = useContext(Context);
  const preload = () => {
    dispatch({
      type: 'INIT_DATA',
      preload: {
        profile: {},
      }
    })
    setPreDataReady(true);
  };

  useEffect(() => {
    preload();
  }, []);

  if (!preDataReady) {
    return (
      <div style={{width: '100%', display: 'flex', margin: '100px auto'}}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter basename="/">
      {routes}
    </BrowserRouter>
  );
}

ReactDom.render(
  <LocaleProvider locale={zhCN}>
    <StoreProvider>
      <Root />
    </StoreProvider>
  </LocaleProvider>,
  document.getElementById('app')
);
