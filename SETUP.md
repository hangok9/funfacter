# Setup de la Base de Datos

Para completar la instalación, necesitas ejecutar el schema SQL en Supabase.

## Opción A: SQL Editor (recomendada)

1. Ve a https://supabase.com/dashboard/project/asqjzhtcnruldfddnqdh
2. Entra al **SQL Editor**
3. Abre el archivo `sql/schema.sql` de este proyecto
4. Pégalo y ejecútalo

## Opción B: Dame un PAT token

Si quieres que lo ejecute automáticamente:

1. Ve a https://supabase.com/dashboard/account/tokens
2. Crea un token con permisos de lectura/escritura
3. Pásamelo y ejecuto `supabase db query --linked --file sql/schema.sql`

## Verificar

Después de ejecutar el SQL, deberías ver estas tablas en el Table Editor:
- `facts`
- `topicos`
- `fact_topicos`
