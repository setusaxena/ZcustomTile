sap.ui.define([], function() {
	"use strict";

	return {

		// Formate the image name to absolute URI
		imageToURI: function(imageName) {
			return jQuery.sap.getModulePath("view.images.", "/" + imageName);
		}
	};
});