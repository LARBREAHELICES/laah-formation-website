

docker exec -it fastapi_laah bash


## Migrations

```bash
# Revenir à l'état initial
alembic downgrade base

# création d'une nouvelle migration 
alembic revision -m "add user_term associations"

# lancer les migrations
alembic upgrade head

# initialisation
alembic downgrade base
alembic upgrade head

alembic current

alembic history
alembic downgrade -1

# plus explicite pour annuler la migration 
alembic downgrade abcd1234efgh

# pensez à relancer les migrations
alembic upgrade head
```

