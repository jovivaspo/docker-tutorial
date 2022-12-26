# DOCKER

![Docker](https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png)

## ¿Qué es Docker?

Docker es una plataforma de código abierto que permite generar, implementar, ejecutar, actualizar y administrar contenedores.

## ¿Qué es un contenedor?

Los contenedores son componentes ejecutables que combinan el código de la aplicación con las bibliotecas y dependencias necesarias para ejecutarse en cualquier entorno. Se trata de una manera de empaquetar un aplicación con todas la dependencias y configuraciones requeridas. Por ejemplo, un contenedor puede contener los siguientes elementos:

- HTML y CSS
- API en Node.js
- Base de datos
- .env

Estos contenedores son creados gracias a las capacidades de virtualización y aislamiento de procesos integrados en el kernel de Linux.

### Características de un contenedor

- Un contenedor es portable y permite compartir código entre los desarrolladores
- Los contenedores se almacenan en repositorios. Estos repositorios pueden ser públicos como [dockerhub](https://hub.docker.com/) o privados.
- Los contenedores solo poseen los procesos del sistema operativo y dependencias necesarias para ejecutrar el código.
- Es posible ejecutar varias copias de una aplicación en el mismo hardware.

## Otros conceptos clave

### Imagen de Docker

Una imagen de Docker es el código fuente de la aplicación junto con todas las dependencias, herramientas y bibliotecas necesarias para ejecutarse como un contenedor. Al ejecutarse, se genera una instancia del contenedor.

### Dockerfile

Archivo con las instrucciones necesarias para generar una nueva imagen de un contenedor.

### .dockerignore

Archivo en el cual se especifican los ficheros y directorios que serán ignorados a la hora de generer una imagen de Docker.

### Docker Desktop

Es una máquina virtual que permite ejecutar contenedores. A su vez, se compone de otras herramientas como Docker Compose.

### Dockerhub

[Dockerhub](https://hub.docker.com/) es un repositorio público que cuenta con más de 100.000 contenedores disponibles para descargar.

## Instalación de Docker Desktop

Docker esta disponible para todos los sistemas operativoas, Window, Linux, Mac... [Enlace de descarga oficial](https://www.docker.com/products/docker-desktop/).

## Comandos básicos de Docker

Antes debemos de comenzar, ejecutaremos Docker Desktop, de lo contrario no podremos ejecutar ningún comando de Docker. Tras iniciar Docker Desktop podremos abrir nuestra términal.

- Ver las imágenes existentes en nuestro Docker Desktop. Nos muestra información como el repositorio de descarga, versión, id, fecha de creación y tamaño.

```
docker images
```

- Descargar una imagen de Docker de Dockerhub `docker pull` seguido del nombre de la imagen. En este caso descargamos la última versión de node.

```
docker pull node
```

También es posible especificar la la versión que queremos descargar:

```
docker pull node:18
```

- Borrar imágenes `docker image rm` seguido del nombre de la image:

```
docker image rm node:18
```

- Generar un contenedor con `docker create`. Con este comando creamos un contenedor a partir de una imagen ya generada. En caso, de que no esté disponible en nuestro Docker Desktop, intentará descargarla de Dockerhub. A continuación generamos un contenedor a partir de la última versión de MongoDB:

```
docker create mongo
```

Es posible asignarle un nombre usando la bandera `--name` seguido de la imagen en base a la cual se va a crear el contendor. En este caso, el contenedor se llamará test y se genera a partir de la imagen de mongo.

```
docker create --name test mongo
```

- Ejecutar un contenedor, para ello empleamos el comando `docker start` seguido del ID del contenedor.

```
docker start 7585f2063b93ba6a6c7a52221cebaa5869b87215eaeef450ffcc1bdc16d3b726
```

- Verificar que el contenedor se está ejecutando:

```
docker ps
```

- Si queremos parar la ejecución empleamos el comando `docker stop` junto con el ID del contenedor o el nombre del contenedor

```
docker stop 7585f2063b93ba6a6c7a52221cebaa5869b87215eaeef450ffcc1bdc16d3b726
```

Visualizar todos los contenedores disponibles:

```
docker ps -a
```

- Eliminar un contenedor con `docker rm` más el ID o nombre del contenedor:

```
docker rm 7585f2063b93ba6a6c7a52221cebaa5869b87215eaeef450ffcc1bdc16d3b726
```

- Construir una imagen a partir de un archivo Dockerfile con `docker build`. Podremos añadir un nombre a la imagen seguido de una etiqueta `-t miapp:1` , y por último, la ruta en la cual se encuentra nuestro archivo Dockerfile:

```
docker build -t miapp:1 .
```

- Ver líneas de comandos de un contenedor con `docker logs nombre-conetenedor`

```
docker logs test
```

- Escuchar nuevos logs añadimos la palabra `--follow`:

```
docker logs --follow test
```

- Comando `docker run`. En primer lugar, Docker descarga la imagen, en el caso de que no exista. A continuación, crea el contenedor, y tras generarlo lo inicia. Por ejemplo, al ejecutar el siguiente comando, Docker descarga la ultima imagen de MongoDB, genera un contenedor y lo ejecuta. Además, muestra los logs.

```
docker run mongo
```

Si no es necesario ver los logs emplearemos el atributo `-d `:

```
docker run -d mongo
```

- Mapeo de puertos. En primer lugar, se indica el puerto de nuestra máquina donde ejecutamos docker, seguido del puerto del contenedor que vamos a ejecutar:

```
docker run -p27027:27027 -d mongo
```

De la misma manera que antes, podemos darle un nombre al contenedor con la bandera `--name`:

```
docker run --name test -p27027:27027 -d mongo
```

Pasar variables de entorno. Es posible indicar directamente el valor de nuestras variables indicando la bandera `-e` y pasaremos el par clave valor:

```
docker run -e PORT=3000 -p3000:3000 test
```

Sin embargo, al declarar las variables de esta manera, estas serán visibles desde el host, lo cual puede ser un problema de seguridad. Para evitar esto, podremos pasar nuestro archivo .env a docker empleando la bandera `--env-file`:

```
docker run --env-file .env -p3000:3000 test
```

## Ejemplo básico: Docker MongoDB y Node.js

En primer lugar, descargamos la última imagen de mongo:

```
docker pull mongo
```

Si ejecutamos el siguiente comando, podremos comprobar que la imagen se ha descargado:

```
docker images
```

A continuación, generamos el contenedor. Aquí definiremos una serie de parámetros:

- Nombre del contenedor. Nuestro contenedor se llamará mongo-container.
- Puertos. Emplearemos el puerto estándar de MongoDB 27017.
- Definimos variables de entorno. Será necesario definir las variables MONGO_INITDB_ROOT_USERNAME y MONGO_INITDB_ROOT_PASSWORD.
- Por último indicamos la imagen a partir de la cual se va a generar.

```
docker create -p27017:27017 --name mongo-container -e  MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

Con `docker ps -a` será posible verificar que el contenedor ha sido creado con éxito.

Por último ejecutamos el contenedor:

```
docker start mongo-container
```

Con el comando `docker ps` podremos ver que el contenedor está siendo ejecutado en el puerto 27017. Para finalizar la ejecución emplearemos:

```
docker stop mongo-container
```

Para más información sobre la imagen de MongoDB puede consultar la siguiente [documentación](https://hub.docker.com/_/mongo) de Dockerhub.

Una vez preparada nuestra base de datos, vamos a conectarla con una sencilla aplicación de Node.js, en la cual será necesario instalar express, dotenv y mongoose.

```
npm install express dotenv mongoose
```

```

├── src
│   ├── models
│   │       └── Animals.js
│   ├── routes
│   ├── index.js
│   └── database.js
│── .env
├── package.json

```

A continuación se muestra el código de cada fichero:

```
# models/Animals.js
# Se define el model Animal

const { Schema, model } = require("mongoose");

const Animal = new Schema({
  type: String,
  state: String,
});

module.exports = model("Animal", Animal);
```

```
# routes/animal.js
# Se definen dos rutas principales

const { Router } = require("express");
const Animal = require("../models/Animal");

const router = Router();

router.get("/", async (req, res) => {
  console.log("Welcome!!!");
  const animales = await Animal.find();
  return res.send(animales);
});

router.get("/crear", async (req, res) => {
  console.log("Creando Animal");
  await Animal.create({ tipo: "Cat", estado: "Happy" });
  return res.send("Creando animal...");
});

module.exports = router;
```

```
# ./database.js
# Se realiza la conexión la base de datos
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/miapp?authSource=admin`
);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Base de datos conectada");
});

module.exports = connection;
```

```
# ./index.js

const express = require("express");
require("dotenv").config();
require("./database");

const app = express();

app.set("port", process.env.PORT);

app.use("/", require("./routes/animals"));

app.listen(app.get("port"), () =>
  console.log("Aplicación en puerto:", app.get("port"))
);

```

Como se puede observar, será necesario definir tres variables de entorno en nuestro archivo .env, el puerto de la aplicación y las variables de entorno que definimos previamente en nuestro contenedor de mongo.

```
# env
PORT=3000
MONGO_INITDB_ROOT_USERNAME=user
MONGO_INITDB_ROOT_PASSWORD=password
```

Estamos listos para ejecutar nuestra aplicación:

```
node src/index
```

Para terminar, podemos verificar como los objetos son creados al visitar el endpoint localhost:3000/crear y listados en localhost:3000. De esta manera hemos aprendido a preparar una base de datos de MongoDB sin necesidad de tener que instalarla en nuestro ordenador.
