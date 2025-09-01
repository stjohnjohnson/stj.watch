# St. John's 24-Hour Charity Stream Event Page

## Colors

```#1AC1DD```

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