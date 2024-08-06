# Quickie Form

Usando las potencialidades de los modelos GPT se crea servicio web tipo SAAS para facilitar la creación, publicación y procesamiento de formularios.

## Entorno Local

En caso que desee desplegarlo de manera local en lugar de usar https://quickieform.com siga esta guía.

### Configuración Recomendada

- `node` > 20
- `npm` > 10
- `supabase/cli` => _actualizado_ ([Documentación](https://supabase.com/docs/reference/javascript/installing))

### Iniciar projecto supabase

Ver [manual de desarrollo local](https://supabase.com/docs/guides/cli)

### Configurar variables de entorno

Ver estado del proyecto supabase, donde veremos una salida similar al ejemplo siguiente

```bash
supabase status
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: anon-token
service_role key: service-role-token
   S3 Access Key: s3-access-key
   S3 Secret Key: s3-secret-key
       S3 Region: local
```

Entonces las variables de entorno quedarían

```
SUPABASE_URL = <API URL>
SUPABASE_ANON_KEY = <anon key>
SUPABASE_SERVICE_ROLE_KEY = <service_role key>
```

Configuramos la variable de entorno para Google Generative AI ([Ver documentación Gemini](https://ai.google.dev/gemini-api/docs/api-key))

```
GOOGLE_GENERATIVE_AI_API_KEY = <your-gemini-api-key>
```

Además configuramos la variable de entorno para ([Resend](https://resend.com))

```
RESEND_API_KEY = <your-resend-api-key>
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar el proyecto

Correr servidor de desarrollo:

```bash
npm run dev
```

## Características

### Creación de formularios

Compatible con el estándar web. Se extiende mediante el uso de elementos accesibles y agrupando por secciones lógicas, las cuales genera un modelo GPT para hacer aún más rica la experiencia en la plataforma. Todo esto manteniendo un proceso de validación estricta.

![image](https://github.com/user-attachments/assets/2e1c092a-c1ab-4790-b161-2b7c7b3bd70d)

### Seguridad

- Se usa Oauth 2.0 como protocolo de autorización.
- La información está protegida mediante _Row Level Security_ para cada usuario.
- Todas las rutas sensibles poseen su respectiva guarda de rutas.

### UX

- Los elementos emergentes crecen desde el punto donde se generan.
- Se usa un diseño _mobile-first_ fresco y ligero.
- La barra de aplicación posee las acciones principales en cada ruta. Teniendo una buena plasticidad en general el diseño.
- Soporte para modo claro y oscuro.
