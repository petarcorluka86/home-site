# This Makefile is intended to be included by the root Makefile; it is not standalone.

.PHONY: node-build node-start node-stop node-restart node-remove

node-build:
	docker build -t $(NODE_IMAGE) $(NODE_DIR)

node-start: node-build network
	-@docker stop $(NODE_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(NODE_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(NODE_CONTAINER) \
		--network $(NETWORK) \
		-p $(NODE_PORT):$(NODE_CONTAINER_PORT) \
		-e HOSTNAME=$(NODE_HOST) \
		-e PORT=$(NODE_CONTAINER_PORT) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		$(NODE_IMAGE)

node-stop:
	-@docker stop $(NODE_CONTAINER) || true

node-restart: node-stop node-start

node-remove: node-stop
	-@docker rm -f $(NODE_CONTAINER) || true