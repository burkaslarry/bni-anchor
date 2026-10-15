// Refresh crawlable HTML from the same member data and card renderer used by the UI.
// Run after editing js/members.js or the card renderer: node scripts/update-search-content.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const ctx = {window: {}, localStorage: {getItem: () => null}, matchMedia: () => ({matches: false}), document: {addEventListener() {}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/members.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync('js/app.js', 'utf8'), ctx);
const cards = vm.runInContext('window.BNI_MEMBERS.map(cardHTML).join("")', ctx);
const members = ctx.window.BNI_MEMBERS;
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/(<div class="grid" id="grid" aria-live="polite">)[\s\S]*?(<\/div>\s*<\/section>\s*<p class="empty")/, '$1' + cards + '\n      $2');
const start = html.indexOf('<script type="application/ld+json">');
const end = html.indexOf('</script>', start);
const schema = JSON.parse(html.slice(start + '<script type="application/ld+json">'.length, end));
const base = 'https://burkaslarry.github.io/bni-anchor/';
schema['@graph'] = schema['@graph'].filter(x => x['@type'] !== 'ItemList');
schema['@graph'].push({'@type': 'ItemList', '@id': base + '#member-list', name: 'BNI Anchor 會員名錄', numberOfItems: members.length, itemListElement: members.map((m, i) => ({'@type': 'ListItem', position: i + 1, item: {'@type': 'Person', name: m.name, jobTitle: m.professionZh, description: m.introZh, memberOf: {'@id': base + '#org'}}}))});
html = html.slice(0, start) + '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2).replace(/</g, '\\u003c') + '\n  ' + html.slice(end);
fs.writeFileSync('index.html', html.replace(/[ \t]+$/gm, ''));
console.log(`Refreshed ${members.length} crawlable member cards and matching ItemList.`);
