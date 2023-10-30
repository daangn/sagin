.PHONY: copy-migrations

SHELL := /bin/bash

copy-migrations:
	@for f in sagin-app/migrations/*.sql; do cp -f "$$f" "initdb.d/tmp-app-$${f##*/}"; done
	@for f in sagin-indexer/migrations/*.sql; do cp -f "$$f" "initdb.d/tmp-indexer-$${f##*/}"; done
