# Save breweries in file
Unos amigos se van de vacaciones a Buffalo y nos piden si les podemos filtrar las cervecerías de esta ciudad, ya que son amantes de esta bebida.

### Ejercicio
Prepararemos un script que realizará una petición http a un endpoint, el cual nos devolverá un JSON , el cual filtraremos y finalmente guardaremos en un fichero.

La petición http la realizaremos con `axios`, obteniendo una promesa. Cuando se haya resuelto la promesa (es decir, en el `.then`), obtendremos la respuesta de la petición en el parámetro `response.data`. Se trata de un array de objetos, donde cada objeto tiene dos propiedades que nos interesan: `city` y `name`.

Una vez hayamos filtrado los elementos del array con el string `Buffalo` en la propiedad `city`, extraeremos la propiedad `name` de cada elemento del array (usando función `map`) y generaremos un string de los nombres (usando la función `join`). Guardaremos el string resultante en disco, usando la función `writeFile` del módulo nativo de NodeJS `fs` (la versión original funciona con callback, la que usaremos para este ejercicio está 'promificada').

La función `axios.get` tiene la siguinte definición:
- `axios.get(url: string): Promise<response>`

La función `promiseFs.writeFile` tiene la siguiente definición:
- `promiseFs.writeFile(path: string, data: string): Promise<null>`

### Ejecutar los tests
> npm test 4

o usando el alias con docker:

> t 4
