.PHONY: setup setup-migrations clean clean-env clean-migrations generate generate-migrations

SHELL := /bin/bash

setup: setup-migrations

setup-migrations: clean-migrations
	@for f in sagin-db/migrations/*.sql; do cp -f "$$f" "initdb.d/tmp-$${f##*/}"; done

clean: clean-env clean-migrations

clean-env:
	@docker compose down -v

clean-migrations:
	@rm -f initdb.d/*.sql

generate: generate-migrations

generate-migrations:
	@yarn workspace @sagin/db generate
