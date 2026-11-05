# Ejercicios de programación orientada a objetos (POO)

**Instrucciones:** Para cada ejercicio, diseña primero la solución en papel (clases, atributos y métodos) y luego escribe el código en C#. Recuerda: **primero el diseño en papel, luego la codificación**.

---

### Bloque I: Primeros pasos: tu primera clase (ejercicios 1-16)

**Ejercicio 1: Ficha de tu Pokémon**
Crea la clase `Pokemon` con las propiedades `Nombre`, `Nivel` y `Tipo`, usando un `enum TipoPokemon { Fuego, Agua, Planta, Electrico, Normal }`. Añade un constructor y sobrescribe `ToString()` para que la ficha se muestre como `Pikachu [Electrico] Nv. 12`.

**Ejercicio 2: Tu canal de Twitch**
Crea la clase `Canal` con `Nombre`, `Seguidores` y `EnDirecto` (bool). Implementa `Emitir(bool directo)` para cambiar el estado, `GanarSeguidores(int n)` que solo acepte valores positivos y un `ToString()` con el resumen del canal.

**Ejercicio 3: Moneda al aire**
Crea la clase `Moneda` con un método `Lanzar()` que devuelva `Cara` o `Cruz` al azar (`Random.Shared`) y una propiedad `Lanzamientos` que cuente las veces que se ha lanzado. Muestra la estadística tras 10 lanzamientos.

**Ejercicio 4: Tu equipo de Fantasy**
Crea la clase `Futbolista` con `Nombre`, `Media` y `Posición` (usa un `enum Posicion { Portero, Defensa, Centro, Delantero }`). Crea tres futbolistas, muéstralos con `ToString()` y calcula la media del equipo.

**Ejercicio 5: Modelado de geometría con tipos por valor e inmutabilidad**

Diseña un tipo para representar un punto en un plano bidimensional (`Punto2D`) con coordenadas `X` y `Y`.

1.  Implementa `Punto2D` como un **`struct`** para que sea un tipo por valor, adecuado para datos pequeños e inmutables.
2.  Utiliza **Propiedades Auto-implementadas `get; init;`** para asegurar que una vez creado, el punto sea inmutable.
3.  Sobrescribe el método **`ToString()`** para devolver una representación legible de la coordenada, por ejemplo: `(X: 10, Y: 5)`.

**Ejercicio 6: El semáforo de tu ciudad**
Crea la clase `Semaforo` con un `enum EstadoSemaforo { Rojo, Ambar, Verde }` y un método `Pasar()` que cambie al siguiente estado en orden. Muestra en consola los tres estados y explica en un comentario por qué un `enum` es mejor que usar números sueltos.

**Ejercicio 7: El gato de Neko Atsume**
Crea la clase `Gato` con `Nombre`, `Hambre` y `Energía` (campos privados de 0 a 100). Implementa `Alimentar()` (+30 de energía), `Jugar()` (-20) y `Miaular()`, sin que el estado nunca salga del rango, más un `ToString()` con el estado del gato.

**Ejercicio 8: La calculadora de tu stream**
Crea la clase `Calculadora` con los métodos `Sumar`, `Restar`, `Multiplicar` y `Dividir`. En `Dividir` lanza una `ArgumentException` si el divisor es 0 (validación temprana) y prueba ese caso desde el programa principal con `try-catch`.

**Ejercicio 9: Miembros estáticos y contadores de instancias**

Crea una clase `Pedido` con un constructor que inicialice sus propiedades (ej: `Id`, `Cliente`).

Implementa una propiedad **estática** llamada `TotalPedidosCreados` dentro de la clase `Pedido`:
1.  Asegura que esta propiedad se incremente automáticamente cada vez que se crea una nueva instancia de `Pedido`.
2.  Esta propiedad debe ser de solo lectura pública (`static readonly` o solo `get`) y reflejar el número total de objetos `Pedido` vivos o creados en el programa, demostrando el uso de **datos compartidos de la clase**.

