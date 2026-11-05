#### Cuestionario de investigación y desarrollo: programación orientada a objetos (POO)

- [Cuestionario de investigación y desarrollo: programación orientada a objetos (POO)](#cuestionario-de-investigación-y-desarrollo-programación-orientada-a-objetos-poo)
  - [I. Conceptos y principios de la POO (preguntas 1-4)](#i-conceptos-y-principios-de-la-poo-preguntas-1-4)
  - [II. Clases, visibilidad y constructores (preguntas 5-9)](#ii-clases-visibilidad-y-constructores-preguntas-5-9)
  - [III. Propiedades, inmutabilidad y tipos de datos (preguntas 10-15)](#iii-propiedades-inmutabilidad-y-tipos-de-datos-preguntas-10-15)
  - [IV. Patrones, excepciones y organización (preguntas 16-20)](#iv-patrones-excepciones-y-organización-preguntas-16-20)

**Instrucciones:** Lee cada pregunta con atención y proporciona una respuesta detallada, justificando tus afirmaciones con los conceptos aprendidos.

---

##### I. Conceptos y principios de la POO (preguntas 1-4)

**1. Los Pilares de la POO en el Diseño de Software**
La **Programación Orientada a Objetos (POO)** se define como una forma de escribir programas inspirada en la observación del mundo real. Resuma la **importancia de los conceptos** fundamentales (Abstracción, Ocultación, Encapsulamiento, Herencia y Polimorfismo) en el **diseño de software** complejo.

**2. Modularidad y Clases con Responsabilidad Única**
Explique la práctica de la **Modularidad** en el desarrollo de software. ¿Cómo contribuye la filosofía de mantener las clases **pequeñas y con responsabilidad única** a la hora de crear programas que son más fáciles de testear, mantener y ampliar?

**3. Identidad, Estado y Comportamiento de un Objeto**
Defina los tres conceptos que caracterizan a un objeto en la POO: **identidad**, **estado** y **comportamiento**. Ilustre cada uno con un objeto `Pedido` de una aplicación de reparto y explique por qué la identidad no cambia aunque el estado sí lo haga a lo largo del tiempo.

**4. La Clase como Molde y la Creación de Objetos**
Explique la diferencia entre **clase** y **objeto** y por qué la clase se describe como un molde. ¿Qué devuelve la palabra clave `new` en C# y por qué dos objetos creados a partir de la misma clase no son el mismo objeto? Justifique su respuesta con el concepto de identidad.

##### II. Clases, visibilidad y constructores (preguntas 5-9)

**5. Visibilidad: Modificadores de Acceso y Encapsulamiento**
Describa los modificadores de acceso `public`, `private`, `protected` e `internal` en C#, indicando el alcance de cada uno. Argumente por qué una buena práctica es empezar siempre por `private` y ampliar la visibilidad solo cuando sea imprescindible, relacionándolo con el principio de ocultación.

**6. Validación Temprana e Integridad del Objeto**
En el diseño de sistemas robustos, la **Validación temprana (fail fast)** es una buena práctica crítica. Si un constructor o método recibe un argumento obligatorio que es nulo, ¿qué tipo de excepción debe lanzarse para asegurar que el objeto no se crea en un estado inconsistente, y cómo se relaciona esto con la integridad del objeto?

**7. Constructor frente a Object Initializer**
Compare la creación de objetos mediante **constructor** y mediante **object initializer**. ¿Cuándo conviene usar cada uno? Describa además en qué consiste la **sobrecarga de constructores** y el papel de `this(...)` para reutilizar la lógica de inicialización sin duplicar código.

**8. Igualdad frente a Identidad en C#**
Dadas dos instancias de una clase `Libro` con el mismo título, explique qué resultado daría cada una de estas comparaciones: `==`, `ReferenceEquals()`, `Equals()` y `GetHashCode()`. ¿Qué relación debe existir entre `Equals()` y `GetHashCode()` y por qué? Incluya además el papel de `ToString()` al representar un objeto por consola.

**9. Getters y Setters frente a Propiedades**
Un compañero afirma que los métodos `GetX()`/`SetX()` y las propiedades `get`/`set` hacen exactamente lo mismo. ¿Está de acuerdo? Razone las diferencias entre ambos enfoques en C# y explique qué ventaja aporta la sintaxis de propiedades, incluyendo un ejemplo en el que el `set` valide el valor recibido antes de aceptarlo.

##### III. Propiedades, inmutabilidad y tipos de datos (preguntas 10-15)

**10. Propiedades con Backing Field y Control de Estado**
Las **Propiedades con Backing Field** (campos de respaldo) permiten un control estricto sobre el estado de un objeto. Describa tres usos comunes para implementar lógica dentro del accesor `set` de una propiedad que requiera un *backing field* explícito, o bien el campo implícito `field` de C# 14.

**11. Inmutabilidad: Mecanismos en C#**
El desarrollo moderno de software promueve la **Inmutabilidad** para aumentar la seguridad y la robustez del código. Describa tres mecanismos específicos en C# (además de los campos `const`) que se utilizan para garantizar que un objeto (o sus propiedades) no se puedan modificar después de su creación o inicialización.

**12. Los Tres Tipos: class, struct y record class**
Compare los tipos **`class`**, **`struct`** y **`record class`** en C#. ¿En qué escenarios de diseño se recomienda utilizar un **`record class`** en lugar de una `class` tradicional, y qué característica clave (relacionada con la igualdad) proporciona el `record` automáticamente?

**13. Miembros Estáticos y el Patrón Singleton**
Explique la diferencia entre miembros de instancia y miembros **`static`**. ¿Qué problema resuelve el patrón **Singleton** y cómo se consigue que solo exista una instancia de la clase (constructor privado más acceso estático)? Mencione un caso real en el que un Singleton sea adecuado y otro en el que pueda ser un problema.

**14. Enums: Constantes con Nombre**
Explique qué es un **`enum`** en C#, qué tipo de dato representa por debajo y por qué mejora la legibilidad frente al uso de números enteros sueltos. Describa un caso en el que un `enum` anidado dentro de una clase aporte contexto, por ejemplo `Nave.Tipo` en una aplicación de logística.

**15. Composición frente a Herencia**
La **Composición de Objetos** es un principio de diseño fundamental. Describa qué tipo de relación modela la composición (a diferencia de la herencia), y mencione dos ventajas de la composición sobre la herencia que la hagan una técnica de diseño más flexible, con menor acoplamiento y más fácil de testear.

##### IV. Patrones, excepciones y organización (preguntas 16-20)

**16. El Patrón Builder y los Objetos Complejos**
El patrón **Builder** se utiliza para la construcción de objetos complejos. Argumente por qué, en el contexto de diseño, se prefiere el patrón Builder frente a un constructor simple que maneja muchos parámetros opcionales o constructores sobrecargados, detallando el problema que el Builder resuelve.

**17. El Patrón Lazy: Inicialización Perezosa**
Explique el funcionamiento del patrón **Lazy (Perezoso)**. ¿Cuál es el beneficio de rendimiento o de recursos que se obtiene al retrasar la creación de una instancia hasta que se accede a ella por primera vez, especialmente cuando la instanciación es costosa o el objeto podría no usarse nunca?

**18. Excepciones: Prevención frente a Reacción**
Diferencie la **prevención** de errores con sentencias `if` de la **reacción** con `try-catch`. ¿De qué clase heredan todas las excepciones en C# y por qué se recomienda capturar primero los tipos más específicos? Justifique además cuándo un `throw` es preferible a una comprobación previa y viceversa.

**19. Parámetros en la Llamada a Métodos**
Analice las tres formas principales de pasar datos a un método en C#: **por valor**, con **`ref`** y con **`out`**. De un ejemplo de cada una en el que sea la elección correcta e indique qué problema ocurre si se usa la forma equivocada, por ejemplo esperando que un método modifique un valor que se ha pasado por valor.

**20. Solución, Proyecto y Visibilidad `internal`**
Diferencie la función y el alcance entre una **Solución (.slnx)** y un **Proyecto (.csproj)** en un entorno de desarrollo C#. Además, explique cómo el modificador de visibilidad **`internal`** se utiliza para definir límites de accesibilidad dentro de esta estructura de proyectos.
