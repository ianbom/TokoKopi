import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { slugify } from '../../resources/js/lib/slug.ts';

test('product slugs normalize coffee names, punctuation and blank input', () => {
    assert.equal(slugify('  Gayo Natural 250g  '), 'gayo-natural-250g');
    assert.equal(
        slugify('Toraja / Espresso & Filter'),
        'toraja-espresso-filter',
    );
    assert.equal(slugify(''), '');
    assert.equal(slugify('   '), '');
});

test('asterisk fields show a red star while other fields retain existing labels', () => {
    const source = readFileSync(
        new URL(
            '../../resources/js/components/form-validation.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.CommonJS,
        },
    });
    const componentModule = { exports: {} };
    new Function('require', 'module', 'exports', compiled.outputText)(
        createRequire(import.meta.url),
        componentModule,
        componentModule.exports,
    );
    const render = (props) =>
        renderToStaticMarkup(
            createElement(
                componentModule.exports.FormField,
                {
                    name: 'name',
                    label: 'Nama produk',
                    required: true,
                    ...props,
                },
                createElement('input'),
            ),
        );
    const marked = render({ requiredIndicator: 'asterisk' });
    assert.match(marked, /class="ml-1 text-destructive">\*<\/span>/);
    assert.doesNotMatch(marked, /\(wajib\)/);
    assert.match(render({}), /\(wajib\)/);
    assert.match(render({ required: false }), /\(opsional\)/);
});
