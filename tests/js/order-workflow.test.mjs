import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    getOrderWorkflow,
    getShippingStatusPresentation,
} from '../../resources/js/lib/order-workflow.ts';

test('shipping status presentation covers Biteship stages and safe unknown fallbacks', () => {
    const knownStatuses = [
        'not_created',
        'creating',
        'confirmed',
        'scheduled',
        'allocated',
        'picking_up',
        'picked',
        'in_transit',
        'dropping_off',
        'delivered',
        'cancelled',
        'failed',
        'rejected',
        'courier_not_found',
        'problem',
        'lost',
        'returned',
        'on_hold',
        'return_in_transit',
        'disposed',
    ];

    for (const status of knownStatuses) {
        const presentation = getShippingStatusPresentation(status);
        assert.notEqual(presentation.label, status);
        assert.notEqual(presentation.tone, 'gray');
    }

    for (const [status, label, tone, issue] of [
        ['scheduled', 'Pengiriman terjadwal', 'amber', false],
        ['picking_up', 'Kurir menuju lokasi penjemputan', 'amber', false],
        ['dropping_off', 'Diantar ke penerima', 'blue', false],
        ['courier_not_found', 'Kurir tidak ditemukan', 'red', true],
        ['rejected', 'Pengiriman ditolak', 'red', true],
    ]) {
        assert.deepEqual(getShippingStatusPresentation(status), {
            label,
            tone,
            issue,
        });
    }

    assert.deepEqual(getShippingStatusPresentation('unknown_status'), {
        label: 'Unknown Status',
        tone: 'gray',
        issue: false,
    });
    assert.deepEqual(getShippingStatusPresentation('__proto__'), {
        label: 'Proto',
        tone: 'gray',
        issue: false,
    });

    for (const status of [null, undefined, '', '  ', '___']) {
        assert.deepEqual(getShippingStatusPresentation(status), {
            label: '-',
            tone: 'gray',
            issue: false,
        });
    }
});

test('workflow follows real progress and retains progress when shipping fails', () => {
    assert.equal(
        getOrderWorkflow({
            order_status: 'pending_payment',
            payment_status: 'failed',
            shipping_status: 'not_created',
        }).issue,
        'Pembayaran gagal.',
    );

    for (const [status, step] of Object.entries({
        pending_payment: 0,
        paid: 1,
        processing: 2,
        ready_to_ship: 3,
        shipment_created: 3,
        shipped: 4,
        delivered: 5,
        completed: 6,
    })) {
        const state = getOrderWorkflow({
            order_status: status,
            payment_status: status === 'pending_payment' ? 'pending' : 'paid',
            shipping_status: 'not_created',
        });
        assert.equal(state.currentStep, step);
        assert.equal(state.completed, status === 'completed');
    }

    const failed = getOrderWorkflow({
        order_status: 'shipment_failed',
        payment_status: 'paid',
        shipping_status: 'lost',
        status_history: [{ status: 'shipped' }],
    });
    assert.equal(failed.currentStep, 4);
    assert.ok(failed.issue);
    assert.equal(failed.completed, false);
    assert.ok(
        getOrderWorkflow({
            order_status: 'ready_to_ship',
            payment_status: 'paid',
            shipping_status: 'creating',
            booking_uncertain: true,
        }).issue,
    );
    assert.ok(
        getOrderWorkflow({
            order_status: 'pending_payment',
            payment_status: 'manual_review',
            shipping_status: 'not_created',
        }).issue,
    );
});
