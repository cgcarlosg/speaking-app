### ✅ `README.md`

````markdown
# 🎙️ Speaking App

Una aplicación web simple que permite grabar tu voz, enviarla a un backend Flask que utiliza Whisper (de OpenAI) para transcribir el audio, y mostrar el texto resultante en pantalla.

---

## 🧩 Tecnologías utilizadas

- **Frontend:** JavaScript (Vanilla) + HTML + CSS
- **Backend:** Python + Flask
- **Transcripción:** `openai-whisper`
- **Conversión de audio:** `ffmpeg` (requisito obligatorio)

---

## 🚀 Requisitos previos

### 📦 Backend

- Python 3.8 o superior
- ffmpeg (instalado y agregado al PATH del sistema)
- Pip

### 🌐 Frontend

- Node.js (v18 recomendado)
- npm

---

## 🔧 Instalación local

### 1. Clona el proyecto

```bash
git clone https://github.com/tu-usuario/speaking-app.git
cd speaking-app
````

---

### 2. Backend

```bash
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python app.py
```

Esto levantará el backend en: `http://localhost:8000`

---

### 3. Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Ejecutar frontend
npm run dev
```

Esto abrirá el frontend en: `http://localhost:5173`

## 🧪 Uso

1. Abre el navegador en `http://localhost:5173`
2. Haz clic en grabar y hablar.
3. El audio se enviará al backend, se procesará con Whisper y mostrará la transcripción.

---

## 🌐 Despliegue gratuito

### 🔹 Backend en Render

1. Crea una cuenta en [https://render.com](https://render.com)
2. Crea un nuevo servicio de tipo **Web Service**
3. Conecta tu repo y selecciona:

   * **Start command:** `python app.py`
   * **Runtime:** Python
   * **Build Command:** `pip install -r requirements.txt`
4. Asegúrate de que `ffmpeg` esté disponible (Render lo incluye por defecto)

### 🔹 Frontend en Netlify o Vercel

#### Opción 1: Netlify

1. Ve a [https://netlify.com](https://netlify.com)
2. Crea nuevo sitio a partir del repo
3. Configura:

   * **Build command:** `npm run build`
   * **Publish directory:** `dist`

#### Opción 2: Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Importa el proyecto desde GitHub
3. Vercel detectará automáticamente la app y usará Vite

---

## 📝 Notas

* Si obtienes errores con `ffmpeg`, asegúrate de que esté instalado y agregado al `PATH`
* Puedes reemplazar Whisper con cualquier otro modelo si necesitas más control

---

## 🧑‍💻 Autor

* Carlos Gutierrez
* [@cgcarlosg](https://github.com/cgcarlosg)
