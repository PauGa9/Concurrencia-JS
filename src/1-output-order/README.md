# Output order

### Contexto
Nos han encargado refactorizar un proyecto legacy. Durante el refactor, nos encontramos con una función que imprime logs, pero el orden de estos no es el esperado por el orden del cógido. Antes de poder realizar los cambios, es necesario saber el orden en que se emiten los logs. Para simplificar, los logs son números, del 1 al 7.

### Ejercicio
Encontrar que se verá por consola.

### Ejecutar los tests
> npm test 1 \<números separados por coma\>

o usando el alias con docker:

> t 1 \<números separados por coma\>
