# Generar una imagen de Docker con Dockerfile

En este post aprenderemos a montar una imagen de Docker y ejecutarla. Para ello, emplearemos el código empleado en el post de Docker-básico, en el cual, deberemos añadir el siguiente fragmento de código en el archivo package.jon:

```
...

 "scripts": {
    "start": "node src/index.js"
  },

...

```

Para generar nuestra imagen crearemos los fichero Dockerfile y .dockerignore en la carpeta raíz:

```
├── src
│   ├── models
│   │       └── Animals.js
│   ├── routes
│   ├── index.js
│   └── database.js
│── .env
├── package.json
├── Dockerfile
├── .dockerignore

```

Cómo vimos en el tutorial anterior, en el archivo .dockerignore indicaremos aquellos ficheros que deben ser ignorados al crear nuestra imagen de Docker. En nuestro caso, añadiremos la carpeta node_modules

```
# .dockerignore
node_modules
```

Una vez creado nuestro archivo .dockerignore, pasamos a definir las instrucciones necesarias para crear nuestra imagen. Para ello, vamos a ver los comandos básicos para ello:

- Primero, indicamos la imagen base a partir de la cual construiremos la nuestra con `FROM nombre-imagen`. En este ejemplo usaremos una imagen de node versión 18:

```
FROM node:18
```

- A continuación, creamos la carpeta principal que contendrá nuestro código fuente, para ello empleamos el comando `RUN mkdir`:

```
RUN mkdir -p /usr/src/app
```

- Luego, nos ubicamos en la carpeta que acabamos de generar con `WORKDIR`, la cual será la carpeta principal:

```
WORKDIR /usr/src/app
```

- Ahora, copiamos los archivos package.json en la carpeta principal `COPY`:

```
COPY package*.json ./
```

- Después, instalamos los módulos necesarios empleando el siguiente comando:

```
RUN  npm install
```

- A continuación, copiamos todo el código fuente de nuestra app en la carpeta principal:

```
COPY . .
```

Finalmente ejecutamos la app con `CMD`:

```
CMD ["npm", "run", "start"]
```

Ya estamos preparados para construir nuestra imagen:

```
docker build -t nodeapp:1 .
```

Y por último, ejecutamos el contenedor en el puerto 8000 e indicamos el archivo que contiene nuestras variables de entorno:

```
docker run  --name nodeapp-container --env-file .env -p8000:8000  nodeapp:1
```

Como veremos, nuestra aplicación comenzará a correr en el puerto indicado, sin embargo, pronto fallará ya que no hemos establecido la conexión con nuestra base de datos, pero esto será explicado en el siguiente tutorial correspondiente a Docker Compose.
