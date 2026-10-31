//#region resources/js/lib/pagination-label.ts
function cleanPageLabel(label, normalizeNavigationLabels = false) {
	const cleanLabel = label.replace("&laquo;", "").replace("&raquo;", "").replace("«", "").replace("»", "").trim();
	if (!normalizeNavigationLabels) return cleanLabel;
	switch (cleanLabel.toLowerCase()) {
		case "pagination.previous":
		case "previous": return "Previous";
		case "pagination.next":
		case "next": return "Next";
		default: return cleanLabel;
	}
}
//#endregion
export { cleanPageLabel as t };

//# sourceMappingURL=pagination-label-CrVPXDV3.js.map