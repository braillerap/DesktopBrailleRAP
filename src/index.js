import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppContextWrapper from './components/AppContextWrapper';
require('purecss')

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppContextWrapper>
        <App/>
    </AppContextWrapper>
);

