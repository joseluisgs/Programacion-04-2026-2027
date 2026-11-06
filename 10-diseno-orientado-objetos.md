- [10. Diseño orientado a objetos: del diagrama E/R a las clases](#10-diseño-orientado-a-objetos-del-diagrama-er-a-las-clases)
  - [10.1. Del diagrama E/R al modelo de clases](#101-del-diagrama-er-al-modelo-de-clases)
    - [10.1.1. Correspondencia: entidad, atributo y relación](#1011-correspondencia-entidad-atributo-y-relación)
    - [10.1.2. La cardinalidad "muchos" es la que rompe el diseño](#1012-la-cardinalidad-muchos-es-la-que-rompe-el-diseño)
  - [10.2. Cardinalidad uno a uno (1-1)](#102-cardinalidad-uno-a-uno-1-1)
  - [10.3. Cardinalidad uno a muchos (1-N)](#103-cardinalidad-uno-a-muchos-1-n)
  - [10.4. Cardinalidad muchos a muchos (N-M)](#104-cardinalidad-muchos-a-muchos-n-m)
  - [10.5. Navegabilidad de las relaciones: hacia dónde se mira](#105-navegabilidad-de-las-relaciones-hacia-dónde-se-mira)
  - [10.6. ¿Quién pone el enlace? Constructor o setter](#106-quién-pone-el-enlace-constructor-o-setter)
  - [10.7. Errores típicos de diseño](#107-errores-típicos-de-diseño)
  - [¿Qué viene después?](#qué-viene-después)
  - [Buenas prácticas](#buenas-prácticas)



# 10. Diseño orientado a objetos: del diagrama E/R a las clases

> 💡 **Punto de partida:** En bases de datos ya has dibujado un diagrama E/R: entidades, atributos y cardinalidades sobre un papel. Pero llega el momento de programar y el papel no compila. ¿Cómo se traduce cada entidad, cada relación y cada "1 a muchos" del diagrama a código C#? Ese es justo el trabajo de este punto: la fase de **diseño** que va antes del código.

En este punto aprenderás a pasar un diagrama E/R a un modelo de clases equivalente, a diseñar las tres cardinalidades (uno a uno, uno a muchos y muchos a muchos) con arrays y structs, y a decidir si el enlace entre objetos se pone al crear (constructor) o después (setter), con sus problemas.

**Objetivos de aprendizaje:**

- Traducir entidades y atributos de un diagrama E/R a tipos `struct` y campos en C#
- Diseñar relaciones uno a uno, uno a muchos y muchos a muchos sin colecciones dinámicas
- Entender por qué la cardinalidad "muchos" es la que condiciona todo el diseño
- Entender la navegabilidad de cada relación: en qué lado vive el enlace y hacia dónde se puede mirar
- Decidir si el enlace se pasa por constructor o por setter y anticipar sus problemas
- Representar las relaciones con arrays, matrices y tuplas, a nivel de esta unidad

## 10.1. Del diagrama E/R al modelo de clases

El diagrama E/R es tu **plano de arquitecto**: te dice qué cosas existen (entidades), qué datos las describen (atributos) y cómo se relacionan (cardinalidades). Programar sin ese plano es construir a ciegas. El flujo correcto siempre es el mismo: **análisis → diseño (papel) → codificación**.

La traducción es más directa de lo que parece: cada cosa del diagrama tiene un sitio exacto en el código. En este punto verás el diseño con `struct` y arrays —tipos que ya dominas— junto a su equivalente con `class`: el diseño es el mismo, solo cambia el contenedor.

### 10.1.1. Correspondencia: entidad, atributo y relación

Esta es la tabla de traducción que usarás siempre entre el papel y el teclado:

| En el diagrama E/R | En C# con `struct` y arrays | En C# con `class` |
| :--- | :--- | :--- |
| **Entidad** | Un `struct` (tipo por valor) | Una `class` |
| **Atributo** | Un campo (`public string Nombre;`) | Una propiedad (`string Nombre { get; set; }`) |
| **Clave primaria** | Un campo `Id` que identifica al registro | Una propiedad `Id` |
| **Relación** | Un campo que guarda el enlace: un valor, un array, una matriz... | Un campo de referencia al otro objeto |
| **Cardinalidad** | El **tipo** del campo del enlace: simple, array o tabla | Igual, pero con colecciones (UD07) |

Fíjate en la última fila: la cardinalidad no es solo una anotación bonita en el papel, decide **qué tipo de campo** necesitas en el código. Un "uno" se resuelve con un valor sencillo; un "muchos" obliga a una estructura entera.

> 📝 **Nota:** Los `struct` son tipos por valor: si copias un `Alumno`, copias todos sus datos, incluido su enlace. Si cambias el `struct` por una `class`, el enlace pasa a ser una referencia: mismo diseño, distinta semántica de copia — algo que ya viste al comparar `class`, `struct` y `record`.

### 10.1.2. La cardinalidad "muchos" es la que rompe el diseño

Cambiar una cardinalidad en el diagrama cuesta un segundo: mueves un símbolo. Cambiarla en el código, en cambio, cambia el diseño entero: el lado "muchos" necesita una estructura de datos nueva (un array, una matriz, un array de tuplas), con su tamaño, sus recorridos y sus errores.

Y recuerda: en esta unidad no hay colecciones dinámicas (llegan en la **UD07**), así que todo "muchos" choca con el **tamaño fijo** de los arrays. Diseñar el "muchos" mal es el error de diseño más caro de todos.

> 💡 **Consejo:** Cuando traduzcas un diagrama, pregúntate siempre por el lado "muchos" de cada relación: ¿cuántos caben?, ¿qué pasa si llega uno más?, ¿y si no llega ninguno? Esas tres preguntas te ahorran medio programa de arreglos.

📌 **Ejemplo real:** Netflix modela cada serie con sus episodios: la serie es el "uno" y los episodios el "muchos". Si al diseñar dimensionas el array de episodios a 20 y la serie resulta tener 60, el código fallará en el primer episodio extra. En el papel eso se ve de un vistazo; en código, tarde.

## 10.2. Cardinalidad uno a uno (1-1)

En una relación **uno a uno**, cada elemento de una entidad tiene exactamente un elemento de la otra, y viceversa: ni más ni menos. Es la cardinalidad más sencilla de llevar a código, porque el enlace es un valor único.

Este es el diagrama E/R de un alumno con su matrícula única:

```mermaid
erDiagram
    ALUMNO ||--|| MATRICULA : tiene
    ALUMNO {
        int id PK
        string nombre
    }
    MATRICULA {
        string numero PK
        string fecha
    }
```

El equivalente en clases es igual de directo: la clase "uno" guarda dentro un campo del tipo de la otra. Un campo, una matrícula:

```mermaid
classDiagram
    class Alumno {
        +int Id
        +string Nombre
        +Matricula Matricula
    }
    class Matricula {
        +string Numero
        +string Fecha
    }
    Alumno "1" --> "1" Matricula : tiene
```

Y así se ve en C#: el enlace es simplemente un campo más dentro del `struct`.

```csharp
struct Matricula
{
    public string Numero;
    public string Fecha;
}

struct Alumno
{
    public int Id;
    public string Nombre;
    public Matricula Matricula; // el enlace 1-1: cada alumno, SU matrícula
}
```

El enlace se puede poner de dos formas: crear el alumno ya con su matrícula, o crearlo "en pelotas" y asignársela después. Este ejemplo muestra las dos versiones y su consecuencia:

```csharp
// ✅ "Nace completo": el enlace se pone al crear el objeto
Alumno ana = new Alumno
{
    Id = 1,
    Nombre = "Ana",
    Matricula = new Matricula { Numero = "M-1024", Fecha = "12/09/2026" }
};

// ⚠️ "Setter": primero nace sin enlace, después se le pone
Alumno luis = new Alumno { Id = 2, Nombre = "Luis" };
// Aquí luis.Matricula vale default(Matricula): Numero == null
luis.Matricula = new Matricula { Numero = "M-1025", Fecha = "12/09/2026" };
```

> ⚠️ **Advertencia:** Con los `struct`, "olvidar el enlace" **no lanza ningún error**: se crea un valor por defecto (campos `null` y `0`) que parece un dato real. El problema aparece mucho después, cuando alguien intenta usar esa matrícula fantasma.

📌 **Ejemplo real:** En la aplicación de matrícula del centro, cada alumno (1) tiene una matrícula (1). Si el programa crea alumnos sin asignarles matrícula, aparecen "alumnos sin expediente" que no se pueden facturar ni evaluar: un enlace 1-1 olvidado es un registro a medias.

## 10.3. Cardinalidad uno a muchos (1-N)

En una relación **uno a muchos**, un elemento de una entidad se asocia con varios de la otra (cero, uno o muchos), pero cada elemento del lado "muchos" pertenece a uno solo del lado "uno". Aquí empieza lo interesante: el enlace ya no es un valor, es **una colección**.

Este es el diagrama E/R de un aula con sus alumnos:

```mermaid
erDiagram
    AULA ||--o{ ALUMNO : tiene
    AULA {
        string nombre PK
    }
    ALUMNO {
        int id PK
        string nombre
    }
```

El símbolo `o{` significa "cero o muchos": un aula puede tener alumnos o no tener ninguno. El equivalente en clases traduce ese "muchos" a un array dentro de la clase "uno":

```mermaid
classDiagram
    class Aula {
        +string Nombre
        +Alumno[] Alumnos
    }
    class Alumno {
        +int Id
        +string Nombre
    }
    Aula "1" --> "*" Alumno : contiene
```

En C#, cada aula lleva dentro su propio array de alumnos. Fíjate en que el array es el campo que materializa el "muchos" del diagrama:

```csharp
struct Alumno
{
    public int Id;
    public string Nombre;
}

struct Aula
{
    public string Nombre;
    public Alumno[] Alumnos; // el enlace 1-N: un array por cada aula
}
```

Con las dos formas de poner el enlace, el "setter" se complica: hay que acertar con el tamaño del array, y si se olvida, el aula queda sin alumnos de verdad:

```csharp
// ✅ "Nace completo": el aula nace con sus alumnos dentro
Alumno[] clase1 =
{
    new Alumno { Id = 1, Nombre = "Ana" },
    new Alumno { Id = 2, Nombre = "Luis" }
};
Aula aula1 = new Aula { Nombre = "1ºA", Alumnos = clase1 };

// ⚠️ "Setter": se crea el aula y el array se pone después (o no)
Aula aula2 = new Aula { Nombre = "1ºB" };
// aula2.Alumnos == null → quien acceda a aula2.Alumnos[0] estalla
aula2.Alumnos = new Alumno[2]; // array de huecos: todos los Nombre == null
```

Tres problemas típicos viven en el 1-N, y los tres ya los conoces de los apartados anteriores:

- **Nulo olvidado:** sin el `setter`, `aula2.Alumnos` es `null` y el primer acceso lanza `NullReferenceException`.
- **Tamaño fijo:** el array se crea con `new Alumno[2]`; si en octubre entra un tercer alumno, no cabe.
- **Alias:** `Aula copia = aula1;` copia el struct, pero **no** el array: ambas apuntan al mismo sitio y cambiar uno cambia al otro.

> 🔧 **Truco:** Antes de dar por bueno un 1-N, comprueba tres cosas: que el enlace no sea `null`, que el array tenga sitio de sobra y que nadie esté compartiendo el mismo array sin querer.

📌 **Ejemplo real:** En Instagram, cada usuario (1) publica muchas fotos (N). Si la app almacenara las fotos en un array fijo creado al abrir la cuenta, el usuario que sube la foto número 101 se quedaría sin poder publicar: el "muchos" mal dimensionado se rompe en producción, no en el diseño.

## 10.4. Cardinalidad muchos a muchos (N-M)

En una relación **muchos a muchos**, ambos lados tienen "muchos": cada alumno cursa varias asignaturas y cada asignatura tiene varios alumnos. Es la cardinalidad más difícil de las tres, y la que más diseños arruina.

Este es el diagrama E/R de la matrícula de un alumno en asignaturas:

```mermaid
erDiagram
    ALUMNO }o--o{ ASIGNATURA : cursa
    ALUMNO {
        int id PK
        string nombre
    }
    ASIGNATURA {
        int id PK
        string nombre
    }
```

En el papel, la relación N-M es una simple línea con rombos. En el equivalente de clases, en cambio, la relación **no puede vivir dentro de una sola de las dos clases**: hace falta una estructura intermedia que diga quién cursa qué.

```mermaid
classDiagram
    class Alumno {
        +int Id
        +string Nombre
    }
    class Asignatura {
        +int Id
        +string Nombre
    }
    Alumno "1..*" --> "1..*" Asignatura : cursa
```

Esa estructura intermedia se resuelve de dos formas: una **matriz** de booleanos (fila = alumno, columna = asignatura) o un **array de tuplas** que hace de tabla de relación. Este ejemplo muestra las dos opciones:

```csharp
// Opción A: matriz de booleanos — fila = alumno, columna = asignatura
string[] alumnos = { "Ana", "Luis", "María" };
string[] asignaturas = { "Mates", "Lengua" };
bool[,] cursa = new bool[3, 2];

cursa[0, 0] = true; // Ana cursa Mates
cursa[1, 1] = true; // Luis cursa Lengua
cursa[2, 0] = true; // María cursa Mates
```

Y esta es la misma relación como array de tuplas, que es literalmente la tabla intermedia del E/R dibujada con datos:

```csharp
// Opción B: array de tuplas — la "tabla de relación" del E/R
(int IdAlumno, string Asignatura)[] matriculas =
{
    (1, "Mates"),
    (1, "Lengua"),
    (2, "Lengua")
};
```

Los problemas del N-M son los del "muchos" multiplicados por dos: la matriz se dimensiona para el máximo de filas y columnas (sobra hueco y sobran límites), y el array de tuplas tiene capacidad fija: cuando se llena, no entra ni una relación más. Sin colecciones dinámicas, el N-M siempre termina estrellándose contra el tamaño fijo. Ese es precisamente el puente hacia la **UD07**.

> 💡 **Consejo:** Regla práctica para el examen: si la relación tiene "muchos" en **los dos** lados, en el código hará falta una estructura intermedia. En bases de datos será una tabla; aquí, una matriz o un array de tuplas. Un solo campo nunca puede guardar un "muchos a muchos".

📌 **Ejemplo real:** En Spotify, cada usuario sigue a muchos artistas y cada artista tiene muchos seguidores. Esa relación no está ni en la tabla de usuarios ni en la de artistas: vive en una tabla aparte (`seguidores`), justo la tabla intermedia que aquí representas con tuplas.

## 10.5. Navegabilidad de las relaciones: hacia dónde se mira

La **navegabilidad** de una relación es la dirección en la que puedes llegar de un objeto al otro: dónde vive el enlace. En el diagrama de clases se dibuja con la punta de la flecha y en el código se decide con **en qué clase pones el campo**. No es un capricho: de esa dirección depende qué preguntas responde tu programa de un salto y cuáles le cuestan un recorrido entero.

En el 1-N la flecha va del "uno" al "muchos" **porque el campo está en el uno**: `Aula` guarda el array de `Alumno`, así que desde un aula llegas a sus alumnos en un salto; pero desde un alumno **no** hay forma de saber a qué aula pertenece, porque el enlace no vive en él.

```mermaid
classDiagram
    class Aula {
        +string Nombre
        +Alumno[] Alumnos
    }
    class Alumno {
        +int Id
        +string Nombre
    }
    Aula "1" --> "*" Alumno : navega
```

Esta es la navegabilidad de las tres cardinalidades tal como las has diseñado:

| Cardinalidad | Navegación posible | Cómo se consigue |
| :--- | :--- | :--- |
| **1-1** | De la clase que guarda el campo, hacia la otra | Un salto: `alumno.Matricula` |
| **1-N** | Del "uno" al "muchos" | Un salto: `aula.Alumnos[0]` |
| **1-N al revés** | Del "muchos" al "uno" | **Sin enlace**: recorrer todas las aulas o añadir la referencia inversa |
| **N-M** | De cualquier lado al otro | A través de la estructura intermedia (matriz o tuplas) |

¿Y si necesitas navegar al revés? Hay dos caminos:

1. **Búsqueda:** recorrer el lado "uno" hasta encontrar el que contiene al elemento. Funciona, pero es lineal: en el peor caso recorres todo.
2. **Referencia inversa:** añadir en `Alumno` un campo `Aula` con el enlace de vuelta. Navegas en un salto en las dos direcciones... pero introduces **redundancia**: si cambias el aula de un alumno por un lado y olvidas actualizar el otro, los datos se contradicen. Por eso la doble navegabilidad solo se añade si el programa la necesita de verdad.

📌 **Ejemplo real:** En Glovo, desde un `Pedido` llegas a sus líneas de un salto, pero responder "todos los pedidos de este repartidor" exige buscar uno a uno... o guardar en cada repartidor un enlace de vuelta. Elegir entre buscar y redundar es una decisión de diseño, no de código.

> 💡 **Consejo:** Pregunta en el diseño: "¿desde qué lado necesito preguntar?". Si solo se mira en una dirección, el enlace vive ahí y el otro lado no se toca; si se mira en las dos, decide a propósito si pagas la redundancia o la búsqueda.

> 📝 **Nota:** En bases de datos lo haces todo el tiempo con la clave externa: `alumno.aula_id` pone el enlace en el "muchos" y navega del alumno a su aula. Fíjate que ahí la dirección es la contraria a la de este ejemplo: la regla no cambia — **navega quien guarda el enlace** —, cambia dónde decides guardarlo.

## 10.6. ¿Quién pone el enlace? Constructor o setter

El diagrama E/R te dice **qué** relación hay; falta decidir **cuándo** recibe el objeto su enlace. Aquí hay dos candidatos, y elegir mal es el origen de media docena de errores:

- **Constructor:** el código que se ejecuta cuando creas el objeto —lo viste en el punto 6 (`public Aula(string nombre)`)—. En los ejemplos de este punto se usa el inicializador (`new Aula { ... }`), que cumple la misma función al crear.
- **Setter:** la propiedad `set` del punto 7 pone un valor **después** de creado el objeto. En estos ejemplos con `struct` se ve como una asignación normal (`aula.Alumnos = ...`), pero el criterio es el mismo: el `set` puede validar antes de aceptar.

La comparación, con sus problemas incluidos:

| | El enlace se pone... | Ventaja | Problema |
| :--- | :--- | :--- | :--- |
| **Constructor** | Al crear el objeto | Nace completo: nada queda a medias | Hay que saber los datos al crear; si llegan después, hay que recrear el objeto |
| **Setter** | Después, cuando llegan los datos | Completa el objeto cuando tengas la información | Si olvidas llamarlo, queda `null` o `default`: estado a medias |

En la práctica, la elección la dicta la naturaleza del enlace:

```csharp
// ✅ Enlace estable (no cambia nunca): mejor al crear
//    La matrícula de un alumno se asigna una vez y para siempre
Alumno ana = new Alumno
{
    Id = 1,
    Nombre = "Ana",
    Matricula = new Matricula { Numero = "M-1024", Fecha = "12/09/2026" }
};

// ⚠️ Enlace que llega después: setter, pero con comprobación detrás
Aula aula = new Aula { Nombre = "1ºC" };
if (aula.Alumnos == null)
    aula.Alumnos = new Alumno[0]; // nunca lo dejes sin definir
```

Los problemas de cada opción, resumidos para que los tengas claros:

- **Problemas del setter:** nadie te obliga a llamarlo (olvido → `null` silencioso); el objeto pasa por un estado a medias entre que nace y se completa; y quien lo recibe debe usarlo **en el orden correcto** (acoplamiento temporal).
- **Problemas del constructor:** obliga a conocer los datos y los tamaños en el momento de crear; con arrays de tamaño fijo, si los datos llegan después, no puedes crear el objeto "bien" desde el primer momento.

> 📝 **Nota:** La pregunta "¿constructor o setter?" no la resuelve el lenguaje, la resuelve el **diseño**: si el enlace es estable y nace con el objeto, va en el constructor; si puede cambiar o llegar tarde, va en un setter con validación detrás. Ese es el mismo criterio que aplicas después en cada clase, con sus constructores y sus propiedades.

✅ **Buena práctica:** Nunca entregues un objeto a medias: o lo creas completo, o compruebas el enlace (`if (x == null)`) antes de usarlo. Ese hábito evita la mayoría de las `NullReferenceException` de tus programas.

📌 **Ejemplo real:** En Glovo, un pedido nace con su dirección y su importe (constructor), pero el repartidor se le asigna después (setter) cuando alguien lo acepta. Si ningún repartidor lo acepta y nadie comprueba ese "setter", el pedido circula sin repartidor: el estado a medias, en una app real, es un pedazo de pan.

## 10.7. Errores típicos de diseño

Estos son los fallos que aparecen una y otra vez al pasar del diagrama E/R al código, con su arreglo:

| Error | Por qué está mal | Cómo evitarlo |
| :--- | :--- | :--- |
| **No traducir el lado "muchos"** | Tamaños de array improvisados a última hora | Decidir en el diseño el tipo del enlace: valor, array, matriz o tuplas |
| **Crear el objeto sin su enlace** | `null` o `default` silencioso que parece un dato | Crear el objeto completo o comprobar el enlace antes de usarlo |
| **Dimensionar el array "a ojo"** | Un elemento más y `IndexOutOfRangeException` | Dejar margen en el diseño y planear el paso a colecciones (UD07) |
| **Compartir el array entre dos structs** | Alias: cambiar uno cambia al otro sin querer | Clonar el array cuando el enlace deba ser independiente |
| **Modelar un N-M con un solo campo** | Un valor simple no puede guardar "muchos a muchos" | Usar una estructura intermedia: matriz o array de tuplas |
| **Saltarse el diseño en papel** | Codificar a ciegas y rehacer la estructura entera | Seguir el flujo: análisis → diseño → codificación |

---

**Resumen del punto:**

| Concepto | Descripción |
| :--- | :--- |
| **Entidad → `struct` / `class`** | Cada entidad del E/R se convierte en un tipo del código |
| **Atributo → campo / propiedad** | Cada atributo pasa a ser un dato interno del tipo |
| **Cardinalidad → tipo del enlace** | El "uno" es un valor simple; el "muchos" exige una estructura |
| **1-1** | Un campo dentro del struct: cada alumno, su matrícula |
| **1-N** | Un array dentro del struct: cada aula, sus alumnos |
| **N-M** | Estructura intermedia: matriz de booleanos o array de tuplas |
| **Navegabilidad** | Dirección en la que vive el enlace: quien guarda el campo es quien navega |
| **La cardinalidad "muchos"** | Condiciona todo el diseño y choca con el tamaño fijo de los arrays |
| **Constructor** | El enlace se pone al crear: el objeto nace completo |
| **Setter** | El enlace se pone después: riesgo de olvido y de estado a medias |
| **Aliasing** | Dos structs compartiendo el mismo array: cambiar uno cambia al otro |

## ¿Qué viene después?

En el siguiente punto veremos los **patrones básicos de diseño**: soluciones probadas a problemas recurrentes como Singleton, Builder, Lazy o Fachada. Encaja perfectamente con lo visto aquí: si en este punto has decidido *qué* relaciones tiene tu modelo y *cómo* se ponen sus enlaces, los patrones son las decisiones de diseño que se repiten en todos los proyectos.

## Buenas prácticas

- [ ] Dibujar siempre el diagrama E/R antes de escribir la primera línea de código
- [ ] Traducir cada entidad a un tipo y cada atributo a un campo, sin inventarse nada
- [ ] Revisar el lado "muchos" de cada relación antes de programar: ¿cuántos caben?
- [ ] Decidir en el diseño si el enlace va en el constructor o en el setter
- [ ] Nunca dejar un objeto a medias: crearlo completo o comprobar el enlace antes de usarlo
- [ ] Comprobar `null` antes de recorrer cualquier array que llegue de un enlace
- [ ] Clonar el array cuando dos objetos no deban compartir los mismos datos
