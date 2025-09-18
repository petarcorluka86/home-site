# This Makefile is intended to be included by the root Makefile; it is not standalone.

.PHONY: next-build next-start next-stop next-restart next-remove

next-build:
	docker build -t $(NEXT_IMAGE) $(NEXT_DIR)

next-start: next-build network
	-@docker stop $(NEXT_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(NEXT_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(NEXT_CONTAINER) \
		--network $(NETWORK) \
		-p $(NEXT_PORT):$(NEXT_CONTAINER_PORT) \
		$(NEXT_IMAGE)

next-stop:
	-@docker stop $(NEXT_CONTAINER) || true

next-restart: next-stop next-start

next-remove: next-stop
	-@docker rm -f $(NEXT_CONTAINER) || true