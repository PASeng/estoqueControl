.PHONY: seed

seed:
	docker compose exec -T db psql -U kamilla -d kamilla < backend/seed_example.sql
