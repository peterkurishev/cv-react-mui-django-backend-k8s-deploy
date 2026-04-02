# Helm Chart: CV Application

Helm chart for deploying the CV application (Django backend + React frontend) to any Kubernetes cluster with TLS via cert-manager.

## Prerequisites

- Kubernetes cluster (K3s, K8s, EKS, GKE, etc.)
- Helm 3
- Ingress controller installed: **Traefik** or **Nginx Ingress**
- [cert-manager](https://cert-manager.io/docs/installation/) installed (for automatic HTTPS)

### Installing cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

## Quick Start

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com
```

The application will be available at `https://cv.example.com`.

## Configuration

### Ingress Controller

By default the chart uses **Traefik**. To use **Nginx Ingress**:

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set ingress.controller=nginx \
  --set certManager.email=admin@example.com
```

### TLS / cert-manager

The chart creates a `ClusterIssuer` for Let's Encrypt and configures TLS automatically.

**Staging certificates** (for testing, avoids Let's Encrypt rate limits):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set certManager.production=false
```

**Using an existing ClusterIssuer** (if you already have one in the cluster):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.createClusterIssuer=false \
  --set certManager.clusterIssuerName=my-existing-issuer
```

**Without TLS** (e.g., local development with port-forward):

```bash
helm upgrade --install cv-app ./helm \
  --set domain=localhost \
  --set ingress.tls.enabled=false \
  --set certManager.enabled=false
```

### Custom Images

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set backend.image.repository=myregistry.io/cv-backend \
  --set backend.image.tag=1.0.0 \
  --set frontend.image.repository=myregistry.io/cv-frontend \
  --set frontend.image.tag=1.0.0
```

### Scaling

```bash
helm upgrade --install cv-app ./helm \
  --set domain=cv.example.com \
  --set certManager.email=admin@example.com \
  --set backend.replicaCount=3 \
  --set frontend.replicaCount=3
```

## Using a Values File

For complex configurations, create a custom values file instead of `--set` flags:

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

## All Parameters

| Parameter | Description | Default |
|---|---|---|
| `domain` | Application domain name | `cv.example.com` |
| `global.prefix` | Resource name prefix | `cv-app` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.controller` | Ingress controller: `traefik` or `nginx` | `traefik` |
| `ingress.annotations` | Additional ingress annotations | `{}` |
| `ingress.tls.enabled` | Enable TLS | `true` |
| `certManager.enabled` | Enable cert-manager annotations | `true` |
| `certManager.createClusterIssuer` | Create a ClusterIssuer resource | `true` |
| `certManager.clusterIssuerName` | ClusterIssuer name | `letsencrypt-prod` |
| `certManager.email` | Email for Let's Encrypt | `user@example.com` |
| `certManager.production` | Use production Let's Encrypt server | `true` |
| `traefik.createMiddleware` | Create Traefik stripPrefix middleware | `true` |
| `backend.replicaCount` | Backend pod replicas | `2` |
| `backend.image.repository` | Backend image | `cr.selcloud.ru/dswz/cv-backend` |
| `backend.image.tag` | Backend image tag | `0.8.7` |
| `frontend.replicaCount` | Frontend pod replicas | `2` |
| `frontend.image.repository` | Frontend image | `cr.selcloud.ru/dswz/cv-frontend` |
| `frontend.image.tag` | Frontend image tag | `0.8.7` |

## Useful Commands

```bash
# Check what will be rendered before deploying
helm template cv-app ./helm -f my-values.yaml

# View deployed release status
helm status cv-app

# Check pod status
kubectl get pods -l app=django-backend
kubectl get pods -l app=react-frontend

# View logs
kubectl logs -f -l app=django-backend
kubectl logs -f -l app=react-frontend

# Check certificate status (cert-manager)
kubectl get certificates
kubectl describe certificate cv-app-tls

# Uninstall
helm uninstall cv-app
```
