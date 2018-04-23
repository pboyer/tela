import * as model from './model'

export type EXPR_ADD = 'EXPR_ADD';
export const EXPR_ADD : EXPR_ADD = 'EXPR_ADD';
type ExprAdd = {
    type : EXPR_ADD,
    expr : model.FuncCallExprRecord
}

export type PROTO_EXPR_BEGIN = 'PROTO_EXPR_BEGIN';
export const PROTO_EXPR_BEGIN : PROTO_EXPR_BEGIN = 'PROTO_EXPR_BEGIN';
type ProtoExprBegin = {
    type : PROTO_EXPR_BEGIN,
    name : string
}

export type PROTO_EXPR_END = 'PROTO_EXPR_END';
export const PROTO_EXPR_END : PROTO_EXPR_END = 'PROTO_EXPR_END';
type ProtoExprEnd = {
    type : PROTO_EXPR_END,
    x : number,
    y : number
}

export type EXPR_DEL = 'EXPR_DEL';
export const EXPR_DEL : EXPR_DEL = 'EXPR_DEL';
type ExprDel = {
    type : EXPR_DEL,
    ids : Array<string>
}

export type DRAG_END = 'DRAG_END';
export const DRAG_END : DRAG_END = 'DRAG_END';
type DragEnd = {
    type : DRAG_END,
    offsetX : number,
    offsetY : number
}

export type DRAG_START = 'DRAG_START';
export const DRAG_START : DRAG_START = 'DRAG_START';
type DragStart = {
    type : DRAG_START
}

export type CONN_ADD = 'CONN_ADD';
export const CONN_ADD : CONN_ADD = 'CONN_ADD';
type ConnAdd = {
    type : CONN_ADD,
    conn : model.ConnRecord
}

export type PROTOCONN_START = 'PROTOCONN_START';
export const PROTOCONN_START : PROTOCONN_START = 'PROTOCONN_START';
type ProtoConnStart = {
    type : PROTOCONN_START,
    startNode : string,
    startPort : string,
    ex : number,
    ey : number
}

export type PROTOCONN_END = 'PROTOCONN_END';
export const PROTOCONN_END : PROTOCONN_END = 'PROTOCONN_END';
type ProtoConnEnd = {
    type : PROTOCONN_END,
    nodeId : string,
    port : number
}

export type SELECT = 'SELECT';
export const SELECT : SELECT = 'SELECT';
type Select = {
    type : SELECT,
    ids : Array<string>
}

export type SELECT_DEL = 'SELECT_DEL';
export const SELECT_DEL : SELECT_DEL = 'SELECT_DEL';
type SelectDel = {
    type : SELECT_DEL,
    ids : Array<string>
}

export type SELECT_ADD = 'SELECT_ADD';
export const SELECT_ADD : SELECT_ADD = 'SELECT_ADD';
type SelectAdd = {
    type : SELECT_ADD,
    ids : Array<string>
}

export type SELECT_CLEAR = 'SELECT_CLEAR';
export const SELECT_CLEAR : SELECT_CLEAR = 'SELECT_CLEAR';
type SelectClear = {
    type : SELECT_CLEAR
}

export type DELETE_SELECTED = 'DELETE_SELECTED';
export const DELETE_SELECTED : DELETE_SELECTED = 'DELETE_SELECTED';
type DeleteSelected = {
    type : DELETE_SELECTED
}

export type PAN_SET = 'PAN_SET';
export const PAN_SET : PAN_SET = 'PAN_SET';
type PanSet = {
    type : PAN_SET,
    value : boolean
}

export type COPY = 'COPY';
export const COPY : COPY = 'COPY';
type Copy = {
    type : COPY
}

export type PASTE = 'PASTE';
export const PASTE : PASTE = 'PASTE';
type Paste = {
    type : PASTE
}

export type UNDO = 'UNDO';
export const UNDO : UNDO = 'UNDO';
type Undo = {
    type : UNDO
}

export type REDO = 'REDO';
export const REDO : REDO = 'REDO';
type Redo = {
    type : REDO
}

export type CLEAR = 'CLEAR';
export const CLEAR : CLEAR = 'CLEAR';
type Clear = {
    type : CLEAR
}

export type EditorAction = 
    ExprAdd | 
    ExprDel | 
    DragStart | 
    DragEnd | 
    ConnAdd | 
    Select | 
    SelectAdd | 
    SelectDel | 
    SelectClear |
    DeleteSelected |
    ProtoConnStart | 
    ProtoConnEnd | 
    ProtoExprBegin |
    ProtoExprEnd |
    ProtoExprEnd |
    Copy |
    Paste |
    Undo |
    Redo |
    Clear |
    PanSet;