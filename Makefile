include variables.mk
include postgres.mk
include nodejs.mk
include nextjs.mk

.PHONY: network all-build all-start all-stop all-restart all-remove

network:
	@if ! docker network inspect $(NETWORK) >/dev/null 2>&1; then \
		docker network create $(NETWORK); \
		echo "Created network $(NETWORK)"; \
	else \
		echo "Network $(NETWORK) already exists"; \
	fi

all-build: db-build node-build next-build
all-start: db-start node-start next-start
all-stop: next-stop node-stop db-stop
all-restart: all-stop all-start
all-remove: next-remove node-remove db-remove

