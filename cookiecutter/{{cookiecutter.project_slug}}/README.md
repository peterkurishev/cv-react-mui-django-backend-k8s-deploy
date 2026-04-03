# {{ cookiecutter.project_name }}

{{ cookiecutter.project_description }}

## Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React {{ cookiecutter.react_version }}, TypeScript, Material UI {{ cookiecutter.mui_version }}, Axios |
| Backend | Django {{ cookiecutter.django_version }}, Python {{ cookiecutter.python_version }}{% if cookiecutter.use_gunicorn == 'y' %}, Gunicorn{% endif %} |
{%- if cookiecutter.use_postgres == 'y' %}
| Database | PostgreSQL {{ cookiecutter.postgres_version }} (docker-compose) / SQLite (local) |
{%- endif %}
{%- if cookiecutter.use_nginx_proxy == 'y' %}
| Reverse proxy | Nginx |
{%- endif %}
{%- if cookiecutter.use_kubernetes == 'y' %}
| Infrastructure | Docker, Kubernetes, Helm 3 |
{%- if cookiecutter.use_tls == 'y' %}
| TLS | cert-manager + Let's Encrypt |
{%- endif %}
| Ingress | {{ cookiecutter.ingress_controller | capitalize }} |
{%- endif %}
{%- if cookiecutter.use_sentry == 'y' %}
| Monitoring | Sentry (frontend + backend) |
{%- endif %}

## Local Development

### Docker Compose

```bash
docker compose up
```

App available at `http://localhost:{{ cookiecutter.nginx_listen_port }}`.

### Without Docker

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
npm start
```

## Testing

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest
```
{%- if cookiecutter.use_kubernetes == 'y' %}

## Kubernetes Deployment

```bash
helm upgrade --install {{ cookiecutter.helm_chart_name }} ./helm \
  --set domain={{ cookiecutter.domain }} \
  --set certManager.email={{ cookiecutter.cert_manager_email }}
```
{%- endif %}
