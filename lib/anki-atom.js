const {CompositeDisposable} = require('atom')

module.exports = {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:export': () => this.export()})
    )
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:cloze': () => this.cloze()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:bold': () => this.bold()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:underline': () => this.underline()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:italics': () => this.italics()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:listItem': () => this.listItem()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:bulletList': () => this.bulletList()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:numberedList': () => this.numberedList()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:subscript': () => this.subscript()})
		)
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:superscript': () => this.superscript()})
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
  },
	//commands for text shortcuts
	cloze() {
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('{{c::'+selection+'}}')
	},
	bold(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('<b>'+selection+'</b>')

	},
	underline(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('<u>'+selection+'</u>')
	},
	italics(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('<i>'+selection+'</i>')
	},
	listItem(){
		const editor = atom.workspace.getActiveTextEditor();
		editor.moveToEndOfLine()
    editor.insertText("</li>")
    editor.selectToBeginningOfLine()
    selection = editor.getSelectedText()
    editor.insertText("		<li>"+selection)
	},
	bulletList(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('	<ul>\n'+selection+'\n	</ul>')
	},
	numberedList(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('	<ol>\n'+selection+'\n	</ol>')
	},
	subscript(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('<sub>'+selection+'</sub>')
	},
	superscript(){
		const editor = atom.workspace.getActiveTextEditor();
		selection = editor.getSelectedText();
		editor.insertText('<sup>'+selection+'</sup>')
	}
}
