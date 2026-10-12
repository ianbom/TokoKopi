import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleanPageLabel } from '../../resources/js/lib/pagination-label.ts';

test('admin navigation labels become readable button text when enabled', () => {
    assert.equal(cleanPageLabel('pagination.previous', true), 'Previous');
    assert.equal(cleanPageLabel('pagination.next', true), 'Next');
    assert.equal(cleanPageLabel('&laquo; Previous', true), 'Previous');
    assert.equal(cleanPageLabel('Next &raquo;', true), 'Next');
});

test('page numbers and ellipses remain unchanged', () => {
    assert.equal(cleanPageLabel('3', true), '3');
    assert.equal(cleanPageLabel('...', true), '...');
});

test('navigation label conversion stays opt-in for excluded pages', () => {
    assert.equal(cleanPageLabel('pagination.previous'), 'pagination.previous');
    assert.equal(cleanPageLabel('pagination.next'), 'pagination.next');
});
