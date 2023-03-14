import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider, teamsDarkTheme, Theme } from '@fluentui/react-components';
import App from './App';

import './index.css';

const theme: Theme = {
  ...teamsDarkTheme,
  fontFamilyBase: "'Nunito Sans', 'Segoe UI', sans-serif",
  fontWeightRegular: 600,
  fontWeightBold: 900
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider theme={theme}>
    <App />
  </FluentProvider>
);
