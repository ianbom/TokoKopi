export interface ShippingIssue {
    status: string;
    label: string;
    description: string;
    reason?: string | null;
}

interface WorkflowOrder {
    order_status: string;
    payment_status: string;
    shipping_status: string;
    booking_uncertain?: boolean;
    shipping_issue?: ShippingIssue | null;
    paid_at?: string | null;
    status_history?: { status: string | null }[];
    shipment?: {
        biteship_order_id?: string | null;
        shipped_at?: string | null;
        delivered_at?: string | null;
    } | null;
}

const stages: Record<string, number> = {
    pending_payment: 0,
    paid: 1,
    processing: 2,
    ready_to_ship: 3,
    shipment_created: 3,
    shipped: 4,
    delivered: 5,
    completed: 6,
};

export function getOrderWorkflow(order: WorkflowOrder) {
    const currentStep = Math.max(
        stages[order.order_status] ?? 0,
        ...(order.status_history ?? []).map(
            (entry) => stages[entry.status ?? ''] ?? 0,
        ),
        order.payment_status === 'paid' || order.paid_at ? 1 : 0,
        order.shipment?.biteship_order_id ? 3 : 0,
        order.shipment?.shipped_at ? 4 : 0,
        order.shipment?.delivered_at ? 5 : 0,
    );
    const issues: Record<string, string> = {
        shipment_failed: 'Pesanan gagal dikirim.',
        cancelled: 'Pesanan dibatalkan.',
        refunded: 'Pembayaran dikembalikan.',
        payment_failed: 'Pembayaran gagal.',
        payment_expired: 'Pembayaran kedaluwarsa.',
        manual_review: 'Pembayaran memerlukan pemeriksaan manual.',
        failed: 'Pengiriman gagal.',
        lost: 'Paket hilang.',
        returned: 'Paket dikembalikan.',
        problem: 'Pengiriman sedang mengalami kendala.',
        on_hold: 'Pengiriman ditahan sementara oleh kurir.',
        return_in_transit: 'Paket sedang dalam perjalanan kembali.',
        disposed: 'Paket dinyatakan dimusnahkan oleh kurir.',
    };
    const paymentIssues: Record<string, string> = {
        failed: 'Pembayaran gagal.',
        expired: 'Pembayaran kedaluwarsa.',
        partially_refunded: 'Pembayaran dikembalikan sebagian.',
    };
    const issue = order.booking_uncertain
        ? 'Hasil booking belum diketahui. Verifikasi di Biteship sebelum mencoba lagi.'
        : (order.shipping_issue?.label ??
          issues[order.order_status] ??
          paymentIssues[order.payment_status] ??
          issues[order.payment_status] ??
          issues[order.shipping_status] ??
          null);

    return {
        currentStep,
        completed: order.order_status === 'completed' && !issue,
        issue,
    };
}
