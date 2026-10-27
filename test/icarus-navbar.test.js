const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { test } = require('node:test');
const vm = require('node:vm');
const { patchNavbar, patchNavbarRoute } = require('../scripts/icarus-navbar');

const original = "$navbar.find('.has-dropdown').filter(':hover')";

test('uses native hover matching for empty and multiple dropdown sets', () => {
    for (const elements of [[], [
        { matches: selector => selector === ':hover' },
        { matches: () => false }
    ]]) {
        const $navbar = {
            find(selector) {
                assert.equal(selector, '.has-dropdown');
                return {
                    filter(predicate) {
                        assert.equal(typeof predicate, 'function');
                        return elements.filter((element, index) => predicate(index, element));
                    }
                };
            }
        };
        const selected = vm.runInNewContext(patchNavbar(original), { $navbar });
        assert.deepEqual(selected, elements.slice(0, 1));
    }
});

test('patching the same asset twice is a no-op', () => {
    const patched = patchNavbar(original);
    assert.equal(patchNavbar(patched), patched);
});

test('rejects unexpected or ambiguous navbar source', () => {
    assert.throws(() => patchNavbar('different navbar code'), /Unexpected Icarus/);
    assert.throws(() => patchNavbar(original + original), /Unexpected Icarus/);
});

test('updates only the generated navbar route and supports repeated generation', async () => {
    let source = original;
    let writes = 0;
    const site = {
        route: {
            get(route) {
                assert.equal(route, 'js/navbar.js');
                return Readable.from([source]);
            },
            set(route, value) {
                assert.equal(route, 'js/navbar.js');
                source = value;
                writes++;
            }
        }
    };
    await patchNavbarRoute(site);
    await patchNavbarRoute(site);
    assert.equal(source, patchNavbar(original));
    assert.equal(writes, 1);
});

test('fails clearly when the expected asset is missing', async () => {
    await assert.rejects(patchNavbarRoute({ route: { get: () => undefined } }), /navbar asset is missing/);
});

test('does not register the workaround for another theme version', () => {
    const source = readFileSync(path.join(__dirname, '../scripts/icarus-navbar.js'), 'utf8');
    let registrations = 0;
    vm.runInNewContext(source, {
        require(id) {
            return id === 'hexo-theme-icarus/package.json' ? { version: '7.0.2' } : require(id);
        },
        module: { exports: {} },
        hexo: { extend: { filter: { register: () => registrations++ } } }
    });
    assert.equal(registrations, 0);
});

test('does not register the workaround when Icarus is not the active theme', () => {
    const source = readFileSync(path.join(__dirname, '../scripts/icarus-navbar.js'), 'utf8');
    let registrations = 0;
    vm.runInNewContext(source, {
        require(id) {
            return id === 'hexo-theme-icarus/package.json' ? { version: '7.0.1' } : require(id);
        },
        module: { exports: {} },
        hexo: {
            config: { theme: 'landscape' },
            extend: { filter: { register: () => registrations++ } }
        }
    });
    assert.equal(registrations, 0);
});
