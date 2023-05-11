import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider, teamsDarkTheme, Theme } from '@fluentui/react-components';
import App from './App';
import { AuthProvider } from 'react-auth-kit';

import './index.css';
import ViewportProvider from './context/ViewportProvider';

const theme: Theme = {
  ...teamsDarkTheme,
  fontFamilyBase: "'Nunito Sans', 'Segoe UI', sans-serif",
  fontWeightRegular: 600,
  fontWeightBold: 900
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider authType = {'cookie'}
    authName={'_auth'}
    cookieDomain={window.location.hostname}
    cookieSecure={window.location.protocol === "https:"}>
    <FluentProvider theme={theme}>
      <ViewportProvider>
        <App />
      </ViewportProvider>
    </FluentProvider>
  </AuthProvider>
);
