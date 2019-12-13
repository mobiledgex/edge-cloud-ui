TAG ?= $(shell git describe --tags)
REPO ?= 5000
IMAGE = registry.mobiledgex.net:$(REPO)/mobiledgex/console:$(TAG)

build:
	docker build --build-arg TAG=$(TAG) -t $(IMAGE) .

publish:
	docker push $(IMAGE)
