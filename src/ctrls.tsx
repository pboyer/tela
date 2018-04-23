import * as vec2 from './math/vec2';
import * as mat3 from './math/mat3';
import * as React from 'react';
import { render } from 'react-dom';
import * as Redux from 'redux';
import { connect, Provider } from 'react-redux';
import { Map, Record, List, Set } from 'immutable';

import * as model from './model'
import * as actions from './actions';
import { DispatchProps } from './dispatchProps';

const ctrls = ({ panEnabled, clipboard, selection, dispatch, past, future }: model.Editor & DispatchProps) => {
    return <div style={{
            position: "absolute",
            padding: "5px",
            top: 0,
            left: "200px",
            zIndex: 2,
            background: "whitesmoke",
            overflowX: "hidden"
        }}>
        <input value='Copy' type='button' disabled={selection.isEmpty()} onClick={
            (e) => {
                dispatch({
                    type: actions.COPY
                });
            }
        } />
        <input value='Delete' type='button' disabled={selection.isEmpty()} onClick={
            (e) => {
                dispatch({
                    type: actions.DELETE_SELECTED
                });
            }
        } />
        <input value='Paste' type='button' disabled={ clipboard.funcCallExprs.isEmpty() } onClick={
            (e) => {
                dispatch({
                    type: actions.PASTE
                });
            }
        } />
        <input value='Undo' type='button' disabled={ past.isEmpty() } onClick={
            (e) => {
                dispatch({
                    type: actions.UNDO
                });
            }
        } />
        <input value='Redo' type='button' disabled={ future.isEmpty() } onClick={
            (e) => {
                dispatch({
                    type: actions.REDO
                });
            }
        } />
        <input value='Clear' type='button' onClick={
            (e) => {
                dispatch({
                    type: actions.CLEAR
                });
            }
        } />
    </div>
}

export const Ctrls = connect((e: model.Editor) => {
    return { 
        panEnabled: e.panEnabled,
        selection: e.selection,
        clipboard: e.clipboard,
        past: e.past,
        future: e.future
    };
})(ctrls);