function clean(text) {
	//getting rid of linebreaks and tabs
	var out = text.replace(/\n/g, "").replace(/\t/g, "");
	//changing image SRCs
	out = out.replace(/<img src=\"Images\//g, "<img src=\"");
	//replacing quotation marks (") with escape character ("")
	out = out.replace(/\"/g, "\"\"");
	return out;
}
//function for pulling out tags
function tags(text) {
	return "tags: "+text.split("<h2>[Tags]</h2>")[1].split("<!--/TAGS-->")[0]+"\n";
}

//function that pulls the cloze cards out of an HTML file
function cloze(text) {
	//function that tidies up a string representing a cloze-type card and returns a tuple of strings (front, back, tags)
	function clozeStrToTuple(text) {
		var out1 = text.split("[Text]</h3>")[1].split("<h3>[Extra]</h3>");
		var out2 = out1[1].split("<h3>[Source]</h3>");
		var out3 = out2[1].split("<h3>[Tags]</h3>");
		return [out1[0], out2[0], out3[0], out3[1].split("<hr><!----------/CARD---------->")[0]];
	}
	const cards = text.match(/<!----------CARD---------->(.*?)<!----------\/CARD---------->/g);
	if (cards!=null&&cards.length>0) {
		return cards.map(clozeStrToTuple);
	} else {
		return cards;
	}
}
//function that takes the text of a cloze card and adds numbers to any unnumbered cloze deletions
//#e.g. "{{c::}}" -> "{{c1::}}"
function enumerateClozes(cardText) {
	var clozes = cardText.match(/{{c::/g);
	if (clozes!=null&&clozes.length>0) {
		for (var i = 0; i < clozes.length; i++) {
			cardText = cardText.replace(/{{c::/, "{{c"+(i+1)+"::");
		}
	}
	return cardText;
}
module.exports ={clean, tags, cloze, enumerateClozes}
