import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getVariantSelection } from '../../resources/js/lib/product-variant-selection.ts';

const option = (id, weight, grind, stock = 3, price = 120000, sale = null) => ({
    id,
    net_weight: weight,
    grind_type: grind,
    available_stock: stock,
    regular_price: price,
    sale_price: sale,
    image_url: '/products/' + id + '.jpg',
});

const variants = [
    option(1, '100 g', 'whole_bean', 0),
    option(2, '200 g', 'whole_bean'),
    option(3, '200 g', 'coarse', 2, 150000, 125000),
    option(4, '500 g', 'medium', 1, 200000),
    option(5, '200 g', 'fine', 0),
];

test('weight starts at first stocked option, grind requires explicit selection', () => {
    const initial = getVariantSelection(variants, undefined, undefined);
    assert.equal(initial.initialWeight, '200 g');
    assert.deepEqual(initial.weights, [
        { value: '100 g', available: false },
        { value: '200 g', available: true },
        { value: '500 g', available: true },
    ]);
    const pending = getVariantSelection(
        variants,
        initial.initialWeight,
        undefined,
    );
    assert.equal(pending.requiresGrind, true);
    assert.equal(pending.variant, null);
    assert.equal(pending.previewPrice, 120000);
    assert.equal(pending.previewVariant.id, 2);
});

test('grinds distinguish missing combinations from sold out combinations', () => {
    const selection = getVariantSelection(variants, '200 g', undefined);
    assert.deepEqual(selection.grinds, [
        { value: 'whole_bean', exists: true, available: true },
        { value: 'coarse', exists: true, available: true },
        { value: 'medium', exists: false, available: false },
        { value: 'fine', exists: true, available: false },
    ]);
    assert.equal(getVariantSelection(variants, '200 g', 'fine').variant, null);
    assert.equal(
        getVariantSelection(variants, '200 g', 'medium').variant,
        null,
    );
});

test('final combination resolves exact ID price stock and image without producer', () => {
    const { variant } = getVariantSelection(variants, '200 g', 'coarse');
    assert.equal(variant.id, 3);
    assert.equal(variant.sale_price, 125000);
    assert.equal(variant.available_stock, 2);
    assert.equal(variant.image_url, '/products/3.jpg');
    const changedWeight = getVariantSelection(variants, '500 g', undefined);
    assert.equal(changedWeight.variant, null);
    assert.equal(changedWeight.previewPrice, 200000);
    assert.equal(changedWeight.previewVariant.id, 4);
});

test('weight preview picks one stocked variant by effective price then ID', () => {
    const options = [
        option(4, '200 g', 'fine', 1, 180000, 150000),
        option(2, '200 g', 'coarse', 1, 170000),
        option(1, '200 g', 'medium', 0, 100000, 0),
        option(3, '200 g', 'whole_bean', 1, 160000, 150000),
    ];
    const selection = getVariantSelection(options, '200 g', undefined);
    assert.equal(selection.previewVariant.id, 3);
    assert.equal(selection.previewVariant.regular_price, 160000);
    assert.equal(selection.previewPrice, 150000);
});

test('weight preview uses sold-out options only when none are stocked', () => {
    const options = [
        option(2, '200 g', 'fine', 0, 120000, 0),
        option(1, '200 g', 'coarse', 0, 120000, 0),
    ];
    const selection = getVariantSelection(options, '200 g', undefined);
    assert.equal(selection.previewVariant.id, 1);
    assert.equal(selection.previewPrice, 0);
});

test('preview keeps regular and sale prices on the same variant', () => {
    for (const sale of [null, 120000, 100000, 0]) {
        const variant = option(1, '200 g', 'fine', 1, 120000, sale);
        const selection = getVariantSelection([variant], '200 g', undefined);
        assert.equal(selection.previewVariant, variant);
        assert.equal(selection.previewPrice, sale ?? 120000);
    }
    assert.equal(
        getVariantSelection([], undefined, undefined).previewVariant,
        null,
    );
});

test('no grind resolves automatically, mixed null grind requires explicit choice', () => {
    const drinks = [option(7, '100 ml', null)];
    assert.equal(
        getVariantSelection(drinks, '100 ml', undefined).requiresGrind,
        false,
    );
    assert.equal(
        getVariantSelection(drinks, '100 ml', undefined).variant.id,
        7,
    );
    const mixed = [...drinks, option(8, '100 ml', 'fine')];
    assert.equal(getVariantSelection(mixed, '100 ml', undefined).variant, null);
    assert.equal(getVariantSelection(mixed, '100 ml', null).variant.id, 7);
});

test('duplicates select smallest stocked ID and keep weight labels distinct', () => {
    const duplicates = [
        option(9, '200 g', 'fine'),
        option(3, '200 g', 'fine'),
        option(1, '200 g', 'fine', 0),
        option(4, '200gram', 'fine'),
    ];
    const selection = getVariantSelection(duplicates, '200 g', 'fine');
    assert.equal(selection.variant.id, 3);
    assert.equal(selection.weights.length, 2);
});

test('empty weights use default group and empty catalogs cannot resolve', () => {
    const legacy = [option(10, null, null), option(11, '', null)];
    assert.deepEqual(getVariantSelection(legacy, null, undefined).weights, [
        { value: null, available: true },
    ]);
    assert.equal(getVariantSelection(legacy, null, undefined).variant.id, 10);
    assert.equal(getVariantSelection([], undefined, undefined).variant, null);
    assert.equal(
        getVariantSelection([], undefined, undefined).initialWeight,
        undefined,
    );
    assert.equal(
        getVariantSelection(
            [option(1, '200 g', 'fine', 0)],
            undefined,
            undefined,
        ).initialWeight,
        undefined,
    );
});
