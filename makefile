docker-build:
	docker build -t webapp .

docker-run:
	docker run -it --rm -p 3000:3000 webapp
