sap.ui.define([
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/m/ImageContent",
	"sap/m/library",
	"sap/m/NumericContent"
], function(
	GenericTile,
	TileContent,
	ImageContent,
	mobileLibrary,
	NumericContent
) {
	"use strict";

	// shortcut for sap.m.ValueColor
	var ValueColor = mobileLibrary.ValueColor;

	sap.ui.jsview("view.CustomTile", {
		getControllerName: function() {
			return "view.CustomTile";
		},

		createContent: function() {
			this.setHeight("100%");
			var tileControl = this.getTileControl();
			return tileControl;
		},

		_addCSSFile: function(url) {
			//TODO we need a better way of attaching the CSS, this is just a temporary workaround.
			if (url === "") {
				return;
			} else {
				url = jQuery.sap.getModulePath("view.css.", "/" + url);
			}
			if (!window.cssInsertedArray) {
				window.cssInsertedArray = [];
			} else {
				if (window.cssInsertedArray.indexOf(url) > -1) {
					return; //No action, CSS already exists
				}
			}
			var addedCSSURI = url;

			return new Promise((resolve, reject) => {
				let link = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.onload = () => {
					resolve();
					console.log('style has loaded');
				};
				link.href = url;

				let headScript = document.querySelector('script');
				headScript.parentNode.insertBefore(link, headScript);
				window.cssInsertedArray.push(url);
			});
		},

		getTileControl: function() {
			var oController = this.getController();

			return new GenericTile({
				frameType: "TwoByOne",
				header: "{/data/display_title_text}",
				subheader: "{/data/display_subtitle_text}",
				tileContent: [new TileContent({
					frameType: "TwoByOne",
					footer: "{/data/display_info_text}",
					footerColor: {
						path: "/data/display_info_state",
						formatter: function(sFooterColor) {
							if (sFooterColor === "Positive") {
								sFooterColor = ValueColor.Good;
							}
							if (sFooterColor === "Negative") {
								sFooterColor = ValueColor.Error;
							}

							if (!ValueColor[sFooterColor]) {
								sFooterColor = ValueColor.Neutral;
							}

							return sFooterColor;
						}
					},
					unit: "{/data/display_number_unit}",
					//We'll utilize NumericContent for the "Dynamic" content.
					content: [new ImageContent({
						src: {
							path: "/config/service_url",
							formatter: function(imgSrc) {
								debugger;
								return jQuery.sap.getModulePath("view.images.", "/" + imgSrc)
							}
						}
					})]
				})],
				press: [oController.onPress, oController]
			});
		},
		/*
		We should change the color of the text in the footer ("info") to be as received in the tile data in the property (infostate).
		We used to have this functionality when we used the BaseTile. (we added a class which change the text color).
		Today The GenericTile doesn't support this feature, and it is impossible to change the text color.
		Since this feature is documented, we should support it - See BCP:1780008386.
		*/
		onAfterRendering: function() {
			var oModel = this.getModel(),
				sDisplayInfoState = oModel.getProperty("/data/display_info_state"),
				elDomRef = this.getDomRef(),
				elFooterInfo = elDomRef ? elDomRef.getElementsByClassName("sapMTileCntFtrTxt")[0] : null;

			if (elFooterInfo) {
				switch (sDisplayInfoState) {
					case "Negative":
						//add class for Negative.
						elFooterInfo.classList.add("sapUshellTileFooterInfoNegative");
						break;
					case "Neutral":
						//add class for Neutral.
						elFooterInfo.classList.add("sapUshellTileFooterInfoNeutral");
						break;
					case "Positive":
						//add class for Positive.
						elFooterInfo.classList.add("sapUshellTileFooterInfoPositive");
						break;
					case "Critical":
						//add class for Critical.
						elFooterInfo.classList.add("sapUshellTileFooterInfoCritical");
						break;
					default:
						return;
				}
			}
			this._addCSSFile("style.css");
		},

		getMode: function() {
			return this.getModel().getProperty("/mode");
		}
	});
});