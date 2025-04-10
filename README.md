# Sign.ia Backend
Backend para la app Sign.ia, que traduce Lenguaje de Señas Mexicano (LSM) a voz y ofrece lecciones de LSM.

## Endpoints
- `GET /api`: Mensaje de bienvenida.
- `POST /api/translate`: Traducción simulada de LSM a texto.
- `GET /api/lessons`: Lista de lecciones.
- `POST /api/lessons`: Añadir una lección.

## Instalación
1. Clona el repositorio: `git clone https://github.com/JoseAntonio7392/signia-backend.git`
2. Instala dependencias: `npm install`
3. Configura la variable de entorno `MONGO_URI` en un archivo `.env`.
4. Inicia el servidor: `npm start`