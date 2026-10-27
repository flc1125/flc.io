const { text } = require('node:stream/consumers');
const themeVersion = require('hexo-theme-icarus/package.json').version;

// Icarus 7.0.1 passes :hover to jQuery's selector filter on every Escape key.
// Use native matching in the generated asset; never modify the installed theme.
// Remove this workaround when adopting an upstream release with the fix.
const original = "$navbar.find('.has-dropdown').filter(':hover')";
const replacement = "$navbar.find('.has-dropdown').filter((_, element) => element.matches(':hover'))";

function patchNavbar(source) {
    if (!source.includes(original) && source.split(replacement).length === 2) {
        return source;
    }
    if (source.split(original).length !== 2 || source.includes(replacement)) {
        throw new Error('Unexpected Icarus 7.0.1 navbar code. Review the navbar workaround before building.');
    }
    return source.replace(original, replacement);
}

async function patchNavbarRoute(site) {
    const path = 'js/navbar.js';
    const stream = site.route.get(path);
    if (!stream) {
        throw new Error('Icarus 7.0.1 navbar asset is missing. Review the navbar workaround before building.');
    }
    const source = await text(stream);
    const patched = patchNavbar(source);
    if (patched !== source) {
        site.route.set(path, patched);
    }
}

if (typeof hexo !== 'undefined' && themeVersion === '7.0.1' && hexo.config.theme === 'icarus') {
    hexo.extend.filter.register('after_generate', () => patchNavbarRoute(hexo));
}

module.exports = { patchNavbar, patchNavbarRoute };
