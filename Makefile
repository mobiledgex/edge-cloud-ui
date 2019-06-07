TAG ?= $(shell git describe --tags)
IMAGE = registry.mobiledgex.net:5000/mobiledgex/console:$(TAG)

build:
	docker build --build-arg TAG=$(TAG) -t $(IMAGE) .

publish:
	docker push $(IMAGE)
