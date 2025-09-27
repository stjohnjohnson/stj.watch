.PHONY: update install serve build

update:
	bundle update

install:
	bundle install

serve:
	bundle exec jekyll serve --host 0.0.0.0

build:
	bundle exec jekyll build
