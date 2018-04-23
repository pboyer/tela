import * as Redux from 'redux';
import * as model from './model'

export interface DispatchProps {
    dispatch: Redux.Dispatch<model.Editor>
}