**Ejercicio 10: Tu perfil de TikTok**
Crea la clase `PerfilTikTok` con `Usuario`, `Seguidores` y `VideosPublicados`, más la propiedad calculada `SeguidoresPorVideo` (sin campo propio). Muestra la ficha con `ToString()` y actualiza los seguidores tras «subir» un vídeo nuevo.

**Ejercicio 11: Encapsulamiento y validación con propiedades completas**

Diseña la clase `Producto` que tiene un campo `Precio` (decimal).

1.  Implementa el `Precio` utilizando una **Propiedad Completa** (con *backing field* explícito o implícito, como `field` en C# 14+).
2.  En el accesor **`set`**, implementa una validación que asegure que el precio nunca puede ser negativo o cero. Si el valor de entrada es inválido, lanza una **`ArgumentException`**, aplicando la buena práctica de **Validación Temprana** para proteger el estado del objeto.
3.  La propiedad debe ser *get-only* una vez inicializada, o manejar un acceso `internal set` para controlar su modificación posterior.

**Ejercicio 12: Tamagotchi: tu mascota digital**
Crea la clase `Tamagotchi` con `Nombre`, `Hambre` y `Felicidad` (privados, 0-100). Implementa `Alimentar()`, `Jugar()` y `Dormir()` que ajusten el estado sin salirse del rango, y un método `EstaContento()` que devuelva `true` solo si ambos valores superan 50.

**Ejercicio 13: Entrada al concierto**
Crea la clase `Entrada` con `Artista`, `Fecha`, `Precio` y `Zona` (usa un `enum Zona { Grada, Pista, Palco }`). El precio lo decide la zona (Grada 25€, Pista 40€, Palco 60€) y el `ToString()` debe imprimir el ticket completo.

**Ejercicio 14: Skin de Fortnite**
Crea la clase `Skin` con `Nombre`, `Precio` y `Rareza` (usa un `enum Rareza { Comun, PocoComun, Epica, Legendaria }`). Añade `AplicarDescuento(double porcentaje)` que nunca deje el precio en negativo y un `ToString()` con la ficha de la skin.

**Ejercicio 15: Validador de contraseñas**
Crea la clase `Contrasena` que reciba la contraseña en el constructor y solo la acepte si tiene 8 caracteres o más; si no, lanza `ArgumentException`. Añade `EsFuerte()` (contiene letra y número) y un `ToString()` que la muestre enmascarada (`********`).

**Ejercicio 16: La pizza de tu barrio**
Crea la clase `Pizza` con `Tamano` (usa un `enum Tamano { Pequena, Mediana, Grande }`), `PrecioBase` y un array `string[] Ingredientes`. Calcula el precio final (tamaño + 1€ por ingrediente) con una propiedad calculada y muéstrala con `ToString()`.

---

### Bloque II: Clases que colaboran: estados, arrays y menús (ejercicios 17-35)

**Ejercicio 17: Ejercicio del reloj**
Realiza una clase `Reloj` que sea capaz de almacenar la hora de un reloj (hora, minuto y segundo) y el modo en el que se mostrará la hora (versión 12 o 24 horas).

Se deben implementar:
*   Los métodos habituales (constructores, *getters* y *setters*).
*   Algún método especial que permita recargar pila.
*   Sobrecargar el método `toString` para mostrar la hora.

**Ejercicio 18: Tu playlist de Spotify**
Crea la clase `Cancion` (`Titulo`, `Artista`, `DuracionSegundos`) y la clase `Playlist` con un array `Cancion[]` de 10 huecos: `Agregar(Cancion)`, `Quitar(string titulo)`, `DuracionTotal()` en minutos y `Mostrar()`. Comenta qué pasa cuando la playlist se llena.

**Ejercicio 19: Tu Pokédex**
Crea la clase `Pokedex` con un array `Pokemon[]` de 10 huecos (reutiliza el `Pokemon` del Ejercicio 1). Implementa `Capturar(Pokemon)`, `BuscarPorNombre(string)`, `ContarPorTipo(TipoPokemon)` y `Listar()` con cabecera de tabla.

**Ejercicio 20: ¿Es la misma skin?**
Crea la clase `Skin` (`Nombre`, `Rareza`, `Precio`) y sobrescribe `Equals()`, `GetHashCode()` y `ToString()` para comparar dos skins por nombre y rareza. Comprueba en el programa principal que `==` sigue comparando referencias y `Equals()` compara contenido.

**Ejercicio 21: Tu cuenta de Netflix**
Crea la clase `Perfil` (`Nombre`, `Edad`) y la clase `CuentaNetflix` con un array `Perfil[]` de 5 huecos: `Añadir(Perfil)`, `Quitar(string nombre)` y una propiedad `PuedeVerAdultos()` que sea `true` solo si algún perfil tiene 18 años o más.

**Ejercicio 22: La máquina expendedora**
Crea la clase `MaquinaExpendedora` con un array de productos (`Nombre`, `Precio`) y saldo insertado: `InsertarDinero(double)` y `Comprar(int posicion)` que devuelva el producto y el cambio, o informe de error si el saldo no alcanza o la posición no existe.

**Ejercicio 23: El PIN de tu casillero**
Crea la clase `Candado` con su PIN, un máximo de 3 intentos y el método `IntentarAbrir(string pin)` que devuelva `true` o `false`. Al superar los intentos, el candado queda `Bloqueado` y ya no admite más intentos.

**Ejercicio 24: Generador de nombres RPG**
Crea la clase estática `GeneradorNombres` con métodos `static` como `NombreOrco()` y `NombreElfo()` que combinen sílabas con `Random.Shared`. No debe poder instanciarse desde fuera (clase `static`) y el resultado debe ser distinto en cada ejecución.

**Ejercicio 25: Clase ordenador y aula**
Crea una clase que almacene la información técnica de un `Ordenador`.

Crea también una clase `Aula` que permita:
*   Almacenar la información de todos los ordenadores almacenados en un aula.
*   Guardar el nombre del aula y el curso que se imparte en la misma.
*   El programa principal debe permitir gestionar dicha aula.
*   Queda a elección del alumno definir los atributos y métodos necesarios.

**Ejercicio 26: El inventario de Minecraft**
Crea la clase `Inventario` con un array `string[]` de 9 huecos: `Guardar(string)` que devuelva `false` si está lleno, `Tirar(string)`, `EstaLleno()` y `Listar()`. Comenta en un comentario qué limitación impone el tamaño fijo del array.

**Ejercicio 27: Cuenta bancaria**
Gestiona una `CuentaBancaria`. Dicha cuenta constará de un número de cuenta, un saldo y tres titulares (como máximo, al menos uno). Para cada `Titular` tenemos que almacenar su DNI, nombre, apellidos y teléfono.

Crea los métodos necesarios que permitan realizar las operaciones habituales:
*   Ingresar y retirar dinero.
*   Añadir/borrar titulares a la misma.
*   Cuando se crea una cuenta debe tener al menos un titular.

El programa principal debe tener menús que permitan gestionar todos los aspectos de la cuenta.

**Ejercicio 28: El robot aspirador**
Crea la clase `RobotAspirador` con un `enum EstadoRobot { Cargando, Limpiando, Dormido }` y batería de 0 a 100. Implementa `Cargar()`, `Limpiar()` (gasta 20 de batería y solo funciona si queda) y `Parar()`, mostrando el estado tras cada acción.

**Ejercicio 29: El mapa de Minecraft**
Crea la clase `Mapa` con una matriz `string[,]` de 8x8 llena de `Aire`, y los métodos `Excavar(int fila, int columna)` (la casilla pasa a `Tierra`), `Colocar(string bloque)` y `Mostrar()` que pinte el mapa con su leyenda.

**Ejercicio 30: El ahorcado de la clase**
Crea la clase `Ahorcado` con la palabra secreta, un `char[]` con los guiones, 6 vidas y el método `Probar(char letra)` que descubra las apariciones o reste una vida. Añade `EstaGanado()` y `Mostrar()` con el estado actual del juego.

**Ejercicio 31: El gacha de tu móvil**
Crea la clase `Gacha` con un `enum Rareza { Comun, Rara, Epica, Legendaria }` y un método `Invocar()` con probabilidades 70/20/8/2. Cuenta las invocaciones y garantiza una legendaria si se llega a 50 sin obtener ninguna.

**Ejercicio 32: La clasificación de tu liga**
Crea la clase `Equipo` (`Nombre`, `Puntos`, `Ganados`, `Empatados`, `Perdidos`) y la clase `Clasificacion` con un array `Equipo[]` de 20. Implementa `Ordenar()` por puntos de mayor a menor (puedes reutilizar la Burbuja de la UD03) y `Mostrar()` con tabla formateada.

**Ejercicio 33: Clase fracción (racional)**
Crea una clase `Racional` que permita trabajar con números racionales (fracciones).

Incluye los siguientes métodos:
*   Constructores (por defecto y parametrizados), `toString`, *getters* y *setters*.
*   `leer();` → que pide la fracción por teclado.
*   `c=sumar(a,b);` → que suma las fracciones `a` y `b`, devolviendo la fracción simplificada `c`.
*   `c=multiplicar(a,b);` → que multiplica las fracciones `a` y `b`, devolviendo la fracción simplificada `c`.
*   `a = simplificar(b);` → método que simplifica la fracción `b` devolviéndola en la `a`.

**Ejercicio 34: La mosca orientada a objetos**
Realiza el juego de la `Mosca` que se hizo con matrices, pero orientado a objetos.
Una vez resuelto, amplía el juego añadiendo a la mosca un `tipo` (corriente, verde, negra, coj...) y `vidas`. Las vidas de la mosca indican la cantidad de golpes que tiene que recibir para matarla. Cuando golpeamos una mosca y le quedan vidas, le restamos una vida y revolotea.

**Ejercicio 35: Buscaminas orientado a objetos**
Realiza el ejercicio del `Buscaminas` pero orientado a objetos. En el programa principal se desarrolla el juego con los métodos proporcionados por la clase correspondiente.

---

### Bloque III: Diseño avanzado: patrones, herencia y juegos (ejercicios 36-50)

**Ejercicio 36: Gestión de recursos con singleton y carga perezosa**

Crea una clase `GestorRecursos` que simule la carga de recursos de la aplicación (imaginando que es una operación costosa).

1.  Implementa esta clase utilizando el patrón **Singleton**, asegurando que solo exista una única instancia de `GestorRecursos` en todo el sistema.
2.  Utiliza el patrón **Lazy (Perezoso)** para garantizar que la carga de recursos y la creación de la instancia del `GestorRecursos` solo ocurra la primera vez que se accede a ella.
3.  Explique cómo esta combinación de patrones optimiza el **rendimiento inicial** de la aplicación.

**Ejercicio 37: Tu progreso XP encadenable**
Crea la clase `ProgresoXP` cuyos métodos devuelvan `this` (`Ganar(int xp)`, `GanarDoble()`, `Restar(int xp)`) para poder encadenarlos, y una propiedad `Nivel` calculada (cada 1000 XP). Configura tu progreso en una sola línea con el patrón Fluent.

**Ejercicio 38: Personajes de tu RPG**
Crea la clase base `Personaje` (`Nombre`, `Vida`, método `virtual Atacar()`) y las hijas `Guerrero`, `Mago` y `Arquero` que sobrescriban `Atacar()` con daños distintos. Recorre un array `Personaje[]` y muestra el ataque de cada uno: eso es polimorfismo.

**Ejercicio 39: Ajedrez: las piezas**
Crea la clase abstracta `Pieza` con `Color` y el método `abstract PuedeMoverA(int x, int y)`, e implementa `Peon`, `Torre` y `Caballo` con sus reglas de movimiento. Crea un array de piezas y comprueba varios movimientos válidos e inválidos.

**Ejercicio 40: Excepción personalizada: la tienda del juego**
Crea tu propia excepción `SaldoInsuficienteException` (hereda de `Exception` con su constructor de mensaje) y úsala en la clase `BilleteraJuego` al intentar comprar sin saldo suficiente. Captúrala en el programa principal con `catch (SaldoInsuficienteException)`.

**Ejercicio 41: La fábrica de droides**
Crea la clase estática `DroidFactory` con el método `CrearAleatorio()` que devuelva un `Droid` de tipo `SW348` (30%), `SW447` (50%) o `SW421` (20%) con sus atributos generados al azar. Comprueba que diez droides seguidos salen distintos.

**Ejercicio 42: El pedido de tu comida rápida**
Crea la clase `LineaPedido` (`Producto`, `Cantidad`, `PrecioUnitario`) y la clase `Pedido` con un array `LineaPedido[]`: `AñadirLinea()`, `Total()` con IVA del 21%, `AplicarDescuento(double porcentaje)` y un `ToString()` con el ticket. Rechaza con `ArgumentException` las líneas con cantidad 0.

**Ejercicio 43: El refugio de mascotas**
Crea la clase abstracta `Mascota` (`Nombre`, `Edad`, método `abstract string Sonido()`) e implementa `Perro`, `Gato` y `Conejo`. Recorre el array `Mascota[]` del refugio mostrando el sonido de cada una y añade `Adoptar(Mascota)` que la elimine del refugio.

**Ejercicio 44: Patrón builder para la configuración de mensajes**

Crea una clase `Mensaje` que represente un email o notificación. La clase debe tener propiedades complejas y opcionales (ej: `Destinatario`, `Asunto`, `Cuerpo`, `Prioridad`, `Adjuntos`).

Implementa el patrón **Builder** para la clase `Mensaje`:
1.  Asegúrate de que la clase `Mensaje` sea privada para su instanciación y deba crearse siempre a través de la clase `MensajeBuilder`.
2.  El Builder debe tener métodos encadenables (`.ConAsunto()`, `.ConCuerpo()`, etc.) que sigan el **Patrón Fluent**.
3.  El método final `Construir()` del Builder debe validar que los campos obligatorios (ej: `Destinatario` y `Cuerpo`) existan, lanzando una excepción si no es así.

**Ejercicio 45: El duelo de cartas coleccionables**
Crea la clase `Carta` (`Nombre`, `Ataque`, `Defensa`, `Rareza` con enum), la clase `Mazo` con un array `Carta[]` de 20 (`Barajar()` con `Random.Shared` y `Robar()`) y la clase `Duelo` que compara el ataque de las cartas robadas, cuenta las victorias de cada jugador y muestra el resultado final.

**Ejercicio 46: La batalla naval**
Crea la clase `Barco` (nombre, tamaño y posición de sus casillas) y la clase `Tablero` con una matriz de casillas y un array `Barco[]` con la flota. Implementa `Disparar(int fila, int columna)` que devuelva `Agua`, `Tocado` o `Hundido`, con condición de victoria cuando se hunda toda la flota.

**Ejercicio 47: El coche**
Realiza una clase `Coche` con atributos que reflejen su marca, modelo, color y matrícula. También debe almacenar información acerca de sus características de movimiento: motor encendido o apagado, `marchaActual`, `velocidadActual`, `subirMarcha`, `bajarMarcha` y aquellos que creas conveniente para manipular su información dinámica.

Crea los métodos necesarios que permitan simular lo siguiente:
a) El coche parte de una situación de reposo.
b) Arranca.
c) Acelera e irá subiendo marchas hasta llegar a una velocidad que se ha pedido por teclado al usuario.
d) Se mantiene esa velocidad un tiempo que se ha pedido al usuario por teclado.
e) Se va desacelerando y bajando marchas hasta que el coche se pare.
f) Punto muerto y paramos el motor.

