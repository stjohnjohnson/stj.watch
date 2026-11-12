(function () {
    'use strict';

    function buildClipURL(clipID, hostname) {
        if (!/^[A-Za-z0-9_-]+$/.test(clipID)) throw new Error('Invalid Twitch clip ID');
        var params = new URLSearchParams({clip: clipID, parent: hostname, autoplay: 'false'});
        return 'https://clips.twitch.tv/embed?' + params.toString();
    }

    function buildVideoURL(videoID, hostname) {
        if (!/^[0-9]+$/.test(videoID)) throw new Error('Invalid Twitch video ID');
        var params = new URLSearchParams({video: 'v' + videoID, parent: hostname, autoplay: 'false'});
        return 'https://player.twitch.tv/?' + params.toString();
    }

    function initializeWatch(root, hostname) {
        if (!root || root.dataset.watchReady) return;
        var panels = Array.from(root.querySelectorAll('[data-year]'));
        var buttons = Array.from(root.querySelectorAll('[data-year-select]'));
        var posters = Array.from(root.querySelectorAll('[data-poster-year]'));
        var links = Array.from(root.querySelectorAll('[data-clip-id], [data-video-id]'));
        var player = root.querySelector('#watch-player');
        var playback = root.querySelector('.watch-playback');
        var selectedURL;
        if (!panels.length || !links.length || !player) return;

        function syncPlayer() {
            var fits = playback.getBoundingClientRect().width >= 400;
            root.querySelector('.watch-player-area').hidden = !fits;
            if (fits && selectedURL && player.getAttribute('src') !== selectedURL) {
                player.src = selectedURL;
            } else if (!fits) {
                player.removeAttribute('src');
            }
        }

        function selectClip(link) {
            links.forEach(function (item) { item.removeAttribute('aria-current'); });
            link.setAttribute('aria-current', 'true');
            var title = link.querySelector('.watch-clip-label').textContent;
            root.querySelector('#watch-clip-title').textContent = title;
            player.title = title + ' — Twitch ' + (link.dataset.videoId ? 'video' : 'clip');
            selectedURL = link.dataset.videoId ? buildVideoURL(link.dataset.videoId, hostname) : buildClipURL(link.dataset.clipId, hostname);
            syncPlayer();
        }

        function selectYear(year) {
            var selected = panels.find(function (panel) { return panel.dataset.year === year; });
            if (!selected) return;
            panels.forEach(function (panel) { panel.hidden = panel !== selected; });
            buttons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.yearSelect === year));
            });
            var hasRecap = false;
            posters.forEach(function (poster) {
                poster.hidden = poster.dataset.posterYear !== year;
                if (!poster.hidden) hasRecap = true;
            });
            root.querySelector('.watch-posters').hidden = !hasRecap;
            root.classList.toggle('watch-has-recap', hasRecap);
            selectClip(selected.querySelector('[data-clip-id], [data-video-id]'));
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () { selectYear(button.dataset.yearSelect); });
        });
        links.forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0 || playback.getBoundingClientRect().width < 400) return;
                event.preventDefault();
                selectClip(link);
            });
        });
        root.dataset.watchReady = 'true';
        root.querySelector('.watch-year-controls').hidden = false;
        root.querySelector('.watch-player-area').hidden = false;
        selectYear(panels[0].dataset.year);
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(syncPlayer).observe(playback);
        } else {
            window.addEventListener('resize', syncPlayer);
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {buildClipURL: buildClipURL, buildVideoURL: buildVideoURL, initializeWatch: initializeWatch};
    }
    if (typeof document !== 'undefined') {
        var start = function () { initializeWatch(document.getElementById('watch-archive'), window.location.hostname); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
        else start();
    }
}());
