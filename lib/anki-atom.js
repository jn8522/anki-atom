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
		//function for any tidying that has to be done to all card text
		function clean(text) {
			//getting rid of linebreaks
			var out = text.replace(/\n/g, "").replace(/\t/g, "");
			//changing image SRCs
			out = out.replace(/<img src=\"Images\//g, "<img src=\"");
			//replacing quotation marks (") with escape character ("")
			out = out.replace(/\"/g, "\"\"");
			return out;
		}
		//function for pulling out tags
		function tags(text) {
			return text.split("<h2>[Tags]</h2>")[1].split("<!--/TAGS-->")[0];
		}
		//function that tidies up a string representing a basic-type card and returns a tuple of strings (front, back, tags)
		function basicStrToTuple(text) {
			var out1 = text.split("[Front]</h3>")[1].split("<h3>[Back]</h3>");
			var out2 = out1[1].split("<h3>[Tags]</h3>");
			return [out1[0], out2[0], out2[1].split("<hr><!----------/BASIC---------->")[0]];
		}
		//same for a cloze card
		function clozeStrToTuple(text) {
			var out1 = text.split("[Text]</h3>")[1].split("<h3>[Extra]</h3>");
			var out2 = out1[1].split("<h3>[Tags]</h3>");
			return [out1[0], out2[0], out2[1].split("<hr><!----------/CLOZE---------->")[0]];
		}
		//function that pulls the basic cards out of an HTML file
		function basic(text) {
			const out = text.match(/<!----------BASIC---------->(.*?)<!----------\/BASIC---------->/g)
			return out;
		}
		//and the cloze
		function cloze(text) {
			const out = text.match(/<!----------CLOZE---------->(.*?)<!----------\/CLOZE---------->/g)
			return out;
		}
		//Applying to current file
		const editor = atom.workspace.getActiveTextEditor();
		const fileText = clean(editor.getText());
		const basicCards = basic(fileText).map(basicStrToTuple);
		const clozeCards = cloze(fileText).map(clozeStrToTuple);
		console.log(basicCards);
		//Saving to file
		//var path = require('path');
		//const activeEditorPath = editor.getPath();
		//var fileWithExt = path.basename(activeEditorPath);
		//var file = fileWithExt.substring(0, fileWithExt.lastIndexOf("."));
		//console.log(file);
		//var dir = path.dirname(activeEditorPath);
		//fs.appendFile(dir+"/"+file+".txt", words, function (err) {
		//	if (err) throw err;
		//	console.log('Saved!');
		//});
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
