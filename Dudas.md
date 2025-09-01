## Dudas a preguntar al profe:

---

### Comandos útiles de Fly.io

- `fly deploy`  
  Sube y despliega la app según el Dockerfile y fly.toml.

- `fly logs`  
  Muestra los logs en tiempo real de la app (útil para debug).

- `fly status`  
  Muestra el estado actual de la app y sus máquinas.

- `fly open`  
  Abre la app en el navegador (URL pública).

- `fly secrets set CLAVE=valor`  
  Agrega o actualiza variables secretas (ej: claves de DB).

- `fly ssh console`  
  Abre una terminal dentro del contenedor para inspección avanzada.

- `fly scale count N`  
  Cambia el número de instancias/máquinas corriendo la app.

- `fly restart`  
  Reinicia la app manualmente.

- fly deploy --app backend-patient-morning-1303

--
fly secrets set JWT_SECRET=YQRu5R2SOb37XnxA4OFiXz2a26pYLVGeWpdl MP_CLIENT_ID=4838252935444915 MP_CLIENT_SECRET=8B8JhjeQHu5EeQcsZxAAzrMlijrHcqnz MP_ACCESS_TOKEN=APP_USR-4838252935444915-082616-a14a80ef5f2830f5d84ab72780ee2b91-386912703 MP_PUBLIC_KEY=APP_USR-639727d3-ca34-43e8-b808-060c108c94db PLATFORM_USER_ID=386912703 MP_REDIRECT_URI=https://tudominio.fly.dev/api/mp/callback ENCRYPTION_KEY= DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/marketplace PORT=3000 NODE_ENV=production
