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
