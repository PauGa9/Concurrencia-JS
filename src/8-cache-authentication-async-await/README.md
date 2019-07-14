# Async authentication & Cache, await!
Después de mejorar el controller de autenticación y caché con promesas, nos preguntamos si lo podríamos hacer con async/await.

### Ejercicio
Deberemos mantener la misma lógica del ejercicio 6, pero usaremos `async/await`.

Para la autenticación, disponemos del siguiente módulo JS:
- `require('./src/services/auth).authenticate(userId: string, password: string) => Promise<string>`

Se trata de una función asíncrona la cual devolverá una promesa. Si el usuario no existe la promesa pasará al estado `reject` con el error; de lo contrario pasará al estado `resolve` con el token de usuario.

Para la cache, disponemos del siguiente módulo JS:
- `require('./src/services/cache).get(key: string) => Promise<string>`
- `require('./src/services/cache).set(key: string, value: string) => Promise<number>`

Ambas funciones son asíncronas que devuelven una promesa. La promesa de la función `get` pasará a resolved con un string (el token si existe la key en cache), `null` si no existe la key; pasará a `rejected` si se ha producido algún error en la conexión. `set` devolverá el número de inserciones realizadas si la promesa pasa a `resolved`; si se ha producido algún error en la conexión pasará a `rejected`.

### Ejecutar los tests
> npm run test-async 8
