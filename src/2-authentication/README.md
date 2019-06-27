# User authentication
La siguiente historia del sprint es preparar un controller para una aplicación hecha con [Express](https://expressjs.com/). El objetivo del controller es realizar la autenticación del usuario y devolver un token para la sesión del usuario.

### Contexto: Express JS
En la función se reciben dos argumentos:

1. El primero `request` simula la petición del usuario.
2. El segundo `response` lo utilizaremos para devolver la respuesta llamando `response.json(jsonData)`.

### Ejercicio
El objetivo del controller es realizar la autenticación del usuario y devolver un token para la sesión del usuario.

1. Entender como recibimos los parametros.
2. Llamar al servicio de auth, pasándole nombre de usuario y password.
    * Para la autenticación, disponemos del siguiente módulo y método:
    - `require('./src/services/auth).authenticate(userId: string, password: string, callback: (error, token) => void)`
    * Se trata de una función asíncrona, que ejecutará el parámetro `callback` cuando haya finalizado. Si el usuario no existe nos devolverá `error` con el error; de lo contrario `error` será `null` y `token` contendrá el token de usuario.

2. Preparar respuesta según haya funcionado autenticación.
    * Si el usuario existe, el servicio de auth nos devuelve un token para la sesión del usuario. finalizamos la petición http llamando `response.json({token: <valor_token>})`.
    * En caso de que el usuario no exista o la combinación `userId`-`password` sea incorrecta, nos devolverá un error. finalizamos la petición http llamando `response.json({error: "Usuario y/o contraseña incorrecto"})`.


### Ejecutar los tests
> npm test 2

o usando el alias con docker:

> t 2
