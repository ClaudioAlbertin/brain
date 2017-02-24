
default:
	grunt default

.PHONY: test
test:
	grunt test

.PHONY: build
build:
	grunt build

.PHONY: clean
clean:
	rm -rf ./build
