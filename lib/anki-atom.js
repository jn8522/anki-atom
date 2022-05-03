const {CompositeDisposable} = require('atom')

module.exports = {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:export': () => this.export()})
    )
  },

  deactivate () {
    this.subscriptions.dispose()
  },
  export() {
		function modify(text) {
			return text.toUpperCase()
		}
		const editor = atom.workspace.getActiveTextEditor();
		words = editor.getText();
		console.log(modify(words))
  }
}
