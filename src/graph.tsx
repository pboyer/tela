import * as model from './model'

import * as actions from './actions';

import * as vec2 from './math/vec2';
import * as mat3 from './math/mat3';
import * as React from 'react';
import { render } from 'react-dom';
import * as Redux from 'redux';
import { connect, Provider } from 'react-redux';
import { Map, Record, List, Set } from 'immutable';
import { DispatchProps } from './dispatchProps';
import { nextId } from './id';
import { forEach } from 'benchmark';
// import * as librarie from 'librarie.js'; // todo

const PORT_WIDTH = 10;
const PORT_FONT_SIZE = 10;
const PORT_PADDING = 1;
const PORT_MARGIN = 2;
const PORT_HEIGHT = 10 + 2 * PORT_PADDING;

const portTop = (index: number) => index * PORT_HEIGHT + (1 + index) * PORT_MARGIN;
export const portCenter = (node : model.Node, index: number) => portTop(index) + PORT_HEIGHT / 2;
const portWidth = (portName : string) => Math.max( portName.length * PORT_FONT_SIZE * 0.5 + 2 * PORT_PADDING, 24);

const inputPortsWidth = (fd : model.FunctionDecl) => fd.in.reduce((i,x) => Math.max(portWidth(x.name), i), 0);
const outputPortsWidth = (fd : model.FunctionDecl) => fd.out.reduce((i,x) => Math.max(portWidth(x.name), i), 0);
const nodeWidth = (fd : model.FunctionDecl) => Math.max(inputPortsWidth(fd) + outputPortsWidth(fd) + 40, fd.name.length);

const Port = (port: model.Port, parentId, parentX: number, parentY: number, parentWidth: number, i: number, isInput: boolean, dispatch: Redux.Dispatch<model.Editor>) => {
    const x = parentX + (isInput ? 0 : parentWidth - portWidth(port.name));
    const y = parentY + portTop(i);

    const mouseUp = (e : React.MouseEvent<SVGElement>) => {
        return isInput ?
            dispatch({
                type: actions.PROTOCONN_END,
                nodeId: parentId,
                port: i
            }) :
            dispatch({
                type: actions.PROTOCONN_START,
                startNode: parentId,
                port: i,
                ex: x,
                ey: y 
            });
        };

    return <g style={ { cursor: "pointer" } } key={port.name} onMouseUp={mouseUp}>
        <rect
            fill="whitesmoke"
            width={ portWidth(port.name) }
            height={PORT_HEIGHT}
            x={ x } y={y} />
        <text fontSize="10" x={x + PORT_PADDING } y={y+PORT_HEIGHT-PORT_PADDING}>{ port.name }</text>
    </g>
};

type FuncCallExprProps = { expr: model.FuncCallExpr, selected: boolean, decl: model.FunctionDecl, dispatch: Redux.Dispatch<model.Editor> };
type FuncCallExprState = { dragOffsetX: number, dragOffsetY: number };

class FuncCallExpr extends React.Component<FuncCallExprProps, FuncCallExprState> {
    constructor(props: FuncCallExprProps) {
        super(props);
        this.state = { dragOffsetX: 0, dragOffsetY: 0 };
    }

    private click(e : React.MouseEvent<HTMLDivElement>){
        e.preventDefault();
        if (!this.props.selected){
            if (e.shiftKey){
                this.props.dispatch({ type: actions.SELECT_ADD, ids: [this.props.expr.id] });
            } else {
                this.props.dispatch({ type: actions.SELECT, ids: [this.props.expr.id] });
            }
        }
        this.props.dispatch({ type: actions.DRAG_START });
    }

    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;

    render() {
        const { expr, decl, dispatch, selected } = this.props;
        const { dragOffsetX, dragOffsetY } = this.state;

        const x = expr.x + dragOffsetX;
        const y = expr.y + dragOffsetY;

        this.x = x;
        this.y = y;

        const inw = inputPortsWidth(decl);
        const outw = outputPortsWidth(decl);

        const pc = Math.max(decl.in.count(), decl.out.count());
        const width = this.width = nodeWidth(decl);
        const height = this.height = (pc + 1) * PORT_MARGIN + pc * PORT_HEIGHT;

        return <g key={expr.id}>
            <rect fill={selected ? "lightblue" : "#888"} width={ width } height={ height } x={x} y={y} />
            <g onMouseDown={this.click.bind(this)}>
                <rect fill={"#222"} width={ width } height={12} x={x} y={y-12} />
                <text fill="white" fontSize="10" x={x} y={y-2}>{decl.name}</text>
            </g>
            <g>
                {
                    expr.in.map((p, i) => Port(p, expr.id, x, y, width, i, true, dispatch))
                }
            </g>
            <g>
                {
                    expr.out.map((p, i) => Port(p, expr.id, x, y, width, i, false, dispatch))
                }
            </g>
            <rect onMouseDown={this.click.bind(this)} fillOpacity={0} width={width - inw - outw} height={ height } x={x + inw} y={y} />
        </g>;
    }
}

