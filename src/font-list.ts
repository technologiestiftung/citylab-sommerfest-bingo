/// <reference types="types-for-adobe/InDesign/2018"/>

function main() {
	var list = new Array(); // a list

	// loop through the fonts and add their info in a list
	for (var i = 0; i < app.fonts.length; i++) {
		list.push("app.fonts.item(" + String(i) + ") --> " + app.fonts[i].name);
	} // end loop
	// write the list to a file
	var file = new File("~/Desktop/font-list.txt");
	file.open("w");
	file.write(list.join("\n"));
	file.close();
}
main(); // main everything is in here
