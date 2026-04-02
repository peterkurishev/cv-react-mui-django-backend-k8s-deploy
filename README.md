# CV Application

Веб-приложение для отображения резюме. React-фронтенд загружает данные из Django API и отрисовывает их с помощью Material UI. Развертывается в Kubernetes через Helm-чарт с автоматическим TLS.

## Стек технологий

| Компонент | Технологии |
|---|---|
| Frontend | React 19, TypeScript, Material UI 7, Axios |
| Backend | Django 5.2, Python 3.12, Gunicorn |
| База данных | PostgreSQL 15 (docker-compose) / SQLite (локально) |
| Reverse proxy | Nginx |
| Инфраструктура | Docker, Kubernetes, Helm 3 |
| TLS | cert-manager + Let's Encrypt |
| Ingress | Traefik или Nginx Ingress |
| Мониторинг | Sentry (frontend + backend) |
| CI/CD | GitHub Actions (pylint), Jenkins (сборка образов) |

## Архитектура

```
                    ┌─────────────────────┐
                    │   Ingress (Traefik  │
                    │   или Nginx Ingress)│
                    └────────┬────────────┘
                             │
               ┌─────────────┼─────────────┐
               │ /api/*      │ /*          │
               ▼             │             ▼
     ┌─────────────────┐    │    ┌─────────────────┐
     │  Django Backend  │    │    │ React Frontend  │
     │  (Gunicorn:8000) │    │    │   (Nginx:80)    │
     └────────┬────────┘    │    └─────────────────┘
              │              │
              ▼              │
     ┌─────────────────┐    │
     │   PostgreSQL     │    │
     └─────────────────┘    │
```

Frontend делает запросы на `/api/message`, Nginx/Ingress маршрутизирует их на backend. Всё остальное отдаётся фронтендом.

## Структура проекта

```
├── frontend/          # React-приложение (Create React App + TypeScript)
│   └── src/
│       ├── App.tsx            # Главный компонент, загрузка данных из API
│       ├── types.ts           # TypeScript-интерфейсы (Resume, Experience, ...)
│       └── components/        # UI-компоненты
├── backend/           # Django-проект
│   ├── cvbe/                  # Настройки Django (settings, urls, wsgi)
│   └── cv/                    # Приложение CV (views, models)
├── helm/              # Helm-чарт для K8s-развертывания
│   └── templates/             # K8s-манифесты (deployments, services, ingress)
├── nginx/             # Конфигурация Nginx для docker-compose
└── docker-compose.yaml
```

## Локальная разработка

### Docker Compose (рекомендуется)

Поднимает PostgreSQL, Django, React dev server и Nginx:

```bash
docker compose up
```

Приложение доступно на `http://localhost`. Nginx проксирует:
- `/api/*`, `/admin/*`, `/media/*` -> Django (порт 8000)
- `/*` -> React dev server (порт 3000)
- `/static/*` -> статика Django

Исходники монтируются в контейнеры — изменения применяются автоматически (hot reload).

### Без Docker

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Без `DATABASE_URL` Django использует SQLite.

**Frontend:**

```bash
cd frontend
npm install
npm start
```

Dev server запустится на `http://localhost:3000`.

## Переменные окружения

### Backend

| Переменная | Описание | По умолчанию |
|---|---|---|
| `DATABASE_URL` | Строка подключения к БД | SQLite (`db.sqlite3`) |
| `DJANGO_DEBUG` | Режим отладки (`true`/`false`) | `false` |

### Frontend

| Переменная | Описание | По умолчанию |
|---|---|---|
| `REACT_APP_API_URL` | URL API | `/api/message` |

## Тестирование

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest

# Линтинг Python
pylint $(git ls-files '*.py')
```

## Сборка Docker-образов

```bash
docker build -t cv-backend ./backend
docker build -t cv-frontend ./frontend
```

В production backend запускается через Gunicorn (`gunicorn cvbe.wsgi --bind 0.0.0.0:8000`).

## Развертывание в Kubernetes

### Требования

- Kubernetes-кластер с ingress-контроллером (Traefik или Nginx Ingress)
- [cert-manager](https://cert-manager.io/docs/installation/) для автоматического TLS
- Helm 3

### Быстрый старт

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com
```

### Примеры

**Nginx Ingress вместо Traefik:**

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set ingress.controller=nginx \
  --set certManager.email=admin@example.com
```

**Собственные образы:**

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set backend.image.repository=myregistry.io/cv-backend \
  --set backend.image.tag=1.0.0 \
  --set frontend.image.repository=myregistry.io/cv-frontend \
  --set frontend.image.tag=1.0.0
```

**Без TLS (для тестов):**

```bash
helm upgrade --install cv-app ./helm \
  --set domain=localhost \
  --set ingress.tls.enabled=false \
  --set certManager.enabled=false
```

Подробная документация по Helm-чарту: [helm/README.md](helm/README.md).

## CI/CD

- **GitHub Actions** — запускает `pylint` на каждый push (Python 3.10, 3.11, 3.12)
- **Jenkins** — собирает Docker-образы через Kaniko и пушит в container registry
