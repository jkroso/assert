
serve: node_modules
	@node_modules/serve/bin/serve -Slojp 0

test: node_modules
	@node example.js

node_modules: package.json
	@packin install --meta $< --folder $@

.PHONY: serve test
