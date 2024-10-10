build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs

clean:
	docker compose down --volumes --rmi all --remove-orphans

rmi:
	docker rmi -f $(docker images -aq)

rmi-all:
	docker rmi -f $(docker images -aq)
	docker volume rm $(docker volume ls -q)
	docker network rm $(docker network ls -q)
	docker system prune -f
	docker system prune --volumes -f