**Consideraciones para la simulación:**
*   Rangos de marcha: 1ª 0 – 30; 2ª 30 – 50; 3ª 50 – 70; 4ª 70 – 100; 5ª 100 →.
*   El 10% de las veces se nos cruza un gato. Para evitar pillarlo se debe simular un frenazo que pare el coche y cale el motor.

**Ejercicio 48: Manejo de conjuntos**
Realiza una clase `Conjunto` que permita crear conjuntos matemáticos.
Estos conjuntos deben contener letras en un número indefinido de ellas y sin importar que se repitan.

Crea los métodos habituales y los necesarios para añadir y borrar elementos.

Después se deben implementar las siguientes operaciones con los conjuntos:
*   `C=Intersección(A,B)` → Devuelve el conjunto formado por los elementos comunes en A y B.
*   `C=Unión(A,B)` → Devuelve el conjunto formado por todos los elementos de A y B.
*   `N=Cardinalidad(A)` → Devuelve la cantidad de elementos del conjunto A.

**Ejercicio 49: Serpiente**
Diseña un programa orientado a objetos que simule la vida de una `Serpiente` con las siguientes características:
*   Compuesta por anillas de un color diferente cada una, alternando entre (r, v, a).
*   Cuando nace tiene un color asignado al azar.

Se simulará su vida hasta que esté muerta (se quede sin cuerpo), de forma que cada año (segundo):

