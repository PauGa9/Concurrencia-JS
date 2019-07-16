# User authentication & Cache
Ya tenemos el controller para autenticación, genial! Al siguiente sprint, nos llega una tarea para mejorar el tiempo de la autenticación.

### Ejercicio
Implementar el sistema de cache para el token de usuario.
Deberemos modificar la lógica del controller. Puedes reutilizar el código del ejercicio 2 que consideres. La nueva lógica del controller es:

1. Comprobar si tenemos guardado en cache el token del usuario. Usaremos una cache de tipo clave-valor, donde la clave será el valor de `userId` y el valor será el token. Deberemos llamar la función `cache.get(userId, callback)`.

    1.a. Si tenemos el token en cache, finalizamos la petición http llamando `response.json({token: <valor_token>})`.

    1.b. Si se produce un error, finalizamos la petición http llamando `response.json({error: 'Uuups'})`

2. Si no existe en cache el token (el parámetro `value` será null), deberemos llamar al servicio de Auth, pasándole nombre de usuario y password (estos dos parámetros los tendremos en `request.body.userId` y `request.body.password`).

    2.a. Si se produce un error al llamar al servicio de Auth (el usuario no existe), finalizamos la petición http llamando `response.json({error: 'Uuups'})`.

3. Si el usuario existe, el servicio de Auth nos devuelve un token para la sesión del usuario. Antes de finalizar la petición http deberemos guardar el token en la cache, llamando al método `cache.set(userId, token, callback)`.

    3.a. Si se produce un error al llamar `cache.set`, debemos finalizar la petición http devolviendo el objeto `{error: 'Uuups'}`.

    3.b. Si se persiste el token en cache correctamente, finalizamos la petición http llamando `response.json({token: <valor_token>})`.

Para la autenticación, disponemos del siguiente módulo JS:
- `require('./src/services/auth).authenticate(userId: string, password: string, callback: (error, token) => void)`

Se trata de una función asíncrona, que ejecutará el parámetro `callback` cuando haya finalizado. Si el usuario no existe nos devolverá `error` con el error; de lo contrario `error` será `null` y `token` contendrá el token de usuario.

Para la cache, disponemos del siguiente módulo JS:
- `require('./src/services/cache).get(key: string, callback: (error, value: string) => void)`
- `require('./src/services/cache).set(key: string, value: string, callback: (error, insertions: number) => void)`

Ambas funciones son asíncronas,  ejecutarán el parámetro `callback` al finalizar. La función `get` devolverá `value` con el token si existe la key en cache, `null` si no existe la key (en ambos casos, `error` será `null`); devolverá `error` si se ha producido algún error en la conexión. `set` devolverá el número de inserciones realizadas en el parámetro `insertions`; devolverá `error` si se ha producido algún error en la conexión.

### Ejecutar los tests
> npm test 3

o usando el alias con docker:

> t 3
