# Cookiecutter: React + Django + Kubernetes

Шаблон [Cookiecutter](https://cookiecutter.readthedocs.io/) для генерации full-stack веб-приложений с React-фронтендом, Django-бэкендом и развертыванием в Kubernetes через Helm.

## Требования

- Python 3.8+
- [Cookiecutter](https://cookiecutter.readthedocs.io/en/latest/installation.html) >= 2.0

```bash
pip install cookiecutter
# или
pipx install cookiecutter
```

## Быстрый старт

### Интерактивный режим

```bash
cookiecutter cookiecutter/
```

Cookiecutter последовательно запросит значения всех параметров. Для принятия значения по умолчанию нажмите Enter.

### Без вопросов (значения по умолчанию)

```bash
cookiecutter --no-input cookiecutter/
```

### С переопределением параметров

```bash
cookiecutter --no-input cookiecutter/ \
  project_name="My Portfolio" \
  domain="portfolio.example.com" \
  locale="ru" \
  python_version="3.12" \
  use_sentry="n"
```

### Из Git-репозитория

```bash
cookiecutter https://github.com/<user>/<repo>.git --directory="cookiecutter"
```

## Параметры

### Основные

| Параметр | По умолчанию | Описание |
|---|---|---|
| `project_name` | `My Full Stack App` | Название проекта (человекочитаемое) |
| `project_slug` | *из project_name* | Идентификатор проекта (латиница, цифры, дефисы). Используется как имя каталога, Docker-образа, Helm-релиза |
| `project_description` | `Full-stack web application...` | Описание проекта |
| `author_name` | `Your Name` | Имя автора |
| `author_email` | `you@example.com` | Email автора (также используется для cert-manager) |
| `domain` | `app.example.com` | Доменное имя для production-развертывания |
| `license` | `AGPL-3.0` | Лицензия. Варианты: `AGPL-3.0`, `MIT`, `Apache-2.0`, `GPL-3.0`, `BSD-3-Clause`, `none` |
| `page_title` | *из project_name* | Заголовок HTML-страницы (`<title>`) |
| `locale` | `en` | Язык интерфейса: `en` или `ru`. Влияет на тексты в UI, `LANGUAGE_CODE` в Django и атрибут `lang` в HTML |

### Версии технологий

| Параметр | По умолчанию | Варианты |
|---|---|---|
| `python_version` | `3.12` | `3.12`, `3.11`, `3.10`, `3.13` |
| `node_version` | `18` | `18`, `20`, `22` |
| `django_version` | `5.2` | `5.2`, `5.1`, `4.2` |
| `react_version` | `19` | `19`, `18` |
| `mui_version` | `7` | `7`, `6`, `5` |

### Django

| Параметр | По умолчанию | Описание |
|---|---|---|
| `django_project_name` | *из project_slug + `be`* | Имя Django-проекта (каталог с `settings.py`). Должен быть валидным Python-идентификатором |
| `django_app_name` | `core` | Имя Django-приложения. Должен отличаться от `django_project_name` |
| `api_prefix` | `api` | Префикс URL для API (без `/`) |
| `api_endpoint` | `message` | Имя эндпоинта API (без `/`) |

Итоговый URL API: `/<api_prefix>/<api_endpoint>` (по умолчанию `/api/message`).

### База данных

| Параметр | По умолчанию | Описание |
|---|---|---|
| `use_postgres` | `y` | Включить PostgreSQL. При `n` используется SQLite, из зависимостей убираются `psycopg2-binary` и `dj-database-url` |
| `postgres_version` | `15` | Версия PostgreSQL для Docker Compose. Варианты: `15`, `16`, `14`, `13` |
| `postgres_db` | `mydb` | Имя базы данных |
| `postgres_user` | `myuser` | Пользователь БД |
| `postgres_password` | `mypassword` | Пароль БД (только для локальной разработки!) |

### Docker и Registry

| Параметр | По умолчанию | Описание |
|---|---|---|
| `docker_registry` | `docker.io` | Адрес Docker-реестра |
| `docker_image_prefix` | *из project_slug* | Префикс имени образа. Образы: `<registry>/<prefix>-backend`, `<registry>/<prefix>-frontend` |
| `backend_image_tag` | `latest` | Тег образа бэкенда в Helm values |
| `frontend_image_tag` | `latest` | Тег образа фронтенда в Helm values |

### Опциональные компоненты

| Параметр | По умолчанию | Описание |
|---|---|---|
| `use_sentry` | `y` | Интеграция с Sentry (frontend + backend). При `n` убираются `sentry-sdk`, `@sentry/browser` и код инициализации |
| `use_cors` | `y` | Поддержка CORS через `django-cors-headers`. При `n` убираются пакет и middleware |
| `use_gunicorn` | `y` | Gunicorn как WSGI-сервер. При `n` используется `runserver` |
| `gunicorn_workers` | `3` | Количество worker-процессов Gunicorn |
| `gunicorn_timeout` | `120` | Таймаут Gunicorn (секунды) |
| `use_nginx_proxy` | `y` | Nginx как reverse proxy в Docker Compose. При `n` каталог `nginx/` не создается |
| `nginx_listen_port` | `80` | Порт Nginx на хосте в Docker Compose |

### Kubernetes и Helm

| Параметр | По умолчанию | Описание |
|---|---|---|
| `use_kubernetes` | `y` | Генерировать Helm-чарт. При `n` каталог `helm/` не создается |
| `k8s_namespace` | `default` | Namespace Kubernetes для Traefik middleware |
| `helm_chart_name` | *из project_slug* | Имя Helm-чарта |
| `helm_chart_version` | `0.1.0` | Версия чарта (`Chart.yaml`) |
| `helm_app_version` | `1.0.0` | Версия приложения (`Chart.yaml`) |
| `ingress_controller` | `traefik` | Ingress-контроллер: `traefik` или `nginx` |
| `use_tls` | `y` | Включить TLS в Ingress |
| `use_cert_manager` | `y` | Использовать cert-manager для автоматических сертификатов |
| `cert_manager_email` | *из author_email* | Email для регистрации в Let's Encrypt |
| `letsencrypt_production` | `y` | Использовать production-сервер Let's Encrypt. При `n` — staging (для тестов) |

### Ресурсы Kubernetes

| Параметр | По умолчанию | Описание |
|---|---|---|
| `backend_replicas` | `2` | Количество реплик бэкенда |
| `frontend_replicas` | `2` | Количество реплик фронтенда |
| `backend_cpu_request` | `100m` | CPU request бэкенда |
| `backend_memory_request` | `256Mi` | Memory request бэкенда |
| `backend_cpu_limit` | `500m` | CPU limit бэкенда |
| `backend_memory_limit` | `512Mi` | Memory limit бэкенда |
| `frontend_cpu_request` | `50m` | CPU request фронтенда |
| `frontend_memory_request` | `64Mi` | Memory request фронтенда |
| `frontend_cpu_limit` | `200m` | CPU limit фронтенда |
| `frontend_memory_limit` | `128Mi` | Memory limit фронтенда |

### CI/CD

| Параметр | По умолчанию | Описание |
|---|---|---|
| `use_github_actions` | `y` | Генерировать GitHub Actions workflow (pylint). При `n` каталог `.github/` не создается |
| `use_jenkins` | `y` | Генерировать Jenkinsfile (сборка Docker-образов через Kaniko). При `n` файл не создается |
| `ci_python_versions` | `3.10,3.11,3.12` | Версии Python для матрицы тестов в GitHub Actions (через запятую) |

## Структура сгенерированного проекта

```
<project_slug>/
├── backend/
│   ├── <django_project_name>/      # Django-проект
│   │   ├── __init__.py
│   │   ├── settings.py             # Настройки (DB, CORS, Sentry, ...)
│   │   ├── urls.py                 # URL-маршруты
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── <django_app_name>/          # Django-приложение
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py                # API-эндпоинт
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── migrations/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Главный компонент
│   │   ├── index.tsx               # Точка входа (+ Sentry)
│   │   ├── types.ts                # TypeScript-интерфейсы
│   │   └── components/
│   │       └── About.tsx
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── Dockerfile                  # Multi-stage (dev + production)
│   ├── nginx.conf                  # Nginx для production-контейнера
│   ├── package.json
│   └── tsconfig.json
├── helm/                           # (если use_kubernetes=y)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── _helpers.tpl
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── ingress.yaml
│       ├── cluster-issuer.yaml
│       └── middleware.yaml
├── nginx/                          # (если use_nginx_proxy=y)
│   └── nginx.conf                  # Reverse proxy для docker-compose
├── .github/workflows/              # (если use_github_actions=y)
│   └── pylint.yml
├── Jenkinsfile                     # (если use_jenkins=y)
├── docker-compose.yaml
├── .env.example
├── .gitignore
├── .dockerignore
└── README.md
```

## Примеры использования

### Минимальный проект (только Docker Compose)

```bash
cookiecutter --no-input cookiecutter/ \
  project_name="Simple App" \
  use_kubernetes="n" \
  use_sentry="n" \
  use_jenkins="n" \
  use_github_actions="n" \
  use_postgres="n"
```

Результат: React + Django + SQLite, без Helm, Sentry, CI/CD.

### Production-проект с полным стеком

```bash
cookiecutter --no-input cookiecutter/ \
  project_name="Company Portal" \
  domain="portal.company.com" \
  author_name="DevOps Team" \
  author_email="devops@company.com" \
  docker_registry="registry.company.com" \
  ingress_controller="nginx" \
  backend_replicas="3" \
  frontend_replicas="3" \
  locale="ru"
```

### Проект для обучения

```bash
cookiecutter --no-input cookiecutter/ \
  project_name="Learn Django React" \
  use_kubernetes="n" \
  use_jenkins="n" \
  use_sentry="n" \
  use_gunicorn="n" \
  letsencrypt_production="n" \
  locale="en"
```

## Валидация

Перед генерацией проекта автоматически проверяется:

- `project_slug` — начинается с буквы, содержит только строчные латинские буквы, цифры и дефисы
- `django_project_name` — валидный Python-идентификатор (строчные буквы, цифры, подчеркивания)
- `django_app_name` — валидный Python-идентификатор
- `django_project_name` и `django_app_name` не совпадают

При ошибке валидации генерация прерывается с понятным сообщением.

## После генерации

```bash
cd <project_slug>

# Локальная разработка
docker compose up

# Или без Docker
cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver
# В другом терминале:
cd frontend && npm install && npm start
```

Для Kubernetes-развертывания:

```bash
# Собрать и запушить образы
docker build -t <registry>/<prefix>-backend:1.0.0 ./backend
docker build -t <registry>/<prefix>-frontend:1.0.0 ./frontend
docker push <registry>/<prefix>-backend:1.0.0
docker push <registry>/<prefix>-frontend:1.0.0

# Развернуть через Helm
helm upgrade --install <helm_chart_name> ./helm \
  --set domain=<domain> \
  --set backend.image.tag=1.0.0 \
  --set frontend.image.tag=1.0.0
```

## Совместимость

- Cookiecutter >= 2.0
- Python >= 3.8 (для запуска cookiecutter)
- Docker и Docker Compose (для локальной разработки)
- Kubernetes >= 1.24 + Helm 3 (для production)