const CONN_BEZIER_OFFSET = 200;

const bezierOffset = (sx: number, ex: number) => Math.min(CONN_BEZIER_OFFSET, Math.abs(sx - ex) / 2);

type ConnProps = { conn: model.Conn, start: model.Node, end: model.Node, dispatch: Redux.Dispatch<model.Editor> };
type ConnState = { 
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    offsetStartX: number;
    offsetStartY: number;
    offsetEndX: number;
    offsetEndY: number;
};

class Conn extends React.Component<ConnProps, ConnState> {
    constructor(props: ConnProps) {
        super(props);
        this.state = { 
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
        
            offsetStartX: 0,
            offsetStartY: 0,
            offsetEndX: 0,
            offsetEndY: 0
        };
    }

    render() {
        let { conn, start, end } = this.props;
        let { startX, startY, endX, endY, offsetStartX, offsetStartY, offsetEndX, offsetEndY } = this.state;

        let sx = startX + offsetStartX + 0;
        let sy = startY + offsetStartY + portCenter(start, conn.startPort);;

        let ex = endX + offsetEndX;
        let ey = endY + offsetEndY + portCenter(end, conn.endPort);

        let offset = bezierOffset(sx, ex);

        return <path key={conn.id} strokeWidth='2' fill='transparent' stroke='black'
            d={`M${sx},${sy} C${sx + offset},${sy} ${ex - offset},${ey} ${ex},${ey}`} />
    }
}

const ProtoConn = (expr : FuncCallExpr, port: number, ex : number, ey : number) => {
    if (!expr) {
        return <g></g>
    }

    let sx = expr.x + expr.width;
    let sy = expr.y + portCenter(expr.props.expr, port);

    let offset = bezierOffset(sx, ex);

    return <path style={{ "pointerEvents": "none" }} strokeWidth='3' fill='transparent' strokeDasharray="3, 2" stroke='black'
        d={`M${sx},${sy} C${sx + offset},${sy} ${ex - offset},${ey} ${ex},${ey}`} />
}

type MarqueeState = { active : boolean, startX: number, startY: number, endX: number, endY: number };
class Marquee extends React.Component<{}, MarqueeState> {
    constructor(props: FuncCallExprProps) {
        super(props);
        this.state = { active : false, startX: 0, startY: 0, endX: 0, endY: 0 };
    }

    render() {
        let { active, startX, startY, endX, endY } = this.state;

        if (!active){
            startX = startY = endX = endY = 0;
        }

        let x = Math.min(startX, endX);
        let y = Math.min(startY, endY);
        let width = Math.abs(startX - endX);
        let height = Math.abs(startY - endY);

        return <rect style={ { "pointerEvents" : "none" } } strokeDasharray={"3, 5"} fillOpacity="0" 
            stroke="black" x={x} y={y} width={width} height={height} />
    }
}

class graphState {
    panX = 0;
    panY = 0;
    zoom = 1.5;
    zoomSpeed = 0.1;
    isPanning = false;
    hasDragged = false;
    lastDownX: number = 0;
    lastDownY: number = 0;
    lastUpX: number;
    lastUpY: number;
    dragXStart = 0;
    dragYStart = 0;
    mouseX = 0;
    mouseY = 0;
    protoConnX = 0;
    protoConnY = 0;
    selectDragX = 0;
    selectDragY = 0;
    marqueeActive = false;
    marqueeEndX = 0;
    marqueeEndY = 0;
    marqueeStartX = 0;
    marqueeStartY = 0;
}

class graph extends React.Component<model.Editor & DispatchProps, graphState> {
    state: graphState;
    private panzoom: Element;

    constructor(props: model.Editor & DispatchProps) {
        super(props);
        this.state = new graphState();
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.wheel = this.wheel.bind(this);
    }

