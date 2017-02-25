
default:
	gulp

.PHONY: test
test:
	gulp test

.PHONY: build
build:
	gulp build

.PHONY: clean
clean:
	gulp clean

.PHONY: cloc
cloc:
	cloc ./ --exclude-dir=node_modules,build --exclude-ext=sublime-project,sublime-workspace,DS_Store
