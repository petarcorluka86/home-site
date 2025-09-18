# This Makefile is intended to be included by the root Makefile; it is not standalone.

.PHONY: db-build db-start db-stop db-restart db-remove

db-build:
	docker build -t $(POSTGRES_IMAGE) $(POSTGRES_DIR)

db-start: db-build network
	-@docker stop $(POSTGRES_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(POSTGRES_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(POSTGRES_CONTAINER) \
		--network $(NETWORK) \
		-p $(POSTGRES_PORT):$(POSTGRES_CONTAINER_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_HOST_AUTH_METHOD=$(POSTGRES_HOST_AUTH_METHOD) \
		$(POSTGRES_IMAGE)

db-stop:
	-@docker stop $(POSTGRES_CONTAINER) || true

db-restart: db-stop db-start

db-remove: db-stop
	-@docker rm -f $(POSTGRES_CONTAINER) || true