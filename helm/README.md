# Helm Chart: CV Application

Helm-чарт для развертывания приложения CV (Django backend + React frontend) в любом Kubernetes-кластере с TLS через cert-manager.

## Требования

- Kubernetes-кластер (K3s, K8s, EKS, GKE и т.д.)
- Helm 3
- Установленный ingress-контроллер: **Traefik** или **Nginx Ingress**
- Установленный [cert-manager](https://cert-manager.io/docs/installation/) (для автоматического HTTPS)

### Установка cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

## Быстрый старт

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com
```

Приложение будет доступно по адресу `https://cv.example.com`.

## Настройка

### Ingress-контроллер

По умолчанию чарт использует **Traefik**. Для использования **Nginx Ingress**:

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set ingress.controller=nginx \
  --set certManager.email=admin@example.com
```

### TLS / cert-manager

Чарт автоматически создает `ClusterIssuer` для Let's Encrypt и настраивает TLS.

**Staging-сертификаты** (для тестирования, без риска превысить лимиты Let's Encrypt):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set certManager.production=false
```

**Использование существующего ClusterIssuer** (если в кластере уже есть свой):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.createClusterIssuer=false \
  --set certManager.clusterIssuerName=my-existing-issuer
```

**Без TLS** (например, для локальной разработки через port-forward):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=localhost \
  --set ingress.tls.enabled=false \
  --set certManager.enabled=false
```

### Собственные образы

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set backend.image.repository=myregistry.io/cv-backend \
  --set backend.image.tag=1.0.0 \
  --set frontend.image.repository=myregistry.io/cv-frontend \
  --set frontend.image.tag=1.0.0
```

### Масштабирование

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set backend.replicaCount=3 \
  --set frontend.replicaCount=3
```

## Использование файла значений

Для сложных конфигураций удобнее создать отдельный файл значений вместо множества флагов `--set`:

```yaml
# my-values.yaml
domain: cv.mysite.com

ingress:
  controller: nginx

certManager:
  email: admin@mysite.com
  production: true

backend:
  replicaCount: 3
  image:
    repository: myregistry.io/cv-backend
    tag: 2.0.0

frontend:
  replicaCount: 3
  image:
    repository: myregistry.io/cv-frontend
    tag: 2.0.0
```

```bash
helm upgrade --install cv-app ./helm -f my-values.yaml
```

## Все параметры

| Параметр | Описание | По умолчанию |
|---|---|---|
| `domain` | Доменное имя приложения | `cv.example.com` |
| `global.prefix` | Префикс имен ресурсов | `cv-app` |
| `ingress.enabled` | Включить ingress | `true` |
| `ingress.controller` | Ingress-контроллер: `traefik` или `nginx` | `traefik` |
| `ingress.annotations` | Дополнительные аннотации ingress | `{}` |
| `ingress.tls.enabled` | Включить TLS | `true` |
| `certManager.enabled` | Включить аннотации cert-manager | `true` |
| `certManager.createClusterIssuer` | Создать ресурс ClusterIssuer | `true` |
| `certManager.clusterIssuerName` | Имя ClusterIssuer | `letsencrypt-prod` |
| `certManager.email` | Email для регистрации в Let's Encrypt | `user@example.com` |
| `certManager.production` | Использовать production-сервер Let's Encrypt | `true` |
| `traefik.createMiddleware` | Создать Traefik middleware для stripPrefix | `true` |
| `backend.replicaCount` | Количество реплик backend | `2` |
| `backend.image.repository` | Образ backend | `cr.selcloud.ru/dswz/cv-backend` |
| `backend.image.tag` | Тег образа backend | `0.8.7` |
| `frontend.replicaCount` | Количество реплик frontend | `2` |
| `frontend.image.repository` | Образ frontend | `cr.selcloud.ru/dswz/cv-frontend` |
| `frontend.image.tag` | Тег образа frontend | `0.8.7` |

## Полезные команды

```bash
# Предварительный просмотр манифестов перед развертыванием
helm template cv-app ./helm -f my-values.yaml

# Статус развернутого релиза
helm status cv-app

# Статус подов
kubectl get pods -l app=django-backend
kubectl get pods -l app=react-frontend

# Просмотр логов
kubectl logs -f -l app=django-backend
kubectl logs -f -l app=react-frontend

# Проверка статуса сертификата (cert-manager)
kubectl get certificates
kubectl describe certificate cv-app-tls

# Удаление
helm uninstall cv-app
```
