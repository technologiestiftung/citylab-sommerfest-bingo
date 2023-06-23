function main() {
    var list = new Array();
    for (var i = 0; i < app.fonts.length; i++) {
        list.push("app.fonts.item(" + String(i) + ") --> " + app.fonts[i].name);
    }
    var file = new File("~/Desktop/font-list.txt");
    file.open("w");
    file.write(list.join("\n"));
    file.close();
}
main();