| Edad              | Comportamiento | Probabilidad | Acción                                               |
| :---------------- | :------------- | :----------- | :--------------------------------------------------- |
| Joven (< 10 años) | Crecerá        | 80%          | Añade una nueva anilla de color aleatorio.           |
| Joven (< 10 años) | Mudará la piel | 20%          | Se cambia el cuerpo respetando el número de anillas. |
| Mayor (> 10 años) | Decrecerá      | 90%          | Quita una anilla a su cuerpo (la última).            |
| Mayor (> 10 años) | Mudará la piel | 10%          | Se cambia el cuerpo respetando el número de anillas. |

*   Aleatoriamente, el 10% de las veces, puede sufrir el ataque de una mangosta (la serpiente muere y se para la simulación).

**Generalización (Nido):**
Generaliza el ejercicio para un `Nido` de serpientes que puede albergar, como máximo, hasta 20 serpientes.
*   Se simulará la vida del nido durante 5 minutos.
*   Cada cinco segundos nacen (si pueden) entre 1 y 3 serpientes, ocupando su lugar en el nido.
*   Cada segundo (año de la vida de una serpiente) pasará la vida para cada serpiente del nido según se especificó anteriormente (menos el ataque de la mangosta).
*   Cada 10 segundos una mangosta aparece por el nido, zampándose entre 0 y 4 serpientes el 20% de las veces.
*   Se debe mostrar el estado del nido cada segundo y describir lo que va ocurriendo.

**Ejercicio 50: Conquistadores de catán (simplificado)**
Implementa un juego conocido como `Conquistadores de Catán` solo para dos jugadores: un humano y el ordenador.

**Funcionamiento:**
*   El juego consiste en un mapa de 3x4 casillas.
*   Cada `Casilla` tendrá un recurso (trigo, madera y carbón), un jugador que será el dueño, y un valor numérico entre 1 y 6 (valores de un dado).
*   Inicialización: El tablero se inicializa colocando en cada casilla un recurso y un valor aleatorios.
*   Almacenes: Al comienzo, los dos jugadores tienen sus almacenes de madera, carbón y trigo a cero.
*   Reparto de casillas: Se preguntará al usuario qué casilla quiere ocupar; luego el ordenador elige una casilla vacía al azar, y así sucesivamente hasta que las 12 casillas estén ocupadas.
*   Juego: Tiran los jugadores por turnos. El valor del dado se comparará con todos los valores de las casillas del tablero. Con aquellas que coincidan, se incrementará la cantidad de recursos que esas casillas indiquen a sus propietarios.
*   Ganará el primero que consiga llegar a 20 en todos los recursos.
