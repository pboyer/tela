import * as React from 'react';
import { connect, Provider } from 'react-redux';
import * as Redux from 'redux';
import { render } from 'react-dom';

import * as model from './model'
import * as actions from './actions';

import { reducer } from './reducer';
import { newExpr, Graph } from './graph';
import { Lib } from './lib';
import { Ctrls } from './ctrls';

// prevent display of context menu
document.addEventListener('contextmenu', event => event.preventDefault());

const store = Redux.createStore(reducer);

render(
    <Provider store={store}>
        <div style={{ userSelect: "none", fontFamily: "Artifakt Element" }}>
            <Graph />
            <Lib />
            <Ctrls />
        </div>
    </Provider>,
    document.getElementById('tela-proj')
);

// for perf experimentation
for (var i = 0; i < 50; i++) {
    store.dispatch({
        type: actions.EXPR_ADD,
        expr: newExpr('add').set('x', Math.random() * 1000 - 500).set('y', Math.random() * 1000 - 500)
    });
}