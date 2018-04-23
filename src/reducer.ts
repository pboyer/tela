import { Set } from 'immutable';

import * as model from './model'
import * as actions from './actions';
import { nextId } from './id';
import { lookupNode, newExpr, portCenter } from './graph';
import { defaultEditor } from './model';

export function reducer(editor: model.EditorRecord = model.defaultEditor, action: actions.EditorAction): model.EditorRecord {
    console.log(action);

    const snapshot = (e : model.EditorRecord) => e.set('past', e.past.push(e.graph)).set('future', e.future.clear());
    
    switch (action.type) {
        case actions.DRAG_START:
            return editor.set('draggingSelection', true);
        case actions.DRAG_END:
            let dragged = editor.graph.funcCallExprs.map(x =>
                editor.selection.contains(x.id) ? x.set('x', x.x + action.offsetX).set('y', x.y + action.offsetY) : x
            );
            return snapshot(editor)
                .setIn(['graph', 'funcCallExprs'], dragged)
                .set('draggingSelection', false);
        case actions.UNDO:
            if (editor.past.isEmpty()){
                return editor;
            }

            return editor
                .set('graph', editor.past.last())
                .set('past', editor.past.butLast())
                .set('future', editor.future.push(editor.graph));
        case actions.REDO:
            if (editor.future.isEmpty()){
                return editor;
            }

            return editor
                .set('graph', editor.future.last())
                .set('future', editor.future.butLast())
                .set('past', editor.past.push(editor.graph));
        case actions.COPY:
            let g = model.defaultGraph
                .set('funcCallExprs', editor.selection.map(x => lookupNode(editor.graph, x)))
                .set('conns', editor.graph.conns.filter( x => editor.selection.contains(x.startNode) && editor.selection.contains(x.endNode)))
            return editor
                .set('clipboard', g)
                .set('currentPasteOffsetX', defaultEditor.currentPasteOffsetX)
                .set('currentPasteOffsetY', defaultEditor.currentPasteOffsetY);
        case actions.CLEAR:
            return snapshot(editor)
                .set('graph', model.defaultGraph.set('id', nextId()));
        case actions.PASTE:
            let idmap : { [oldId : string] : string } = {};

            let newExprs = editor.clipboard.funcCallExprs.map(x => {
                return x
                    .set('id', idmap[x.id] = nextId())
                    .set('x', x.x + editor.currentPasteOffsetX)
                    .set('y', x.y + editor.currentPasteOffsetY);
            });

            let newConns = editor.clipboard.conns.map(x => {
                    return x
                        .set('id', nextId())
                        .set('startNode', idmap[x.startNode])
                        .set('endNode', idmap[x.endNode]);
                });

            let newGraph = editor.graph
                .set('funcCallExprs', editor.graph.funcCallExprs.concat(newExprs))
                .set('conns', editor.graph.conns.concat(newConns));

            return snapshot(editor)
                .set('graph', newGraph)
                .set('currentPasteOffsetX', editor.currentPasteOffsetX + 10)
                .set('currentPasteOffsetY', editor.currentPasteOffsetY + 10)
                .set('selection', Set<string>(newExprs.map(x => x.id)));
        case actions.SELECT:
            return editor.set('selection', Set<string>(action.ids));
        case actions.SELECT_DEL:
            return editor.set('selection', editor.selection.subtract(action.ids));
        case actions.SELECT_ADD:
            return editor.set('selection', editor.selection.concat(action.ids));
        case actions.SELECT_CLEAR:
            return editor.set('selection', editor.selection.clear());
        case actions.DELETE_SELECTED:
            let conns = editor.graph.conns
                .filterNot(x => editor.selection.contains(x.endNode) || editor.selection.contains(x.startNode));

            let exprs = editor.graph.funcCallExprs.filter(x => !editor.selection.contains(x.id));
            return snapshot(editor)
                .setIn(['graph', 'conns'], conns)
                .setIn(['graph', 'funcCallExprs'], exprs)
                .set('selection', editor.selection.clear());
        case actions.PAN_SET:
            return editor.set('panEnabled', action.value);
        case actions.PROTO_EXPR_BEGIN:
            return editor
                .set('protoExpr', newExpr(action.name));
        case actions.PROTO_EXPR_END:
            let e = editor.protoExpr;
            if (!e){
                return editor;
            }

            // the final position for the node
            e = e.set('x', action.x);
            e = e.set('y', action.y);

            return snapshot(editor)
                .setIn(['graph', 'funcCallExprs'], editor.graph.funcCallExprs.push(e))
                .set('protoExpr', null);
        case actions.PROTOCONN_START:
            return editor.set('protoConn', model.ProtoConn(action));
        case actions.PROTOCONN_END:
            if (!action.nodeId) {
                return editor.set('protoConn', model.defaultProtoConn);
            }

            // is there a connection going into this port already?
            const i = editor.graph.conns.findIndex(x => x.endNode === action.nodeId && x.endPort === action.port);

            let pc = editor.protoConn;
            if (pc === model.defaultProtoConn) {
                // if not, ignore
                if (i === -1){
                    return editor;
                }

                // otherwise, let's delete the connection, and start the proto conn
                let startNode = editor.graph.funcCallExprs.find(x => x.id === action.nodeId);
                let c = editor.graph.conns.get(i);
      
                return snapshot(editor)
                    .deleteIn(['graph', 'conns', i])
                    .set('protoConn', model.ProtoConn({ startNode : c.startNode, port: c.startPort, ex : startNode.x, ey : startNode.y + portCenter(startNode, action.port) }))
            }

            let ss = snapshot(editor);

            // delete any existing nodes
            if (i !== -1) {
                ss = ss.deleteIn(['graph', 'conns', i]);
            }

            return ss
                .set('graph', graphReducer(ss.graph, { type: actions.CONN_ADD, conn: model.Conn({ id: nextId(), startNode: pc.startNode, startPort: pc.port, endNode: action.nodeId, endPort: action.port }) }))
                .set('protoConn', model.defaultProtoConn)
    }

    return editor.set('graph', graphReducer(editor.graph, action));
}

function graphReducer(graph: model.GraphRecord, action: actions.EditorAction): model.GraphRecord {
    switch (action.type) {
        case actions.EXPR_ADD:
            return graph.set('funcCallExprs', graph.funcCallExprs.push(action.expr));
        case actions.CONN_ADD:
            return graph.set('conns', graph.conns.push(action.conn));
        default:
            return graph;
    }
}