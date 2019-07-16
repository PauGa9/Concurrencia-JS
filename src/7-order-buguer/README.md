# Make a burguer
¿A quién no le gusta una hamburguesa? Necesitamos una función que nos encargue las materias primas (carne, pan y condimentos) para preparar nuestra hamburguesa.

### Ejercicio
Exportaremos una función que generará diferentes promesas de manera concurrente, y nos devolverá los resultados cuando todas hayan finalizado.

1. Encontrarás importadas las 3 funciones que sirven para encargar alguno de los elementos para preparar una hamburguesa (`orderMeat`, `orderBread` y `orderCondiments`).
2. Cada una de estas funciones devuelve una Promesa. Ejemplo: `orderMeat():Promise`. Como las 3 funciones son independientes, las podemos ejecutar de forma concurrente en vez de secuencialmente como hemos hecho en ejercicios anteriores.
3. Una vez todas la promesas se hayan resuelto, debes devolver un array con el resultado de cada una.

Para este ejercicio presupondremos que las promesas siempre se resuelven (no hacen reject), por lo que prescindiremos de llamar al método `catch`.

### Ejecutar los tests
> npm test 7

o usando el alias con docker:

> t 7
