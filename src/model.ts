import { List, Map, Set } from "immutable";

import * as actions from './actions'
import { TypedRecord, newTypedFactory } from './TypedRecord'

export interface Node {
    id : string;
    x : number;
    y : number;
    state : Map<string, any>;
    in : List<Port>;
    out : List<Port>;
    progress : number;
}

export interface Port {
    name : string;
    x : number;
    y : number;
    // list@level, lacing, bla bla
}
export interface PortRecord extends TypedRecord<PortRecord>, Port {};
export var Port = newTypedFactory<Port, PortRecord>({
    name : "",
    x : 0,
    y : 0
});

export var defaultPort = Port();


export interface ImperNode extends Node {
    program : string;
}
export interface ImperNodeRecord extends TypedRecord<ImperNodeRecord>, ImperNode {};
export var ImperNode = newTypedFactory<ImperNode, ImperNodeRecord>({
    id : "",
    x : 10,
    y : 10,
    state : Map<string, any>(),
    program : "",
    in : List<Port>(),
    out : List<Port>(),
    progress : 1
});

export var defaultImperNode = ImperNode();



export interface SubGraph extends Node {
    graphId : string;
    graph : GraphRecord;
}
export interface SubGraphRecord extends TypedRecord<SubGraphRecord>, SubGraph {};
export var SubGraph = newTypedFactory<SubGraph, SubGraphRecord>({
    id : "",
    x : 10,
    y : 10,
    state : Map<string, any>(),
    graphId : "",
    graph : defaultGraph,
    in : List<Port>(),
    out : List<Port>(),
    progress : 1
});

export var defaultSubGraph = SubGraph();



export interface FuncCallExpr extends Node {
    decl : string;
    properties : Map<string, any>;
}
export interface FuncCallExprRecord extends TypedRecord<FuncCallExprRecord>, FuncCallExpr {};
export var FuncCallExpr = newTypedFactory<FuncCallExpr, FuncCallExprRecord>({
    id : "",
    x : 0,
    y : 0,
    state : Map<string, any>(),
    decl : "",
    properties : Map<string, any>(),
    in : List<Port>(),
    out : List<Port>(),
    progress : 1
});

export var defaultExpr = FuncCallExpr();

export interface Conn {
    id : string;
    endNode : string;
    startNode : string;
    endPort : number;
    startPort : number;
}
export interface ConnRecord extends TypedRecord<ConnRecord>, Conn {};
export var Conn = newTypedFactory<Conn, ConnRecord>({
    id : "",
    endNode : "",
    startNode : "",
    endPort : 0,
    startPort : 0
});

export var defaultConn = Conn();

export interface Graph {
    id : string;
    funcCallExprs: List<FuncCallExprRecord>;
    subGraphs: List<SubGraphRecord>;
    imperNodes: List<ImperNodeRecord>;
    conns: List<ConnRecord>;
}
export interface GraphRecord extends TypedRecord<GraphRecord>, Graph {};
export var Graph = newTypedFactory<Graph, GraphRecord>({
    id : "",
    funcCallExprs: List<FuncCallExprRecord>(),
    subGraphs: List<SubGraphRecord>(),
    imperNodes: List<ImperNodeRecord>(),
    conns: List<ConnRecord>()
});

export var defaultGraph = Graph();

export interface ProtoConn {
    startNode : string;
    port  : number;
    ex : number;
    ey : number;
}
export interface ProtoConnRecord extends TypedRecord<ProtoConnRecord>, ProtoConn {};
export var ProtoConn = newTypedFactory<ProtoConn, ProtoConnRecord>({
    startNode: "",
    port  : 0,
    ex : 0,
    ey : 0
});
export var defaultProtoConn = ProtoConn();

export interface ValueDecl {
    id : string;
    name : string;
    type : string;
    default : string;
}
export interface ValueDeclRecord extends TypedRecord<ValueDeclRecord>, ValueDecl {};
export var ValueDecl = newTypedFactory<ValueDecl, ValueDeclRecord>({
    id : "",
    name : "",
    type : "",
    default : ""
});

export var defaultValueDecl = ValueDecl();

export interface FunctionDecl {
    name : string;
    in : List<ValueDecl>;
    out : List<ValueDecl>;
}
export interface FunctionDeclRecord extends TypedRecord<FunctionDeclRecord>, FunctionDecl {};
export var FunctionDecl = newTypedFactory<FunctionDecl, FunctionDeclRecord>({
    name: "",
    in: List<ValueDecl>(),
    out: List<ValueDecl>(),
});
export var defaultDef = FunctionDecl();


export interface Lib {
    functions: Map<string,FunctionDecl>;
}
export interface LibRecord extends TypedRecord<LibRecord>, Lib {};
export var Lib = newTypedFactory<Lib, LibRecord>({
    functions: Map<string,FunctionDecl>({
        "number" : FunctionDecl({ 
            name : "number", 
            out : List<ValueDecl>([ 
                ValueDecl({ id : "0", name : "val", type : "number" }) 
            ]) 
        }),
        "add" : FunctionDecl({
            name : "add",
            in : List<ValueDecl>([ 
                ValueDecl({ id : "0", name : "a", type : "var" }),
                ValueDecl({ id : "1", name : "b", type : "var" })
            ]),
            out : List<ValueDecl>([ 
                ValueDecl({ id : "0", name : "val", type : "var" }) 
            ]) 
        })
    })
});

export var defaultLib = Lib();

export interface Editor {
    graph : GraphRecord,
    future : List<GraphRecord>,
    past : List<GraphRecord>,
    protoConn : ProtoConnRecord,
    protoExpr : FuncCallExprRecord,
    clipboard : GraphRecord,
    currentPasteOffsetX: number,
    currentPasteOffsetY: number,
    lib : LibRecord,
    panEnabled : boolean,
    draggingSelection : boolean,
    selection : Set<string>,
    error: string;
}
export interface EditorRecord extends TypedRecord<EditorRecord>, Editor {};
export var Editor = newTypedFactory<Editor, EditorRecord>({
    graph : defaultGraph,
    future : List<GraphRecord>(),
    past : List<GraphRecord>(),
    protoConn : defaultProtoConn,
    protoExpr : null,
    clipboard : defaultGraph,
    currentPasteOffsetX: 10,
    currentPasteOffsetY: 10,
    lib : defaultLib,
    panEnabled : false,
    draggingSelection : false,
    selection : Set<string>(),
    error: ''
});

export var defaultEditor = Editor();
