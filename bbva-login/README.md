# 🏦 BBVA Login – Práctica con Supabase

Replica del flujo de login de BBVA México con 2 pasos:
1. Ingresar número de tarjeta
2. Ingresar contraseña

---

## 📁 Estructura del proyecto

```
bbva-login/
├── index.html              ← Página principal
├── css/
│   └── styles.css          ← Todos los estilos
├── js/
│   ├── supabase-config.js  ← ⚠️ Pon tus credenciales aquí
│   └── auth.js             ← Lógica de autenticación
└── README.md
```

---

## ⚙️ Configuración de Supabase

### 1. Crear el proyecto
- Ve a [https://supabase.com](https://supabase.com) y crea un proyecto nuevo.

### 2. Copiar credenciales
En tu dashboard → **Settings → API**, copia:
- `Project URL`
- `anon public key`

Pégalas en `js/supabase-config.js`:
```js
const SUPABASE_URL  = 'https://XXXXX.supabase.co';
const SUPABASE_ANON = 'eyJhbGci...';
```

### 3. Crear la tabla `users`
En Supabase → **SQL Editor**, ejecuta:

```sql
-- Tabla de usuarios con número de tarjeta
CREATE TABLE public.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  card_number TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: solo lectura pública (para validar tarjeta)
CREATE POLICY "Permitir lectura por tarjeta"
  ON public.users
  FOR SELECT
  USING (true);
```

### 4. Registrar un usuario de prueba
En Supabase → **Authentication → Users → Add user**:
- Email: `test@bbva.com`
- Password: `123456`

Luego en SQL Editor, inserta su tarjeta:
```sql
INSERT INTO public.users (email, card_number)
VALUES ('test@bbva.com', '4152313455671234');
```

---

## 🚀 Correr el proyecto

Opción A – Sin servidor (abrir directo):
```
Doble clic en index.html
```

Opción B – Con Live Server (recomendado en VSCode):
1. Instala la extensión **Live Server** en VSCode
2. Click derecho en `index.html` → **Open with Live Server**

---

## 🔐 Flujo de autenticación

```
Usuario ingresa tarjeta (16 dígitos)
       ↓
Supabase consulta tabla `users` por `card_number`
       ↓
Si existe → muestra paso 2 (contraseña)
       ↓
Supabase Auth: signInWithPassword(email, password)
       ↓
Si correcto → modal de éxito (redirigir a dashboard)
```

---

## 📝 Notas

- La contraseña se valida con **Supabase Auth** (no se guarda en texto plano).
- El `card_number` se vincula al `email` del usuario en la tabla `users`.
- Para producción, refuerza las políticas de RLS en Supabase.
