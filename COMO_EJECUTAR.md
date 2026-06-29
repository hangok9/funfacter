# 🚀 Cómo ejecutar Fun Facts

Guía paso a paso para tontos (como yo).

---

## Prerrequisitos

Asegúrate de tener esto instalado:
- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)

Para comprobar si los tienes, abre una terminal y escribe:

```bash
node -v
npm -v
```

Si ves números (ej: `v20.20.2` y `10.8.2`), estás listo.

---

## Paso 1: Abrir el proyecto en la terminal

Abre una terminal y navega hasta la carpeta del proyecto:

```bash
cd /home/pepe/funfacter
```

---

## Paso 2: Instalar las dependencias (solo la primera vez)

```bash
npm install
```

Esto descarga todo lo que necesita el proyecto. Verás una barra de carga. Cuando termine, no debería haber errores rojos.

---

## Paso 3: Encender el servidor de desarrollo

```bash
npm run dev
```

Verás algo como:

```
▲ Next.js 16.2.9
- Local: http://localhost:3000
```

---

## Paso 4: Abrir la página

Abre tu navegador y ve a:

```
http://localhost:3000
```

---

## Cómo usarlo

### Crear una curiosidad
1. En la página principal verás un botón **"Añadir curiosidad"**
2. Rellena: título, descripción breve, explicación larga
3. Añade tópicos (puedes escribir y crear nuevos)
4. Opcional: añade fuentes con su texto y URL
5. Dale a **"Guardar"**

### Ver curiosidades
- Las tarjetas aparecen en la página principal
- **Haz clic** en una tarjeta para ver la descripción breve
- Dale a **"Leer más"** para ver la explicación completa
- Abajo te saldrán **curiosidades relacionadas**

### Filtrar
Usa los filtros de arriba para buscar por:
- **Tópico**: selecciona una categoría
- **Fuentes**: activa para ver solo las que tienen fuentes
- **Longitud**: Corto (<150 palabras), Medio (150-500), Extenso (>500)
- **Ordenar**: por fecha de creación o última modificación

### Modo minimalista
- Dale al botón de **luna/ sol** (arriba a la derecha) para cambiar entre modo normal y modo minimalista blanco y negro

---

## Solución de problemas

### Error de permisos al hacer npm install
Usa:
```bash
npm install --no-optional
```

### El puerto 3000 está ocupado
Para usar otro puerto:
```bash
npm run dev -- -p 3001
```

### La página está en blanco o no carga datos
Asegúrate de haber ejecutado el archivo `sql/schema.sql` en el **SQL Editor de Supabase** (como hiciste antes).

### Error de base de datos
Revisa que el archivo `.env.local` tenga las claves correctas:
```
NEXT_PUBLIC_SUPABASE_URL=https://asqjzhtcnruldfddnqdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KyIlsXAEUbDHfsydvWfoZw_8R7MaXNH
```

---

## Para cerrar el servidor

En la terminal, pulsa `Ctrl + C` (las dos teclas a la vez).

---

¡Y ya está! 🎉
