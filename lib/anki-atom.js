const {CompositeDisposable} = require('atom')

module.exports = {
  subscriptions: null,

  activate () {
    Database = require('better-sqlite3');
    path=require('path');
    sql=require('./sql');
    fs=require('fs');
    rimraf=require('rimraf');
    archiver = require('archiver');

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:export': () => this.export()})
    )
		this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:exportTxt': () => this.exportTxt()})
    )
		this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:template': () => this.template()})
    )
		this.subscriptions.add(atom.commands.add('atom-workspace',
      {'anki-atom:exportTable': () => this.exportTable()})
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
		this.subscriptions.add(atom.commands.add('atom-text-editor',
			{'anki-atom:newCard': () => this.newCard()})
		)
	},
  deactivate () {
    this.subscriptions.dispose()
  },
	//exports current template as a comma-separated txt file
  exportTxt() {
		const fs = require('fs');
		const cw = require('./cardWrangling.js');
		const editor = atom.workspace.getActiveTextEditor();
		const fileText = cw.clean(editor.getText());
		const formattedTags = cw.tags(fileText);
		const clozeCards = cw.cloze(fileText);
		//Saving to file
		var path = require('path');
		const activeEditorPath = editor.getPath();
		var fileWithExt = path.basename(activeEditorPath);
		var file = fileWithExt.substring(0, fileWithExt.lastIndexOf("."));
		var dir = path.dirname(activeEditorPath);
		if (clozeCards!=null&&clozeCards.length>0) {
			fs.writeFile(dir+"/Output/"+file+".txt", formattedTags, {flag: 'w'}, err=>{});
			for (var i = 0; i < clozeCards.length; i++) {
				line = "\""+cw.enumerateClozes(clozeCards[i][0])+"\";\""+clozeCards[i][1]+"\";\""+clozeCards[i][2]+"\";\""+clozeCards[i][3]+"\"\n";
				fs.appendFile(dir+"/Output/"+file+".txt", line, err=>{});
			}
		}
	},
	//exports current template as a .apkg file

  export() {
		//reading and formatting cards from template
    const apkg = require('./apkg');
		const out = new apkg.APKG({
      name: 'VocabularyBuilder',
      card: {
          fields: ['word', 'meaning', 'usage'],
          template: {
              question: '{{word}}',
              answer: `
                <div class="word">{{word}}</div>
                <div class="meaning">{{meaning}}</div>
                <div class="usage">{{usage}}</div>
              `
          },
          styleText: '.card { text-align: center; }'
      }
  });
  out.addCard({
      timestamp: +new Date(), // create time
      content: ['sample word', 'sample meaning', 'sample usage'] // keep the order same as `fields` defined above
  });
  out.save(__dirname);
	},
	//creates a new template in current folder
	template() {
		const fs = require('fs');
		const path = require('path');
		const projectPath = atom.project.getPaths();
		const text = "<!--Template version 1.0-->\n<h1> Anki cards template </h1>\n\n<!--TAGS-->\n<h2>[Tags]</h2>\n\n<!--/TAGS-->";
		fs.appendFile(projectPath[0]+"/template.html", text, {flag: 'ax'}, err=>{});
	},
	//takes a table in csv format and creates a new template with cloze cards for each column-row pair
	exportTable(){
		const fs = require('fs');
		const editor = atom.workspace.getActiveTextEditor();
		const tableArray = editor.getText().split("\n");
		for (var i = 0; i < tableArray.length; i++) {
			tableArray[i] = tableArray[i].split(",");
		}
		const tableName = tableArray[0][0];
		//making output file
		var path = require('path');
		const activeEditorPath = editor.getPath();
		var fileWithExt = path.basename(activeEditorPath);
		var file = fileWithExt.substring(0, fileWithExt.lastIndexOf("."));
		var dir = path.dirname(activeEditorPath);
		fs.writeFile(dir+"/"+file+".html","<!--Template version 1.0-->\n<h1>"+tableName+"</h1>\n\n<!--TAGS-->\n<h2>[Tags]</h2>\n\n<!--/TAGS-->\n", {flag: 'w'}, err=>{});
		//reading CSV
		const nRows = tableArray.length;
		const nCols = tableArray[1].length;
		for (var row = 2; row < nRows; row++) {
			if(tableArray[row].length!=nCols){
				break;
			}else{
			for (var col = 1; col < nCols; col++) {
				var out = "<!----------CLOZE---------->\n<hr><h3>[Text]</h3>\n<b><u>"+tableName+"</b></u><br>\n"+"<b>"+tableArray[1][0]+"</b>: "+tableArray[row][0]+"<br>\n"+"<b>"+tableArray[1][col]+"</b>: {{c::"+tableArray[row][col]+"}}\n<h3>[Extra]</h3>\n"+tableArray[0][1]+"\n<h3>[Source]</h3>\n"+tableArray[0][2]+"\n<h3>[Tags]</h3>\n"+tableArray[0][3]+"\n<hr>\n<!----------/CLOZE---------->\n\n";
				fs.appendFile(dir+"/"+file+".html", out, err=>{});
			}
		}
		}
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
	},
	newCard(){
		const editor = atom.workspace.getActiveTextEditor();
		editor.insertText('<!----------CARD---------->\n<hr><h3>[Text]</h3>\n\n<h3>[Extra]</h3>\n\n<h3>[Source]</h3>\n\n<h3>[Tags]</h3>\n\n<hr>\n<!----------/CARD---------->\n')
	}
}
