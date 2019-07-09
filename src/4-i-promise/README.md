# Save breweries in file
Unos amigos se van de vacaciones a Buffalo y nos piden si les podemos filtrar las cervecerías de esta ciudad, ya que son amantes de esta bebida.

### Ejercicio
Prepararemos un script que realizará una petición http a un endpoint, el cual nos devolverá un JSON , el cual filtraremos para obtener las cervecerías de Buffalo y finalmente guardaremos en un fichero.

1. Haremos petición http GET con `axios` al endpoint [https://api.openbrewerydb.org/breweries?by_state=new_york](https://api.openbrewerydb.org/breweries?by_state=new_york)
    - `axios.get(url: string): Promise<response>`
2. Entenderemos que nos devuelve la api.
    - Se trata de un objecto donde la propiedad ````data```` es un array de objetos, donde cada objeto tiene dos propiedades que nos interesan: `city` y `name`.
3. Prepararemos un fitxero para mandarlo a los amigos. 
    * Fichero tendrá contenido similar a:
        ```lugar1,lugar2,lugar3```
    * Para escribier el fichero usaremos la función `promiseFs.writeFile`:
        * `promiseFs.writeFile(path: string, data: string): Promise<null>`

### Ejecutar los tests
> npm test 4

o usando el alias con docker:

> t 4
