// @flow

import {
  collab,
  getVersion,
  receiveTransaction,
  sendableSteps,
} from 'prosemirror-collab';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import EditorPlugins from '../EditorPlugins';
import EditorSchema from '../EditorSchema';
import uuid from '../uuid';
import { GET, POST } from './http';
// [FS] IRAD-1040 2020-09-02
import { Schema } from 'prosemirror-model';
import { stringify } from 'flatted';

function badVersion(err: Object) {
  return err.status == 400 && /invalid version/i.test(String(err));
}

var connection = null;

class State {
  edit: EditorState;
  comm: ?string;

  constructor(edit: ?EditorState, comm: ?string) {
    this.edit = edit;
    this.comm = comm;
  }
}

class EditorConnection {
  backOff: number;
  onReady: Function;
  ready: boolean;
  report: any;
  request: any;
  state: State;
  url: string;
  view: ?EditorView;
  schema: Schema;
  socket: any;

  constructor(onReady: Function, report: any, doc_id: string) {
    this.schema = null;
    this.report = report;
    this.doc_id = doc_id;
    this.state = new State(null, 'start');
    this.request = null;
    this.backOff = 0;
    this.view = null;
    this.dispatch = this.dispatch.bind(this);
    this.ready = false;
    this.onReady = onReady;
    this.socket = null;
    connection = this;
  }

  // [FS] IRAD-1040 2020-09-08
  getEffectiveSchema(): Schema {
    return (null != this.schema) ? this.schema : EditorSchema;
  }

  // All state changes go through this
  dispatch = (action: Object): void => {
    let newEditState = null;
    if (action.type == 'loaded') {
      const editState = EditorState.create({
        doc: action.doc,
        plugins: EditorPlugins.concat([
          collab({
            clientID: uuid(),
            version: action.version,
          }),
        ]),
      });
      this.state = new State(editState, 'poll');
      this.ready = true;
      this.onReady(editState);
      // this.poll();
      // this.cursor_poll();
    } else if (action.type == 'restart') {
      this.state = new State(null, 'start');
      this.ws_start();
    } else if (action.type == 'poll') {
      this.state = new State(this.state.edit, 'poll');
      // this.poll();
    } else if (action.type == 'recover') {
      if (action.error.status && action.error.status < 500) {
        this.report.failure(action.error);
        this.state = new State(null, null);
      } else {
        this.state = new State(this.state.edit, 'recover');
        this.recover(action.error);
      }
    } else if (action.type == 'transaction') {
      newEditState = this.state.edit
        ? this.state.edit.apply(action.transaction)
        : null;
    }

    if (newEditState) {
      let sendable;
      if (newEditState.doc.content.size > 40000) {
        if (this.state.comm !== 'detached') {
          this.report.failure('Document too big. Detached.');
        }
        this.state = new State(newEditState, 'detached');
      } else if (action.requestDone) {
        this.state = new State(newEditState, 'poll');
        // this.poll();
      } else if (
        (this.state.comm == 'poll') &&
        (sendable = this.sendable(newEditState))
      ) {
        // this.closeRequest();
        this.state = new State(newEditState, 'send');
        this.ws_send(newEditState, sendable);
      } else {
        this.state = new State(newEditState, this.state.comm);
      }
    }

    // Sync the editor with this.state.edit
    if (this.state.edit && this.view) {
      this.view.updateState(this.state.edit);
    }
  };

  // Send cursor updates to the server
  cursor_send(selection: Object): void {
    const content = {selection: selection,
                      clientID: uuid()};
    const json = JSON.stringify({type: 'selection', data: content});
    this.socket.send(json);
  }

  ws_start(): void {
    var ws_url = 'ws://192.168.1.2:9300';
    var ws_url = ws_url + '?user_id=' + this.user_id + '&doc_id=' + this.doc_id;
    this.socket = new WebSocket(ws_url);

    this.socket.onopen = function(e) {
      //does something when socket opens
    }

    // replaces poll
    this.socket.onmessage = function(e) {
      connection.report.success();
      var data = JSON.parse(e.data);
      var json = data.data;

      if (data.type == 'init') {
        connection.dispatch({
          type: 'loaded',
          doc: connection.getEffectiveSchema().nodeFromJSON(json.doc_json),
          version: json.version,
          users: json.users,
        });
      } else if (data.type == 'step') {
        connection.backOff = 0;
        if (json.steps && json.steps.length) {
          const tr = receiveTransaction(
            connection.state.edit,
            json.steps.map(j => Step.fromJSON(connection.getEffectiveSchema(), j)),
            json.clientIDs
          );
          connection.dispatch({
            type: 'transaction',
            transaction: tr,
            requestDone: false,
          });
        }
      } else {
        console.log(json);
      }
    }

    //try reconnects
    this.socket.onclose = function(e) {
      // Too far behind. Revert to server state
      if (true) {
        connection.report.failure(err);
        connection.dispatch({ type: 'restart' });
      } else {
        connection.closeRequest();
        connection.setView(null);
      }
    }
  }

  ws_send(editState: EditorState, sendable: Object) {
    const { steps } = sendable;
    const content = {version: getVersion(editState),
                     steps: steps ? steps.steps.map(s => s.toJSON()) : [],
                     clientID: steps ? steps.clientID : 0};
    const json = JSON.stringify({type: 'content', data: content});
    this.socket.send(json);
    this.report.success();
    this.backOff = 0;
    const tr = steps
      ? receiveTransaction(
        this.state.edit,
        steps.steps,
        repeat(steps.clientID, steps.steps.length)
      )
      : this.state.edit.tr;

    this.dispatch({
      type: 'transaction',
      transaction: tr,
      requestDone: true,
    });
  }

  ws_recover(): void {
    const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;
    if (newBackOff > 1000 && this.backOff < 1000) {
      this.report.delay(err);
    }
    this.backOff = newBackOff;
    setTimeout(() => {
      if (this.state.comm == 'recover') {
        this.dispatch({ type: 'restart' });
      }
    }, this.backOff);
  }

  sendable(editState: EditorState): ?{ steps: Array<Step> } {
    const steps = sendableSteps(editState);
    if (steps) {
      return { steps };
    }
    return null;
  }

  // [FS] IRAD-1040 2020-09-02
  // Send the modified schema to server
  updateSchema(schema: Schema) {
	// to avoid cyclic reference error, use flatted string.
	const schemaFlatted = stringify(schema);
    this.run(POST(this.url + '/schema/', schemaFlatted, 'text/plain')).then(
      data => {
        console.log("collab server's schema updated");
        // [FS] IRAD-1040 2020-09-08
        this.schema = schema;
        this.start();
      },
      err => {
        this.report.failure(err);
      }
    );
  }

  // Try to recover from an error
  recover(err: Error): void {
    const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;
    if (newBackOff > 1000 && this.backOff < 1000) {
      this.report.delay(err);
    }
    this.backOff = newBackOff;
    setTimeout(() => {
      if (this.state.comm == 'recover') {
        this.dispatch({ type: 'poll' });
      }
    }, this.backOff);
  }

  closeRequest(): void {
    if (this.request) {
      this.request.abort();
      this.request = null;
    }
  }

  run(request: any): Promise<any> {
    return (this.request = request);
  }

  close(): void {
    this.closeRequest();
    this.setView(null);
  }

  setView(view: EditorView): void {
    if (this.view) {
      this.view.destroy();
    }
    this.view = window.view = view;
  }
}

function repeat(val: any, n: number): Array<any> {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(val);
  }
  return result;
}

export default EditorConnection;
