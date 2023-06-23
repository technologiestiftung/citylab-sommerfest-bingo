/// <reference types="types-for-adobe/InDesign/2018"/>
// @include "lib/unique-numbers.js"
// @include "lib/json2.js"
const numberOfPages = 1;
const maxRandom = 75;
const numbersOnPage = 25;
const numberPointSize = 30;
const scriptPath = new File($.fileName).path;
const dejaVuSans = "DejaVu Sans\tBold";

app.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
app.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

const docProps = {
	documentPreferences: {
		pageWidth: 210,
		pageHeight: 297,
		facingPages: false,
	},
	viewPreferences: {
		horizontalMeasurementUnits: MeasurementUnits.MILLIMETERS,
		verticalMeasurementUnits: MeasurementUnits.MILLIMETERS,
	},
};
const doc = app.documents.add(true, undefined, docProps);
// const strokeStyles = [];
// for (let i = 0; i < doc.strokeStyles.count(); i++) {
// 	strokeStyles.push({ id: i, name: doc.strokeStyles.item(i).name });
// }

// alert(JSON.stringify(strokeStyles));

const pageProps = {
	marginPreferences: {
		top: 30,
		left: 10,
		bottom: 30,
		right: 10,
	},
};
const defaultPage = doc.pages[0];

const objectStyleTextFrame = doc.objectStyles.add({
	name: "Bingo-Number",
	strokeWeight: 0.5,
	strokeColor: doc.swatches.item("Black"),
	strokeTint: 75,
	strokeType: doc.strokeStyles.item(13),

	bottomLeftCornerOption: CornerOptions.FANCY_CORNER,
	bottomRightCornerOption: CornerOptions.FANCY_CORNER,
	topLeftCornerOption: CornerOptions.FANCY_CORNER,
	topRightCornerOption: CornerOptions.FANCY_CORNER,
});

const masterSpread = doc.masterSpreads.add(1, { name: "Bingo-Master" });
const masterPage = masterSpread.pages.item(0);
masterPage.properties = pageProps;

const widthGutter =
	parseInt(doc.documentPreferences.pageWidth as string) -
	pageProps.marginPreferences.left -
	pageProps.marginPreferences.right;
const heightGutter =
	parseInt(doc.documentPreferences.pageHeight as string) -
	pageProps.marginPreferences.top -
	pageProps.marginPreferences.bottom;

const masterFrame = masterPage.textFrames.add(undefined, undefined, undefined, {
	geometricBounds: [
		0,
		pageProps.marginPreferences.left,
		pageProps.marginPreferences.top,
		pageProps.marginPreferences.left + widthGutter,
	],
	contents: "\u2605 Sommerfest Bingo",
	textFramePreferences: {
		verticalJustification: VerticalJustification.CENTER_ALIGN,
	},
});
masterFrame.paragraphs[0].properties = {
	appliedFont: "National\tBold Italic",
	pointSize: 24,
	fillColor: doc.swatches.item("Black"),
	justification: Justification.LEFT_ALIGN,
};

masterFrame.paragraphs[0].characters.item(0).properties = {
	appliedFont: dejaVuSans,
	pointSize: 24,
	fillColor: doc.swatches.item("Black"),
};

const logo = masterPage.rectangles.add(undefined, undefined, undefined, {
	appliedObjectStyle: doc.objectStyles.item(0),
	geometricBounds: [
		docProps.documentPreferences.pageHeight -
			pageProps.marginPreferences.bottom,
		docProps.documentPreferences.pageWidth -
			pageProps.marginPreferences.right * 4 -
			25,
		docProps.documentPreferences.pageHeight,
		docProps.documentPreferences.pageWidth - pageProps.marginPreferences.right,
	],
	// fillColor: doc.swatches.item("Black"),
});

logo.place(File(scriptPath + "/../assets/logo-citylab-berlin-outline.svg"));
logo.fit(FitOptions.CENTER_CONTENT);
logo.fit(FitOptions.PROPORTIONALLY);
for (let _index = 0; _index < numberOfPages; _index++) {
	const page = doc.pages.add();
	// page.properties = pageProps;
	page.appliedMaster = masterSpread;
	const layer = doc.layers[0];

	// Create the numbers
	const numbers = generateUniqueRandomNumbers(numbersOnPage);
	const isCenter = (idx: number): boolean => {
		return idx === 12;
	};
	const stars = [];
	for (let i = 0; i < numbers.length; i++) {
		let x = pageProps.marginPreferences.left + ((i % 5) * widthGutter) / 5;
		let y =
			pageProps.marginPreferences.top + (Math.floor(i / 5) * heightGutter) / 5;
		let w = widthGutter / 5;
		let h = heightGutter / 5;
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
		const textFrame = page.textFrames.add(layer, undefined, undefined, {
			geometricBounds: [y, x, y + h, x + w],
			// U+2605 is a star
			// ★
			// BLACK STAR
			// Unicode: U+2605, UTF-8: E2 98 85
			contents: isCenter(i) ? "\u2605" : numbers[i].toString(),
			textFramePreferences: {
				verticalJustification: VerticalJustification.CENTER_ALIGN,
			},
			appliedObjectStyle: objectStyleTextFrame,
		});

		textFrame.bottomLeftCornerRadius = 5 + Math.random() * 10;
		textFrame.bottomRightCornerRadius = 5 + Math.random() * 10;
		textFrame.topLeftCornerRadius = 5 + Math.random() * 10;
		textFrame.topRightCornerRadius = 5 + Math.random() * 10;
		// textFrame.bottomLeftCornerOption = CornerOptions.ROUNDED_CORNER;
		// textFrame.topLeftCornerOption = CornerOptions.INVERSE_ROUNDED_CORNER;
		textFrame.topRightCornerOption = CornerOptions.ROUNDED_CORNER;
		const paragraph = textFrame.paragraphs[0];
		paragraph.properties = {
			appliedFont: isCenter(i) ? dejaVuSans : "National\tBold Italic",
			pointSize: isCenter(i) ? numberPointSize * 2 : numberPointSize,
			fillColor: doc.swatches.item("Black"),
			justification: Justification.CENTER_JUSTIFIED,
		};
	}
	for (let s = 0; s < stars.length; s++) {
		stars[s].bringToFront();
	}
}
defaultPage.remove();
