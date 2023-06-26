/// <reference types="types-for-adobe/InDesign/2018"/>

const numberOfPages = 50;
const numbersOnPage = 25;
const numberPointSize = 30;
const scriptPath = new File($.fileName).path;
const dejaVuSans = "DejaVu Sans\tBold";
function generateUniqueRandomNumbers(
	len: number,
	min: number,
	max: number
): number[] {
	let arr: number[] = [];
	while (arr.length < len) {
		let r = Math.floor(Math.random() * (max - min + 1)) + min;
		let exists = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === r) {
				exists = true;
				break;
			}
		}
		if (!exists) arr.push(r);
	}
	return arr;
}

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
	strokeWeight: 1,
	strokeColor: doc.swatches.item("Black"),
	strokeTint: 75,
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
	const numbers = [
		...generateUniqueRandomNumbers(numbersOnPage / 5, 1, 15),
		...generateUniqueRandomNumbers(numbersOnPage / 5, 16, 30),
		...generateUniqueRandomNumbers(numbersOnPage / 5, 31, 45),
		...generateUniqueRandomNumbers(numbersOnPage / 5, 46, 60),
		...generateUniqueRandomNumbers(numbersOnPage / 5, 61, 75),
	];
	const isCenter = (idx: number): boolean => {
		return idx === 12;
	};
	for (let i = 0; i < numbers.length; i++) {
		let x =
			pageProps.marginPreferences.left + (Math.floor(i / 5) * widthGutter) / 5;
		let y = pageProps.marginPreferences.top + ((i % 5) * heightGutter) / 5;
		let w = widthGutter / 5;
		let h = heightGutter / 5;

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

		const paragraph = textFrame.paragraphs[0];
		paragraph.properties = {
			appliedFont: isCenter(i) ? "DejaVu Sans\tBold" : "National\tBold Italic",
			pointSize: isCenter(i) ? numberPointSize * 2 : numberPointSize,
			fillColor: doc.swatches.item("Black"),
			justification: Justification.CENTER_JUSTIFIED,
		};
	}
}
defaultPage.remove();
