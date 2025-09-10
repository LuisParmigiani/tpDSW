La sobrecarga de useStates y useEffects en un solo archivo esta mal?
Si lo esta, uso objetos para mitigarlo?

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
-- 