    private mouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.protoExpr){
            let protoExpr = this.props.protoExpr;
            let pos = this.toModelSpace(e.clientX, e.clientY);

            this.props.dispatch({
                type: actions.PROTO_EXPR_END,
                x: pos[0] - this.renderedProtoExpr.width/2,
                y: pos[1] - this.renderedProtoExpr.height/2
            });

            e.stopPropagation();

            return;
        }

        this.state.dragXStart = this.state.panX;
        this.state.dragYStart = this.state.panY;

        this.state.lastDownX = e.clientX;
        this.state.lastDownY = e.clientY;

        if (e.defaultPrevented) {
            return;
        }

        if (!this.props.selection.isEmpty()) {
            this.props.dispatch({
                type: actions.SELECT_CLEAR
            });
        }

        if (this.props.panEnabled){
            this.state.isPanning = true;
            this.updatePanZoom();
            return;
        }

        if (e.button === 0) {
            let p = this.toModelSpace(e.clientX, e.clientY);
            this.state.marqueeActive = true;
            this.state.marqueeStartX = p[0];
            this.state.marqueeStartY = p[1];
            this.state.marqueeEndX = p[0];
            this.state.marqueeEndY = p[1];

            this.renderedMarquee.setState({
                active : true,
                startX : this.state.marqueeStartX,
                startY : this.state.marqueeStartY,
                endX : this.state.marqueeEndX,
                endY : this.state.marqueeEndY,
            });
            return;
        }

        this.state.isPanning = true;
        this.updatePanZoom();
    }

    private selectionOffset: vec2.Vec2 = [0, 0];

    private mouseMove(e: React.MouseEvent<HTMLDivElement>) {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;

        if (this.props.protoExpr) {
            let protoExpr = this.props.protoExpr;
            let pos = this.toModelSpace(e.clientX, e.clientY);

            this.renderedProtoExpr.setState({
                dragOffsetX: pos[0] - this.renderedProtoExpr.width/2,
                dragOffsetY: pos[1] - this.renderedProtoExpr.height/2
            });
            return;
        }

        if (this.props.draggingSelection) {
            this.state.selectDragX = -(this.state.lastDownX - e.clientX) / this.state.zoom;
            this.state.selectDragY = -(this.state.lastDownY - e.clientY) / this.state.zoom;

            this.setDragState(this.state.selectDragX, this.state.selectDragY);
            return;
        }

        if (e.button === 0 && this.state.marqueeActive) {
            let p = this.toModelSpace(e.clientX, e.clientY);
            this.state.marqueeEndX = p[0];
            this.state.marqueeEndY = p[1];

            this.renderedMarquee.setState({
                active : true,
                startX : this.state.marqueeStartX,
                startY : this.state.marqueeStartY,
                endX : this.state.marqueeEndX,
                endY : this.state.marqueeEndY,
            });

            this.props.dispatch({
                type : actions.SELECT,
                ids : this.marqueeSelect()
            });
            return;
        }

        if (this.state.isPanning) {
            this.state.hasDragged = true;

            this.state.panX = this.state.dragXStart - (this.state.lastDownX - e.clientX) / this.state.zoom;
            this.state.panY = this.state.dragYStart + (this.state.lastDownY - e.clientY) / this.state.zoom;
            this.updatePanZoom();
        }

        if (this.props.protoConn.startNode) {
            let p = this.toModelSpace(e.clientX, e.clientY);
            this.state.protoConnX = p[0];
            this.state.protoConnY = p[1];
            this.setState(this.state);
        }
    }

    private setDragState(offsetX: number, offsetY: number) {
        let selection = this.props.selection;

        selection.forEach((id) => {
            let expr = this.renderedExprs[id];
            expr.setState({
                dragOffsetX: offsetX,
                dragOffsetY: offsetY
            });
        });

        this.props.graph.conns.forEach(x => {
            let startSelected = selection.contains(x.startNode);
            let endSelected = selection.contains(x.endNode);
            if (startSelected || endSelected) {
                let conn = this.renderedConns[x.id];
                conn.setState({
                    offsetStartX: startSelected ? offsetX : 0,
                    offsetStartY: startSelected ? offsetY : 0,
                    offsetEndX: endSelected ? offsetX : 0,
                    offsetEndY: endSelected ? offsetY : 0,
                })
            }
        });
    }

    private marqueeSelect() : Array<string> {
        const xmin = Math.min(this.state.marqueeStartX, this.state.marqueeEndX);
        const xmax = Math.max(this.state.marqueeStartX, this.state.marqueeEndX);
        const ymin = Math.min(this.state.marqueeStartY, this.state.marqueeEndY);
        const ymax = Math.max(this.state.marqueeStartY, this.state.marqueeEndY);

        let selection = [];
        for (var nodeId in this.renderedExprs) {
            const x = this.renderedExprs[nodeId];

            const contained = (x.x < xmax && x.x > xmin && x.y < ymax && x.y > ymin) ||
                (x.x + x.width < xmax && x.x + x.width > xmin && x.y < ymax && x.y > ymin) ||
                (x.x + x.width < xmax && x.x + x.width > xmin && x.y + x.height < ymax && x.y + x.height > ymin) ||
                (x.x < xmax && x.x > xmin && x.y + x.height < ymax && x.y + x.height > ymin);

            if (contained) {
                selection.push(nodeId);
            }
        }

        return selection;
    }

    private mouseUp(e: React.MouseEvent<HTMLDivElement>) {
        this.state.lastUpX = e.clientX;
        this.state.lastUpY = e.clientY;

        this.updatePanZoom();

        this.state.hasDragged = false;
        this.state.isPanning = false;

        if (!this.props.selection.isEmpty() && this.props.draggingSelection) {
            this.setDragState(0, 0);

            this.props.dispatch({
                type: actions.DRAG_END,
                offsetX: this.state.selectDragX,
                offsetY: this.state.selectDragY
            });

            this.state.selectDragX = 0;
            this.state.selectDragY = 0;
            return;
        }

        if (this.props.protoConn.startNode) {
            this.props.dispatch({
                type: actions.PROTOCONN_END
            });
        }

        if (e.button === 0 && this.state.marqueeActive) {
            this.state.marqueeActive = false;
            this.renderedMarquee.setState({ ...this.renderedMarquee.state, active : false });
            this.setState(this.state);

            this.props.dispatch({
                type : actions.SELECT,
                ids : this.marqueeSelect()
            });
        }
    }

    private wheel(e: React.WheelEvent<HTMLDivElement>) {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;

        if (e.deltaY < 0) {
            this.state.zoom = this.state.zoom - (this.state.zoom * this.state.zoomSpeed);
        } else if (e.deltaY > 0) {
            this.state.zoom = this.state.zoom + (this.state.zoom * this.state.zoomSpeed);
        }

        if (this.state.zoom < 0.001) { this.state.zoom = 0.001; }

        this.updatePanZoom();

        if (this.props.protoConn.startNode) {
            let p = this.toModelSpace(e.clientX, e.clientY);
            this.state.protoConnX = p[0];
            this.state.protoConnY = p[1];
            this.setState(this.state);
        }
    }

    private toModelSpace(x: number, y: number): vec2.Vec2 {
        // lazy
        let width = this.panzoom ? this.panzoom.clientWidth : 1;
        let height = this.panzoom ? this.panzoom.clientHeight : 1;

        return [1 / this.state.zoom * (x - width / 2 - this.state.zoom * this.state.panX), 1 / this.state.zoom * (y - height / 2 + this.state.zoom * this.state.panY)];
    }

    private matrix(): mat3.Mat3 {
        // TODO: this still sorta sucks
        let width = this.panzoom ? this.panzoom.clientWidth : 1;
        let height = this.panzoom ? this.panzoom.clientHeight : 1;

        let trans = mat3.translate(this.state.panX, -this.state.panY);
        let scale = mat3.scale(this.state.zoom, this.state.zoom);
        let centeri = mat3.translate(width / 2, height / 2);

        let mat = mat3.mult(mat3.mult(centeri, scale), trans);

        let tmat = [
            mat[0], mat[3], mat[6],
            mat[1], mat[4], mat[7],
            mat[2], mat[5], mat[8]];

        return tmat;
    }

    private matrixStr() {
        let tmat = this.matrix();

        let a = tmat[0];
        let c = tmat[1];
        let e = tmat[2];
        let b = tmat[3];
        let d = tmat[4];
        let f = tmat[5];

        return `matrix(${a},${b},${c},${d},${e},${f})`
    }

    private transformEle: SVGGElement;
    private updatePanZoom() {
        if (this.transformEle) {
            this.transformEle.setAttribute('transform', this.matrixStr());
        }
    }

    componentDidMount() {
        this.updatePanZoom();
        document.addEventListener("keydown", this.keyDown.bind(this));
        document.addEventListener("keyup", this.keyUp.bind(this));
    }

    componentDidUpdate() {
        // connect the conns with their rendered nodes
        for (const id in this.renderedConns) {
            const conn = this.renderedConns[id];
            if (!conn) continue;
            conn.setState({ offsetStartX: 0 });
        }
    }

    private keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        switch (e.key){
        case "Escape":
            this.props.dispatch({
                type: actions.PROTOCONN_END
            });
            break;
        case "Control":
            this.props.dispatch({
                type: actions.PAN_SET,
                value: true
            });
            break;
        case "z":
            if (e.metaKey || e.ctrlKey) {
                this.props.dispatch({
                    type: e.shiftKey ? actions.REDO : actions.UNDO
                });
            }
            break;
        case "Delete":
        case "Backspace":
            this.props.dispatch({
                type: actions.DELETE_SELECTED
            });
            break;
        }
    }

    private keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
        switch (e.key){
        case "Control":
            this.props.dispatch({
                type: actions.PAN_SET,
                value: false
            });
        }
    }

    // rendered elements
    private readonly renderedExprs: { [id: string]: FuncCallExpr } = {};
    private readonly renderedConns: { [id: string]: Conn } = {};
    private renderedMarquee: Marquee = null;
    private renderedProtoExpr: FuncCallExpr = null;

    private onConnRendered(id: string, e: Conn) {
        if (!e) {
            delete this.renderedConns[id];
            return;
        }

        const c = e.props.conn;
        this.renderedConns[c.id] = e;

        const start = this.renderedExprs[c.startNode];
        const end = this.renderedExprs[c.endNode];
        if (!start || !end) {
            console.error("could not find rendered start or end node for conn!")
            return;
        }

        e.setState({
            startX: start.x + start.width,
            startY: start.y,
            endX: end.x,
            endY: end.y
        })
    };

    private onExprRendered(id: string, e: FuncCallExpr) {
        if (!e) {
            delete this.renderedExprs[id];
            return;
        }

        this.renderedExprs[id] = e;
    };

    render() {
        let { dispatch, graph, lib, protoConn, selection, draggingSelection, protoExpr } = this.props;
        let { marqueeActive, marqueeEndX, marqueeEndY, marqueeStartX, marqueeStartY } = this.state;
        let mx = this.toModelSpace(this.state.mouseX, this.state.mouseY);

        return <div id='tela-graph-panzoom' ref={d => this.panzoom = d} onMouseEnter={this.mouseMove} onMouseLeave={this.mouseMove}
            onWheel={this.wheel} onMouseDown={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}>
            <svg id='tela-graph' width='100%' height='100%'>
                <g ref={d => this.transformEle = d as SVGGElement } transform={this.matrixStr()}>
                    <g key='exprs'>
                        {
                            graph.funcCallExprs.map((expr: model.FuncCallExprRecord) => {
                                return <g key={expr.id}>
                                    <FuncCallExpr ref={e => this.onExprRendered(expr.id, e) } expr={expr} selected={selection.contains(expr.id)} decl={lib.functions.get(expr.decl)} dispatch={dispatch} />
                                </g>
                            })
                        }
                    </g>
                    <g key='conns'>
                        {
                            graph.conns.map((conn: model.Conn) => <g key={conn.id}>
                                <Conn ref={ e => this.onConnRendered(conn.id, e) } conn={conn} start={lookupNode(graph, conn.startNode)} end={lookupNode(graph, conn.endNode)} dispatch={dispatch} />
                            </g>)
                        }
                    </g>
                    {
                        <g>
                            {
                                ProtoConn( this.renderedExprs[protoConn.startNode], protoConn.port, mx[0], mx[1])
                            } 
                            <Marquee ref={e => this.renderedMarquee = e} />
                        </g>
                    }
                    {
                        protoExpr ? <FuncCallExpr ref={e => {
                                this.renderedProtoExpr = e;
                                if (e){
                                    const pos = this.toModelSpace(this.state.mouseX, this.state.mouseY);
                                    e.setState({
                                        dragOffsetX : pos[0],
                                        dragOffsetY: pos[1]
                                    });
                                }
                            }} expr={protoExpr} selected={selection.contains(protoExpr.id)} decl={lib.functions.get(protoExpr.decl)}  dispatch={dispatch} /> : null
                    }
                </g>
            </svg>
        </div>;
    }
}
export const Graph = connect((e: model.Editor) => {
    return { 
            graph: e.graph, 
            panEnabled: e.panEnabled, 
            draggingSelection: e.draggingSelection, 
            selection: e.selection, 
            lib: e.lib, 
            protoConn: e.protoConn, 
            protoExpr : e.protoExpr };
})(graph);

export function lookupNode(graph: model.Graph, nodeId: string): model.Node {
    return graph.funcCallExprs.find((x) => x.id == nodeId);
}

let funcLib = model.defaultLib.get("functions") as Map<string, model.FunctionDecl>;

export const newExpr = (t: string): model.FuncCallExprRecord => {
    let fd = funcLib.get(t);

    return model
        .defaultExpr
        .merge({
            id: nextId(),
            decl: t,
            in: fd.in,
            out: fd.out
        });
};
