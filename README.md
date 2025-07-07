
# 🧠 Orbix AI Platform (Docker Hub Edition)

Plataforma inteligente para validación de clientes, integración con Odoo, envíos logísticos y dashboards de seguridad.

---

## 🚀 Cómo usar esta imagen

### 1. Obtener la imagen
```bash
docker pull tuusuario/orbix-ai:latest
```

### 2. Crear archivo `.env`
```env
OPENAI_API_KEY_ORBIX=sk-...
OPENAI_API_KEY_TEST=sk-...
ODOO_URL=https://erp.orbixmatrix.com
ODOO_DB=orbix_prod
ODOO_USER=admin
ODOO_PASS=supersecurepass
MIMOTO_API_KEY=api-mimoto-key
```

### 3. Ejecutar el contenedor
```bash
docker run -d -p 8000:8000 --env-file .env tuusuario/orbix-ai:latest
```

### 4. Acceder a la API
```
http://localhost:8000/docs
```

---

## 📚 Endpoints principales (FastAPI)
- `/health` – Monitoreo
- `/validar_cliente` – IA para scoring
- `/diagnostico` – Análisis extendido
- `/crear_lead_odoo` – Crear lead en Odoo
- `/enviar_mimoto` – Generar orden en mimoto.express
- `/ejecutar_pruebas` – QA simulado por GPT

---

## 🛡 Seguridad
- Listo para HTTPS con NGINX
- Escalable con Docker Compose
- Pensado para servidores como Hetzner
