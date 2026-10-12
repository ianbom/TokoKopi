import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getOrderWorkflow } from '../../resources/js/lib/order-workflow.ts';

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
