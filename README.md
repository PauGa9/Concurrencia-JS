# Antes de empezar
Te harán falta alguna dependencias, deberías ejecutar `npm install`

# Cómo funciona
En la carpeta /src están los distintos ejercicios a realizar, cada uno identificado con el nombre de la carpeta \<número\>-\<tema\>. En la carpeta /tests están los tests para cada ejercicio.

Importante:
* Solo se deben modificar los ficheros de `/src`.
* En cada carpeta de `/src`, el fichero `index.js` es el que se debe modificar, siempre exportando una función en `module.exports.default`.

Para comprovar si el ejercicio están bien, hay que ejecutar:

`npm test <número_del_ejercicio> <solución_opcional>`

# Alias para docker

`alias t='docker run --rm -it -v $(pwd):/var/www -w /var/www node:8-alpine npm test'`

Con el alias definido, para ejecutar un test hay que usar el comando:

`t <número_del_ejercicio> <solución_opcional>`
