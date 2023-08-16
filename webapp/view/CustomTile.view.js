sap.ui.define([
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/m/library",
	"sap/m/NumericContent"
], function(
	GenericTile,
	TileContent,
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
			debugger;
			if (url === "") {
				return;
			}
			else{
				url =  jQuery.sap.getModulePath("view.css.", "/" + url);
			}
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
			});
		},

		getTileControl: function() {
			var oController = this.getController();

			return new GenericTile({
				frameType: "TwoByOne",
				header: "{/data/display_title_text}",
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
					content: [new NumericContent({
						scale: "{/data/display_number_factor}",
						value: "{/data/display_number_value}",
						truncateValueTo: 5, //Otherwise, The default value is 4.
						indicator: "{/data/display_state_arrow}",
						valueColor: {
							path: "/data/display_number_state",
							formatter: function(sValueColor) {
								if (!ValueColor[sValueColor]) {
									sValueColor = ValueColor.Neutral;
								}
								return sValueColor;
							}
						},
						icon: "{/data/display_icon_url}",
						width: "100%"
					})]
				})],
				press: [oController.onPress, oController]
			}).addStyleClass("brownie");
		},


		onBeforeRendering : function(){
			debugger;
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
			debugger;
			this._addCSSFile("style.css");
		},

		getMode: function() {
			return this.getModel().getProperty("/mode");
		}
	});
});