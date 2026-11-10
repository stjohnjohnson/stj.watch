# St. John's 25-Hour Charity Stream Event Page

## Colors

```#1AC1DD```

## Annual participant update

Set `extra_life_participant_id` in `_config.yml` to the new campaign's participant ID. The fundraising totals and the `/donate` and `/extralife` redirects all use this setting. The footer links to `/extralife`, and `/extra-life` is an alias for it. Restart the local Jekyll server after changing configuration.

Redirect destinations live in `_redirect/`. Fixed destinations use `target` in front matter; destinations that need Liquid variables use an `.html` file with the URL as its body. The shared redirect layout accepts either form.

## Local Development

```
brew install chruby ruby-install
ruby-install ruby 3.3.5
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
echo "chruby ruby-3.3.5" >> ~/.zshrc # run 'chruby' to see actual version
gem install bundler
```

```
bundle update
bundle install
bundle exec jekyll serve
open http://0.0.0.0:4000/
```

## Sources

 - [SinglePaged Jekyll theme](https://github.com/t413/SinglePaged)
 - [FontAwesome](https://fontawesome.com/)
 - [Animated Stars](https://hakim.se)
 - [Final Countdown JQuery](http://hilios.github.io/jQuery.countdown/)
 - [Favicon Generator](https://favicon.io/)

## Stream recaps and highlights

The **watch** section lives in `_posts/2000-01-05-watch.html`. Add years and clips to `_data/streams.yml`, newest first. Each clip needs its Twitch slug, display title, and public URL. The supplied year groups and explicitly requested display titles are authoritative; avoid guessing dates from Twitch's relative ages.

Recap posters are optional. Store them under `img/recaps/` and set the year's `recap.image` and descriptive `recap.alt`. The Watch archive displays posters without full-size links. The homepage thank-you summary renders the game breakdown as responsive HTML: two illustrated cards followed by ranked bars. Add `duration_hours` and an ordered `games` list with each game’s `name` and unrounded `minutes` to the matching stream entry. Percentages are calculated from game time only; durations below one hour display as minutes. The two featured games each have an `image` path to standalone, text-free artwork. Use landscape images with a 2:1 aspect ratio; labels and statistics are rendered below them as HTML. Original poster files remain intact. Keep image sources and verified data with the original Extra Life campaign materials.

A recap appears near the homepage introduction only when its `participant_id` matches `_config.yml`'s `extra_life_participant_id`. At the January campaign rollover, updating that one setting retires the featured recap; the **watch** archive retains every year. The archive defaults to the newest saved year, regardless of the active fundraising campaign. Restart/rebuild Jekyll after changing configuration.

The clips player uses the actual hostname for Twitch's required parent setting and disables autoplay. Narrow layouts below Twitch's minimum player width hide the player and let clip titles open Twitch directly. Desktop users can also open a clip link in a new tab using the usual browser modifier keys; clips and VODs can also be removed by Twitch, so verify links periodically. Without JavaScript, the year-grouped lists still open on Twitch.

After `bundle exec jekyll build`, run `node --test tests/*.test.cjs` to check the rendered archive, rollover visibility, clip URLs, and fundraising behavior. For a rollover check, build into a temporary destination with an overridden participant ID, then run the build tests with `WATCH_BUILD_DIR` pointing to that destination and `WATCH_FEATURED=false`.


The thank-you summary and current campaign's Watch entry reuse the existing live Extra Life aggregate feed, showing cents and labeling the amount as raised so far. A failed or invalid first response leaves the amount hidden rather than showing zero. Historical Watch totals come from `_data/fundraising.yml`; after rollover, record the finalized 2026 result there to display it in the archive. No new donation requests or donor records are introduced. Keep explicit closing/end-of-stream clips last in each year's catalog.
