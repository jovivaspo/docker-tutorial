# Docker Compose

## ¿Qué es Docker Compose?

Docker Compose es una herramienta para definir y ejecutar aplicaciones de varios contenedores. Docker Compose emplea un archivo YAML para configurar los contenedores de la aplicación, y a partir de un solo comando, crea e inicia todos los servicios desde su configuración.

Docker Compose puede ser utilizado en diferentes entornos, producción, desarrollo, pruebas...

Algunas de las principales características de esta herramienta son:

- Permite varios entornos aislados en un mismo host.
- Conserva los datos de volumen cuando los contenedores son generados.
- Admite variables y mover composiciones entre entornos.

## Caso práctico

Para conocer esta herramienta, comenzaremos creando nuestro archivo docker-compose.yml y describiremos cada una de sus partes. Antes de continuar, para poder realizar el tutorial necesitarás el código correspondiente a la práctica anterior de Dockerfile, en la cual generamos una imagen de Docker de nuestra aplicación en Node.

Nuestra carpeta principal tendrá el siguiente esquema:

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
├── docker-compose.yml

```

Una vez creado nuestro archivo docker-compose.yml procederemos a generar su configuración, será de su suma importancia tener cuidado con la alineación y tabulación de cada instrucción.

1. `version`, debemos indicar la versión de Docker Compose que vamos a emplear. En nuestro caso usaremos la versión 3.9 .

2. `services`, definimos los servicios que contendrá nuestra aplicación indicando cada unos de sus nombres. En este ejemplo, tendremos en primer lugar nuestra aplicación en Node.js a la que llamaremos app, y por otro lado, contaremos con una base de datos en MongoDB a la que llamaremos mongodb.

3. `build`, con esta propiedad indicamos que el servicio se generará a partir del archivo Dockerfile que se encuentra en esta misma ruta. En nuestro caso, la aplicación de Node se generará a partir del fichero Dockerfile disponible en nuestra carpeta raíz.

4. `image`, el caso de que el servicio no se cree a partir de un archivo Dockerfile, con la propiedad `image`, especificamos la imagen a partir de la cual se generará. Como podemos ver, el servicio mongodb, se genera a partir de la imagen oficial de mongo.

5. `ports`, añadimos los puertos que queremos mapear, indicamos en primer lugar el puerto de nuestro sistema operativo anfitrión seguido del puerto del contenedor. Sería posible añadir más de un puerto para cada servicio.

6. `links`, con esta características indicamos el nonbre del contenedor que va a emplear el servicio. Como vemos, en este caso enlazamos el servicio app con el de mongodb.

7. Definmos las variables de entorno.Podremos indicar el archivo que contiene nuestras variables de entorno empleando la propiedad `env_file`. O también, podremos pasar directamente el valor de dichas variables a partir del atributo `enviroments`. En este ejemplo, el servicio app, tomará las variables de entorno del archivo .env (empleado en la práctica anterior), y para el servicio de mongodb, definiremos manualmente las variables MONGO_INITDB_ROOT_USERNAME y MONGO_INITDB_ROOT_PASSWORD.

8. `volumes`, con esta propiedad indicamos las rutas donde se almacerán los datos de nuestra aplicación. Además, en el caso de eliminar el contenedor, los datos persistirán en dicha ruta. Para especificar los volumes de nuestro contenedor, nos iremos al final de nuestro archivo yml, e indicamos el nombre de cada volume, en este caso será mongo-data. Luego, en cada contenedor especifimos la ruta en la cual se almacenan los datos. En este ejemplo, el volume mongo-data guarda sus datos en el directorio /data/db.

Así quedaría nuestro archivo yml:

```
#Versión de Docker Compose
version: "3.9"
#Definimos los servicios: app y mongodb
services:
  #Indicamos la ruta en la cual se encuentra nuestro archivo Dockerfile
  app:
    restart: always
    # Indicamos que el servicio se genera a partir del Dockerfile que se encuentra en esta misma ruta
    build: .
    #Asignamos puertos para el servicio
    ports:
      - "3000:3000"
    links:
      - mongodb
    env_file:
      - .env
  mongodb:
    #Definimos la imagen a partir de la cual se genera el servicio mongodb
    image: mongo
    #Asignamos puertos para el servicio
    ports:
      - "27017:27017"
    #Definimos las variables de entorno
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=password

    #Asignamos el volume donde se guardarán los datos y pasamos la ruta donde mongo guarda los datos.
    #Rutas para otros tipo de bases de datos:
    # mysql -> /var/lib/mysql
    # postgres -> /var/lib/postgresql/data
    volumes:
      - mongo-data:/data/db

#Indicamos el volume disponible para el contenedor
volumes:
  mongo-data:

