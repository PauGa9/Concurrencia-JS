# User authentication & Cache, Promised!
Han pasado un par de meses desde que creamos el controller de autenticación con cache. El problema que hemos detectado es que es poco mantenible y nos piden que eliminemos el callback hell. Nos comprometemos a hacerlo mantenible!

### Ejercicio
Deberemos mantener la misma lógica del ejercicio 3, pero usaremos `Promises` para hacer el código más fácil de entender.

Los módulos que hemos usado también tienen su nueva versión con promesas:

Para la autenticación, disponemos del siguiente módulo JS:
- `require('./src/services/auth).authenticate(userId: string, password: string) => Promise<string>`

Se trata de una función asíncrona la cual devolverá una promesa. Si el usuario no existe la promesa pasará al estado `reject` con el error; de lo contrario pasará al estado `resolve` con el token de usuario.

Para la cache, disponemos del siguiente módulo JS:
- `require('./src/services/cache).get(key: string) => Promise<string>`
- `require('./src/services/cache).set(key: string, value: string) => Promise<number>`

Ambas funciones son asíncronas que devuelven una promesa. La promesa de la función `get` pasará a resolved con un string (el token si existe la key en cache), `null` si no existe la key; pasará a `rejected` si se ha producido algún error en la conexión. `set` devolverá el número de inserciones realizadas si la promesa pasa a `resolved`; si se ha producido algún error en la conexión pasará a `rejected`.

### Ejecutar los tests
> npm test 4

o usando el alias con docker:

> t 4
