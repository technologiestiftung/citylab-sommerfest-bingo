var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var numberOfPages = 50;
var numbersOnPage = 25;
var numberPointSize = 30;
var scriptPath = new File($.fileName).path;
var dejaVuSans = "DejaVu Sans\tBold";
function generateUniqueRandomNumbers(len, min, max) {
    var arr = [];
    while (arr.length < len) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        var exists = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === r) {
                exists = true;
                break;
            }
        }
        if (!exists)
            arr.push(r);
    }
    return arr;
}
app.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
app.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
var docProps = {
    documentPreferences: {
        pageWidth: 210,
        pageHeight: 297,
        facingPages: false
    },
    viewPreferences: {
        horizontalMeasurementUnits: MeasurementUnits.MILLIMETERS,
        verticalMeasurementUnits: MeasurementUnits.MILLIMETERS
    }
};
var doc = app.documents.add(true, undefined, docProps);
var pageProps = {
    marginPreferences: {
        top: 30,
        left: 10,
        bottom: 30,
        right: 10
    }
};
var defaultPage = doc.pages[0];
var objectStyleTextFrame = doc.objectStyles.add({
    name: "Bingo-Number",
    strokeWeight: 1,
    strokeColor: doc.swatches.item("Black"),
    strokeTint: 75,
    bottomLeftCornerOption: CornerOptions.FANCY_CORNER,
    bottomRightCornerOption: CornerOptions.FANCY_CORNER,
    topLeftCornerOption: CornerOptions.FANCY_CORNER,
    topRightCornerOption: CornerOptions.FANCY_CORNER
});
var masterSpread = doc.masterSpreads.add(1, { name: "Bingo-Master" });
var masterPage = masterSpread.pages.item(0);
masterPage.properties = pageProps;
var widthGutter = parseInt(doc.documentPreferences.pageWidth) -
    pageProps.marginPreferences.left -
    pageProps.marginPreferences.right;
var heightGutter = parseInt(doc.documentPreferences.pageHeight) -
    pageProps.marginPreferences.top -
    pageProps.marginPreferences.bottom;
var masterFrame = masterPage.textFrames.add(undefined, undefined, undefined, {
    geometricBounds: [
        0,
        pageProps.marginPreferences.left,
        pageProps.marginPreferences.top,
        pageProps.marginPreferences.left + widthGutter,
    ],
    contents: "\u2605 Sommerfest Bingo",
    textFramePreferences: {
        verticalJustification: VerticalJustification.CENTER_ALIGN
    }
});
masterFrame.paragraphs[0].properties = {
    appliedFont: "National\tBold Italic",
    pointSize: 24,
    fillColor: doc.swatches.item("Black"),
    justification: Justification.LEFT_ALIGN
};
masterFrame.paragraphs[0].characters.item(0).properties = {
    appliedFont: dejaVuSans,
    pointSize: 24,
    fillColor: doc.swatches.item("Black")
};
var logo = masterPage.rectangles.add(undefined, undefined, undefined, {
    appliedObjectStyle: doc.objectStyles.item(0),
    geometricBounds: [
        docProps.documentPreferences.pageHeight -
            pageProps.marginPreferences.bottom,
        docProps.documentPreferences.pageWidth -
            pageProps.marginPreferences.right * 4 -
            25,
        docProps.documentPreferences.pageHeight,
        docProps.documentPreferences.pageWidth - pageProps.marginPreferences.right,
    ]
});
logo.place(File(scriptPath + "/../assets/logo-citylab-berlin-outline.svg"));
logo.fit(FitOptions.CENTER_CONTENT);
logo.fit(FitOptions.PROPORTIONALLY);
for (var _index = 0; _index < numberOfPages; _index++) {
    var page = doc.pages.add();
    page.appliedMaster = masterSpread;
    var layer = doc.layers[0];
    var numbers = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], generateUniqueRandomNumbers(numbersOnPage / 5, 1, 15), true), generateUniqueRandomNumbers(numbersOnPage / 5, 16, 30), true), generateUniqueRandomNumbers(numbersOnPage / 5, 31, 45), true), generateUniqueRandomNumbers(numbersOnPage / 5, 46, 60), true), generateUniqueRandomNumbers(numbersOnPage / 5, 61, 75), true);
    var isCenter = function (idx) {
        return idx === 12;
    };
    for (var i = 0; i < numbers.length; i++) {
        var x = pageProps.marginPreferences.left + (Math.floor(i / 5) * widthGutter) / 5;
        var y = pageProps.marginPreferences.top + ((i % 5) * heightGutter) / 5;
        var w = widthGutter / 5;
        var h = heightGutter / 5;
        var textFrame = page.textFrames.add(layer, undefined, undefined, {
            geometricBounds: [y, x, y + h, x + w],
            contents: isCenter(i) ? "\u2605" : numbers[i].toString(),
            textFramePreferences: {
                verticalJustification: VerticalJustification.CENTER_ALIGN
            },
            appliedObjectStyle: objectStyleTextFrame
        });
        var paragraph = textFrame.paragraphs[0];
        paragraph.properties = {
            appliedFont: isCenter(i) ? "DejaVu Sans\tBold" : "National\tBold Italic",
            pointSize: isCenter(i) ? numberPointSize * 2 : numberPointSize,
            fillColor: doc.swatches.item("Black"),
            justification: Justification.CENTER_JUSTIFIED
        };
    }
}
defaultPage.remove();