```

Al emplear esta herramienta, docker genera una red `network` y las asigna a los contenedores especificados en el archivo docker-compose.yml.

Sin embargo, antes de iniciar nuestra aplicación deberemos hacer un pequeño cambio en la ruta de acceso de nuestra base de datos de MongoDB. Será necesario sustiuir "localhost" por el nombre del servicio de mongo, en esta ocasión, mongodb:

```
# database.js

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/miapp?authSource=admin`
);

```

Una vez configurado nuestro archivo de extensión yml y realizados los cambios pertinentes, emplearemos el comando `docker compose up` para generar las imágenes necesarias, además de construir y ejecutar los contenedores.

Ya podremos verificar el funcionamiento de nuestros servicios visitando las rutas http://localhost:3000 y http://localhost:3000/crear

Podremos detener y eliminar los contenedores indicando en nuestra terminal `docker compose down`. Sin embargo, como se indicó anteriormente, al volver a iniciar nuestros servicios, los datos creados permanecen al haber especificado la propiedad `volumes`. Ahora bien, si deseamos eliminar también los datos de nuestra aplicación, emplearemos el comando `docker compose down --volumes`

Sin embargo, nuestro ambiente de desarrollo será diferente a nuestro ambiente de producción. A continuación, veremos como configurar un ambiente de desarrollo. Para ello, crearemos un nuevo archivo llamado Dockerfile.dev:

```
#Indicamos la imagen base, en este caso empleamos node v.18
FROM node:18

#Instalamos nodemon
RUN npm install -g nodemon

#Creamos la carpeta principal que contendrá el código fuente
RUN mkdir -p /usr/src/app

#Nos ubicamos en la carpeta app
WORKDIR /usr/src/app

#Copiamos package.json en el directorio actual de la imagen
COPY package*.json ./

#Instalamos todos los módulos y dependencias
RUN  npm install

#Copiamos todo en el directorio actual de la imagen
COPY . .

#Inico de la app
CMD ["npm", "run", "dev"]
```

Como podemos observar, la configuración de este archivo es muy similar al anterior, con la diferencia de que instalaremos nodemon, herramienta que detectará los cambios de nuestra aplicación durante el desarrollo de la misma. Además, hemos sustituido el comando `npm run start` por `npm run dev`, es por ello, que en nuestro package.json añadiremos el nuevo script:

```
# package.json

  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon -L src/index.js"
  },
```

Tras configurar el nuevo Dockerfile, añadiremos un fichero docker-compose-dev.yml. De nuevo, la configuración de este, será muy similar al creado anteriormente. En este caso los cambios a implementar son los siguientes:

- Dentro de la características `build` del servicio app, añadiremos dos nuevos atributos, `context`, el cual indica en que carpeta se encuentra el archivo Dockerfile para generar la imagen, y el atributo `Dockerfile`, el cual indica que tomaremos el nuevo archivo generado Dockerfile.dev.
- Además, añadiremos un `volume` al servicio app, vinculamos la ruta local con la ruta del contenedor para reflejar los cambios durante el desarrollo.
- De manera totalmente opcional, podremos ocultar los logs de la base de datos con `command: mongod --quiet --logpath /dev/null`.

```
#Versión de Docker Compose
version: "3.9"
#Definimos los servicios: app y mongodb
services:
  #Indicamos la ruta en la cual se encuentra nuestro archivo Dockerfile
  app:
    restart: always
    # Indicamos que el servicio se genera a partir del Dockerfile que se encuentra en esta misma ruta
    build:
      #Ruta actual de Docker-compose-dev
      context: .
      dockerfile: Dockerfile.dev
    #Asignamos puertos para el servicio
    ports:
      - "3000:3000"
    links:
      - mongodb
    volumes:
      # Vinculamos la ruta local con la ruta del contenedor para reflejar los cambios realizados durante el desarrollo de la aplicación
      - .:/usr/src/app
    env_file:
      - .env
  mongodb:
    #Definimos la imagen a partir de la cual se genera el servicio mongodb
    image: mongo
    #Asignamos puertos para el servicio
    ports:
      - "27017:27017"
    #Definimos las variables de entorno
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=password

    #Asignamos el volume donde se guardarán los datos y pasamos la ruta donde mongo guarda los datos.
    #Rutas para otros tipo de bases de datos:
    # mysql -> /var/lib/mysql
    # postgres -> /var/lib/postgresql/data
    volumes:
      - mongo-data:/data/db

#Indicamos el volume disponible para el contenedor
volumes:
  mongo-data:
```

Para ejecutar nuestra aplicación usaremos el comando `docker compose -f docker-compose-dev.yml up`, a partir de la bandera `-f` podemos indicar un archivo específico de docker compose. Ahora, pdremos observar que al realizar cualquier cambio en nuestra aplicación esta se actualizará inmediatamente gracias al "hot reload" de nodemon.

Por último, podemos destacar algunos comandos útiles como `docker compose up -d`, el cual montará la aplicación en segundo plano, o también, `docker compose ps` que permite visualizar los servicios en ejecución.

De esta manera, podemos tener varios ambientes empleando Docker Compose, uno de producción y otro de desarrollo.
