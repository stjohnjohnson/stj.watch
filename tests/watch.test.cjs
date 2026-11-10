const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const file = require('node:path').join(__dirname, '../js/watch.js');
const watch = fs.existsSync(file) ? require(file) : {};

function clipURL(id, host) {
    assert.equal(typeof watch.buildClipURL, 'function', 'clip URL builder is available');
    return new URL(watch.buildClipURL(id, host));
}

test('embeds clips on the clips endpoint with autoplay explicitly disabled', () => {
    const url = clipURL('BigWalk-abc_123', 'stj.watch');
    assert.equal(url.origin + url.pathname, 'https://clips.twitch.tv/embed');
    assert.equal(url.searchParams.get('clip'), 'BigWalk-abc_123');
    assert.equal(url.searchParams.get('autoplay'), 'false');
    assert.equal(url.searchParams.get('parent'), 'stj.watch');
});

test('uses the actual hostname for previews and alternate site hosts', () => {
    for (const host of ['localhost', '127.0.0.1', 'www.stj.watch']) {
        assert.equal(clipURL('Example-Clip', host).searchParams.get('parent'), host);
    }
});

test('clip identifiers cannot inject embed parameters', () => {
    assert.equal(typeof watch.buildClipURL, 'function');
    assert.throws(() => watch.buildClipURL('Example&autoplay=true', 'stj.watch'));
    assert.throws(() => watch.buildClipURL('', 'stj.watch'));
});

test('pages without an archive do not fail initialization', () => {
    assert.equal(typeof watch.initializeWatch, 'function');
    assert.doesNotThrow(() => watch.initializeWatch(null, 'stj.watch'));
});
