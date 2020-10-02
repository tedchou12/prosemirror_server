export default function subscribeOnUpdates(editorView, callback) {
  var dispatch = (editorView._props.dispatchTransaction || editorView.dispatch).bind(editorView);

  var handler = function handler(tr) {
    var oldState = editorView.state;
    dispatch(tr);
    callback(tr, oldState, editorView.state);
  };

  if (editorView._props.dispatchTransaction) {
    editorView._props.dispatchTransaction = handler;
  } else {
    editorView.dispatch = handler;
  }
}