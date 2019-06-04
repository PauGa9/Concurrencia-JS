# User authentication
La siguiente historia del sprint es preparar un controller para una aplicación hecha con [Express](https://expressjs.com/). El objetivo del controller es realizar la autenticación del usuario.

### Contexto: Express JS
Un controller de Express es una función con dos argumentos, `request` y `response`. Los parámetros se encuentra en `request.body.<nombre_parametro>`. Para devolver la respuesta http, es necesario llamar a uno de distintos métodos de `response`. En nuestro caso lo simplicaremos llamando `response.json(jsonData)`, que finaliza el proceso de respuesta http enviando el valor del objeto `jsonData` parseado.

### Ejercicio
La lógica del controller es:

1. Llamar a un servicio de OAuth, pasándole nombre de usuario y password (estos dos parámetros los tendremos en `request.body.username` y `request.body.password`).

2. Si el usuario existe, el servicio de Auth nos devuelve un token para la sesión del usuario. Devolvemos la respuesta http con `{token: <valor_token>}`.

3. En caso de que el usuario no exista o la combinación `username`-`password` sea incorrecta, nos devolverá un error. Devolvemos la respuesta http con `{error: "Usuario y/o contraseña incorrecto"}`.

Para la autenticación, disponemos del siguiente módulo JS:
- `require('./src/services/auth).authenticate(userId: string, password: string, callback: (error, token) => void)`

Se trata de una función asíncrona, que ejecutará el parámetro `callback` cuando haya finalizado. El error contendrá el mensaje `wrong` si el usuario no existe.

### Ejecutar los tests
> npm test 2

o usando el alias con docker:

> t 2
