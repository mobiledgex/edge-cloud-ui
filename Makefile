TAG ?= $(shell git describe --tags)
REPO ?= 5000
IMAGE = registry.mobiledgex.net:$(REPO)/mobiledgex/console:$(TAG)
PROD_IMAGE = registry.mobiledgex.net:$(REPO)/mobiledgex/console-prod:$(TAG)

build:
	docker build --build-arg TAG=$(TAG) -t $(IMAGE) .
	docker build -f Dockerfile.prod --build-arg CONSOLE_IMAGE=$(IMAGE) -t $(PROD_IMAGE) .

publish:
	docker push $(IMAGE)
	docker push $(PROD_IMAGE)
