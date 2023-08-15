jQuery.sap.declare("controls.ColourfulDynamicTile");
jQuery.sap.require("sap.ushell.ui.tile.DynamicTile");
sap.ushell.ui.tile.DynamicTile.extend("controls.ColourfulDynamicTile", {
	metadata: {
		properties: {
			bgColor: {
				type: "string"
			},
			borderColor: {
				type: "string"
			}
		}
	}
});