/// <reference types="types-for-adobe/InDesign/2018"/>
// @include "lib/unique-numbers.js"
// @include "lib/json2.js"
var numberOfPages = 1;
var maxRandom = 75;
var numbersOnPage = 25;
var numberPointSize = 30;
var scriptPath = new File($.fileName).path;
var dejaVuSans = "DejaVu Sans\tBold";
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
// const strokeStyles = [];
// for (let i = 0; i < doc.strokeStyles.count(); i++) {
// 	strokeStyles.push({ id: i, name: doc.strokeStyles.item(i).name });
// }
// alert(JSON.stringify(strokeStyles));
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
    strokeWeight: 0.5,
    strokeColor: doc.swatches.item("Black"),
    strokeTint: 75,
    strokeType: doc.strokeStyles.item(13),
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
    // page.properties = pageProps;
    page.appliedMaster = masterSpread;
    var layer = doc.layers[0];
    // Create the numbers
    var numbers = generateUniqueRandomNumbers(numbersOnPage);
    var isCenter = function (idx) {
        return idx === 12;
    };
    var stars = [];
    for (var i = 0; i < numbers.length; i++) {
        var x = pageProps.marginPreferences.left + ((i % 5) * widthGutter) / 5;
        var y = pageProps.marginPreferences.top + (Math.floor(i / 5) * heightGutter) / 5;
        var w = widthGutter / 5;
        var h = heightGutter / 5;
        // if (i % 5 !== 0) {
        // 	const star = page.textFrames.add(layer, undefined, undefined, {
        // 		geometricBounds: [y - 10, x - 10, y + 10, x + 10],
        // 		contents: "\u2605",
        // 		textFramePreferences: {
        // 			verticalJustification: VerticalJustification.CENTER_ALIGN,
        // 		},
        // 	});
        // 	star.paragraphs[0].properties = {
        // 		appliedFont: dejaVuSans,
        // 		pointSize: 32 + (Math.random() * 20 - 10),
        // 		justification: Justification.CENTER_JUSTIFIED,
        // 	};
        // 	star.fit(FitOptions.CONTENT_TO_FRAME);
        // 	stars.push(star);
        // }
        var textFrame = page.textFrames.add(layer, undefined, undefined, {
            geometricBounds: [y, x, y + h, x + w],
            // U+2605 is a star
            // ★
            // BLACK STAR
            // Unicode: U+2605, UTF-8: E2 98 85
            contents: isCenter(i) ? "\u2605" : numbers[i].toString(),
            textFramePreferences: {
                verticalJustification: VerticalJustification.CENTER_ALIGN
            },
            appliedObjectStyle: objectStyleTextFrame
        });
        textFrame.bottomLeftCornerRadius = 5 + Math.random() * 10;
        textFrame.bottomRightCornerRadius = 5 + Math.random() * 10;
        textFrame.topLeftCornerRadius = 5 + Math.random() * 10;
        textFrame.topRightCornerRadius = 5 + Math.random() * 10;
        // textFrame.bottomLeftCornerOption = CornerOptions.ROUNDED_CORNER;
        // textFrame.topLeftCornerOption = CornerOptions.INVERSE_ROUNDED_CORNER;
        textFrame.topRightCornerOption = CornerOptions.ROUNDED_CORNER;
        var paragraph = textFrame.paragraphs[0];
        paragraph.properties = {
            appliedFont: isCenter(i) ? dejaVuSans : "National\tBold Italic",
            pointSize: isCenter(i) ? numberPointSize * 2 : numberPointSize,
            fillColor: doc.swatches.item("Black"),
            justification: Justification.CENTER_JUSTIFIED
        };
    }
    for (var s = 0; s < stars.length; s++) {
        stars[s].bringToFront();
    }
}
defaultPage.remove();
