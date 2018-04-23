import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { DispatchProps } from './dispatchProps';

import * as model from './model'
import * as actions from './actions';

interface libState {
    showingItems: boolean;
}

class lib extends React.Component<model.Editor & DispatchProps, libState> {
    constructor(props: model.Editor & DispatchProps) {
        super(props);
        this.state = {
            showingItems: false
        };
    }

    render() {
        const { lib, dispatch } = this.props;
        const { showingItems } = this.state;

        return <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200px",
            maxHeight: "400px",
            background: "whitesmoke",
            zIndex: 1
        }}>
            <div 
                style={{
                    padding: "5px",
                    background: "#bbb",
                    textTransform: "uppercase",
                    fontSize: "12px" }}
                onClick={e => this.setState({ showingItems: !showingItems })}>
                    Library
            </div>
            <ul style={{ display: showingItems ? "block" : "none",
            padding: "10px", listStyle: "none" }}>
                {
                    lib.functions.toList().map((def: model.FunctionDecl) => {
                        return <li key={def.name}>
                            <span onClick={e => {
                                this.setState({ showingItems: !showingItems });
                                dispatch({
                                    type : actions.PROTO_EXPR_BEGIN, 
                                    name : def.name
                                })
                            } }>{ def.name }</span>
                        </li>
                    })
                }
            </ul>
        </div>;
    }
}

export const Lib = connect((e: model.Editor) => {
    return { lib: e.lib }
})(lib);

/*
const libController = librarie.CreateLibraryController();
const librarieEle = libController.createLibraryContainer();
const loadedTypes = {
    "loadedTypes": [
        {
        "fullyQualifiedName": "Child1",
        "iconUrl": "",
        "contextData": "Input",
        "itemType": "action",
        "keywords": ""
        },
        {
        "fullyQualifiedName": "Child2",
        "iconUrl": "",
        "contextData": "",
        "itemType": "action",
        "keywords": ""
        }
    ]
};

const layoutSpecs = {
    "sections": [
      {
        "text": "default",
        "iconUrl": "",
        "elementType": "section",
        "showHeader": false,
        "include": [],
        "childElements": [
          {
            "text": "Parent",
            "iconUrl": "",
            "elementType": "category",
            "include": [{ "path": "Child1" }, { "path": "Child2" }],
            "childElements": []
          }
        ]
      },
      {
        "text": "Miscellaneous",
        "iconUrl": "",
        "elementType": "section",
        "showHeader": true,
        "include": [],
        "childElements": []
      }
    ]
  };

let append = false;
libController.setLoadedTypesJson(loadedTypes, append);
libController.setLayoutSpecsJson(layoutSpecs, append);
libController.refreshLibraryView(); // Refresh library view.
*/