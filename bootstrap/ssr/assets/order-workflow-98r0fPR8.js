//#region resources/js/lib/order-workflow.ts
var stages = {
	pending_payment: 0,
	paid: 1,
	processing: 2,
	ready_to_ship: 3,
	shipment_created: 3,
	shipped: 4,
	delivered: 5,
	completed: 6
};
var shippingStatuses = {
	not_created: ["Belum dibuat", "amber"],
	creating: ["Sedang dibuat", "amber"],
	confirmed: ["Pengiriman dikonfirmasi", "amber"],
	scheduled: ["Pengiriman terjadwal", "amber"],
	allocated: ["Kurir ditugaskan", "amber"],
	picking_up: ["Kurir menuju lokasi penjemputan", "amber"],
	picked: ["Paket dijemput", "blue"],
	in_transit: ["Dalam perjalanan", "blue"],
	dropping_off: ["Diantar ke penerima", "blue"],
	delivered: ["Paket terkirim", "green"],
	cancelled: [
		"Pengiriman dibatalkan",
		"red",
		true
	],
	failed: [
		"Pengiriman gagal",
		"red",
		true
	],
	rejected: [
		"Pengiriman ditolak",
		"red",
		true
	],
	courier_not_found: [
		"Kurir tidak ditemukan",
		"red",
		true
	],
	problem: [
		"Pengiriman bermasalah",
		"red",
		true
	],
	lost: [
		"Paket hilang",
		"red",
		true
	],
	returned: [
		"Paket dikembalikan",
		"red",
		true
	],
	on_hold: [
		"Pengiriman ditahan sementara",
		"amber",
		true
	],
	return_in_transit: [
		"Dalam perjalanan kembali",
		"amber",
		true
	],
	disposed: [
		"Paket dimusnahkan",
		"red",
		true
	]
};
function getShippingStatusPresentation(status) {
	const value = status?.trim() ?? "";
	const presentation = Object.hasOwn(shippingStatuses, value) ? shippingStatuses[value] : void 0;
	return {
		label: (presentation?.[0] ?? value.split("_").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")) || "-",
		tone: presentation?.[1] ?? "gray",
		issue: presentation?.[2] ?? false
	};
}
function getOrderWorkflow(order) {
	const currentStep = Math.max(stages[order.order_status] ?? 0, ...(order.status_history ?? []).map((entry) => stages[entry.status ?? ""] ?? 0), order.payment_status === "paid" || order.paid_at ? 1 : 0, order.shipment?.biteship_order_id ? 3 : 0, order.shipment?.shipped_at ? 4 : 0, order.shipment?.delivered_at ? 5 : 0);
	const issues = {
		shipment_failed: "Pesanan gagal dikirim.",
		cancelled: "Pesanan dibatalkan.",
		refunded: "Pembayaran dikembalikan.",
		payment_failed: "Pembayaran gagal.",
		payment_expired: "Pembayaran kedaluwarsa.",
		manual_review: "Pembayaran memerlukan pemeriksaan manual.",
		failed: "Pengiriman gagal.",
		lost: "Paket hilang.",
		returned: "Paket dikembalikan.",
		problem: "Pengiriman sedang mengalami kendala.",
		on_hold: "Pengiriman ditahan sementara oleh kurir.",
		return_in_transit: "Paket sedang dalam perjalanan kembali.",
		disposed: "Paket dinyatakan dimusnahkan oleh kurir."
	};
	const issue = order.booking_uncertain ? "Hasil booking belum diketahui. Verifikasi di Biteship sebelum mencoba lagi." : order.shipping_issue?.label ?? issues[order.order_status] ?? {
		failed: "Pembayaran gagal.",
		expired: "Pembayaran kedaluwarsa.",
		partially_refunded: "Pembayaran dikembalikan sebagian."
	}[order.payment_status] ?? issues[order.payment_status] ?? issues[order.shipping_status] ?? null;
	return {
		currentStep,
		completed: order.order_status === "completed" && !issue,
		issue
	};
}
//#endregion
export { getShippingStatusPresentation as n, getOrderWorkflow as t };

//# sourceMappingURL=order-workflow-98r0fPR8.js.map