'use babel';

import AnkiAtomView from './anki-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  ankiAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ankiAtomView = new AnkiAtomView(state.ankiAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ankiAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'anki-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ankiAtomView.destroy();
  },

  serialize() {
    return {
      ankiAtomViewState: this.ankiAtomView.serialize()
    };
  },

  toggle() {
    console.log('AnkiAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
