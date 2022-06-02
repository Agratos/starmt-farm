import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './Component/Login';
import Main from './Component/Main';

import { createStore } from 'redux';
import { Provider  } from 'react-redux';
import userReducer from './Redux/UserReducer'

const store = createStore(userReducer);

ReactDOM.render(
  <BrowserRouter>
    <Provider store = { store }>
      <Switch>
        <Route exact path="/"><Login></Login></Route>
        <Route path="/main"><Main></Main></Route>
      </Switch>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);



serviceWorker.unregister();
