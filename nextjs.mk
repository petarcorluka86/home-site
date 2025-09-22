# This Makefile is intended to be included by the root Makefile; it is not standalone.

.PHONY: next-build next-start next-stop next-restart next-remove

next-build:
	docker build -t $(NEXT_IMAGE) $(NEXT_DIR)

next-build-dev: 
	docker build -t $(NEXT_IMAGE) -f $(NEXT_DIR)/Dockerfile.dev $(NEXT_DIR)

next-silent-cleanup:
	-@docker stop $(NEXT_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(NEXT_CONTAINER) >/dev/null 2>&1 || true

next-run: next-silent-cleanup
	docker run -d \
	--name $(NEXT_CONTAINER) \
	--network $(NETWORK) \
	-p $(NEXT_PORT):$(NEXT_CONTAINER_PORT) \
	$(NEXT_IMAGE)

next-run-dev: next-silent-cleanup
	docker run --rm -it \
	--name $(NEXT_CONTAINER) \
	--network $(NETWORK) \
	-p $(NEXT_PORT):$(NEXT_CONTAINER_PORT) \
	-v "$(NEXT_DIR):/app" \
	$(NEXT_IMAGE)

next-start: next-build network next-run
	@echo "Started Next.js server"

next-start-dev: next-build-dev next-run-dev
	@echo "Started Next.js server in development mode"

next-stop:
	-@docker stop $(NEXT_CONTAINER) || true

next-restart: next-stop next-start

next-remove: next-stop
	-@docker rm -f $(NEXT_CONTAINER) || true