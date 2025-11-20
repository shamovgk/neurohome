.PHONY: help dev stop logs clean restart mobile

help:
	@echo "NeuroHome Development Commands:"
	@echo "  make dev       - Start all services"
	@echo "  make stop      - Stop all services"
	@echo "  make logs      - View logs"
	@echo "  make clean     - Stop and remove volumes"
	@echo "  make mobile    - Start React Native"

dev:
	docker-compose -f docker-compose.dev.yml up

stop:
	docker-compose -f docker-compose.dev.yml down

logs:
	docker-compose -f docker-compose.dev.yml logs -f backend

clean:
	docker-compose -f docker-compose.dev.yml down -v

restart:
	docker-compose -f docker-compose.dev.yml restart

mobile:
	cd packages/mobile && npm start
