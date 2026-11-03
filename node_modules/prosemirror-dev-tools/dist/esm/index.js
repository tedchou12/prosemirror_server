import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "unstated";
import DevTools from "./dev-tools";
import EditorStateContainer from "./state/editor";
var DEVTOOLS_CLASS_NAME = "__prosemirror-dev-tools__";

function createPlace() {
  var place = document.querySelector(".".concat(DEVTOOLS_CLASS_NAME));

  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CLASS_NAME;
    document.body.appendChild(place);
  } else {
    ReactDOM.unmountComponentAtNode(place);
    place.innerHTML = "";
  }

  return place;
}

function applyDevTools(editorView, props) {
  var place = createPlace();
  var editorState = new EditorStateContainer(editorView, props);
  ReactDOM.render( /*#__PURE__*/React.createElement(Provider, {
    inject: [editorState]
  }, /*#__PURE__*/React.createElement(DevTools, null)), place);
}

export default applyDevTools;
export { applyDevTools };