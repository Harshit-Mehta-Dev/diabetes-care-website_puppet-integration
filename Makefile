.PHONY: compose-up compose-down compose-logs k8s-apply k8s-delete

compose-up:
	docker-compose up -d --build

compose-down:
	docker-compose down

compose-logs:
	docker-compose logs -f

k8s-apply:
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/secret.yaml
	kubectl apply -f k8s/deployment.yaml
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/hpa.yaml
	kubectl apply -f k8s/ingress.yaml

k8s-delete:
	kubectl delete -f k8s/
