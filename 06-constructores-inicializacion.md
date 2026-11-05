- [6. Constructores e inicialización](#6-constructores-e-inicialización)
  - [6.1. Propósito de un constructor](#61-propósito-de-un-constructor)
  - [6.2. Constructor por defecto](#62-constructor-por-defecto)
  - [6.3. Constructores parametrizados](#63-constructores-parametrizados)
  - [6.4. Sobrecarga de constructores](#64-sobrecarga-de-constructores)
  - [6.5. Encadenamiento de constructores con this(...)](#65-encadenamiento-de-constructores-con-this)
  - [6.6. Constructor estático](#66-constructor-estático)
  - [6.7. Constructores privados](#67-constructores-privados)
  - [6.8. Constructor de copia](#68-constructor-de-copia)
  - [6.9. Parámetros opcionales, named arguments y params](#69-parámetros-opcionales-named-arguments-y-params)
  - [6.10. Inicialización de campos readonly](#610-inicialización-de-campos-readonly)
  - [6.11. Constructores en structs y records](#611-constructores-en-structs-y-records)
  - [6.12. Manejo de errores en constructores](#612-manejo-de-errores-en-constructores)
  - [6.13. Constructores primarios y secundarios (C# 12+)](#613-constructores-primarios-y-secundarios-c-12)



# 6. Constructores e inicialización

> 💡 **Punto de partida:** Cuando compras un móvil nuevo, de fábrica ya viene configurado: idioma, hora, cuentas de ejemplo. Si te lo entregaran "en blanco y roto", no serviría de nada. Los objetos también: un constructor es el "ritual de bienvenida" que garantiza que cada objeto nace con sus datos correctos y listo para usar.

En este punto aprenderás qué son los constructores, sus distintos tipos (por defecto, parametrizados, estáticos, privados, de copia), cómo validar datos desde el primer instante y a usar los constructores primarios de C# 12+.

**Objetivos de aprendizaje:**

- Explicar la función de un constructor y diferenciarlo de un método normal
- Usar constructores por defecto, parametrizados y la sobrecarga con `this(...)`
- Aplicar constructores estáticos, privados y de copia en sus contextos
- Validar argumentos lanzando excepciones para no crear objetos inválidos
- Emplear parámetros opcionales, argumentos con nombre y constructores primarios

## 6.1. Propósito de un constructor

Un **constructor** es el método especial que se llama al crear un objeto y que establece su estado inicial. En el fondo es una función con el mismo nombre que la clase, **sin tipo de retorno** (ni siquiera `void`), encargada de preparar el objeto para su uso.

Los constructores te obligan a definir el estado inicial de cada objeto, asegurando que todos empiecen bien configurados: nadie puede crear un `CuentaBancaria` sin saldo, ni un `Pedido` sin cliente.

```mermaid
graph LR
    N["new Animal('Rex')"] --> C["Constructor<br/>Animal(string)"]
    C --> O["Objeto listo<br/>estado inicial correcto"]
    style N fill:#2196F3,color:#fff
    style C fill:#FF9800,color:#fff
    style O fill:#4CAF50,color:#fff
```

📌 **Ejemplo real:** Cuando Instagram crea tu cuenta, no te deja existir "a medias": el proceso de registro garantiza que haya nombre, usuario y correo desde el primer segundo. Eso es lo que hace un constructor por tu cuenta.

## 6.2. Constructor por defecto

Si no defines ningún constructor, C# crea uno sin parámetros que inicializa los atributos a sus valores por defecto (`null` para las referencias, `0` para los números, `false` para los booleanos).

Este es un ejemplo de clase sin constructores explícitos:

```csharp
public class Animal
{
    public string Nombre { get; set; } = string.Empty; // "" por defecto (no null)
    public int Edad { get; set; }                       // 0 por defecto
}

var perro = new Animal(); // usa el constructor por defecto
```

> ⚠️ **Advertencia:** En cuanto defines **un** constructor cualquiera, C# deja de ofrecer el por defecto: si luego escribes `new Animal()` sin parámetros, recibirás un error de compilación. Tendrás que definirlo tú si lo necesitas.

## 6.3. Constructores parametrizados

Los constructores parametrizados permiten pasar información para personalizar el estado al crear el objeto. Así no hay que rellenar los datos a posteriori, campo a campo.

```csharp
public class Animal
{
    public string Nombre { get; set; } = string.Empty;
    public int Edad { get; set; }

    public Animal(string nombre)
    {
        Nombre = nombre;
    }
}

var perro = new Animal("Rex"); // nace con nombre ya puesto
```

📌 **Ejemplo real:** En una app de reservas, crear un `Hotel` sin ciudad ni categoría no tiene sentido; por eso su constructor recibe esos datos obligatorios y el resto de la app puede confiar en que siempre estarán.

## 6.4. Sobrecarga de constructores

Puedes definir varios constructores para permitir distintos modos de inicialización. Con la **sobrecarga**, cada constructor tiene una firma diferente (número o tipo de parámetros). De esta forma puedes crear objetos con diferentes niveles de detalle.

```csharp
public class Animal
{
    public string Nombre { get; set; } = string.Empty;
    public int Edad { get; set; }

    // Si nos pasan solo el nombre, la edad será 0 por defecto
    public Animal(string nombre) : this(nombre, 0) { }

    // Constructor principal (el más completo)
    public Animal(string nombre, int edad)
    {
        Nombre = nombre;
        Edad = edad;
    }
}

var perro = new Animal("Rex");        // edad 0
var gato = new Animal("Miau", 3);     // edad 3
```

> 💡 **Consejo:** Usa `this(...)` para que la sobrecarga **delegue** en el constructor más completo, en vez de repetir el mismo código en cada uno. Así solo hay una fuente de verdad.

## 6.5. Encadenamiento de constructores con this(...)

El encadenamiento reutiliza lógica y evita errores, como has visto en el ejemplo anterior. Aquí la versión completa con un `Libro`:

```csharp
public class Libro
{
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public int Paginas { get; set; }

    // Constructor secundario: delega en el principal
    public Libro(string titulo) : this(titulo, "Desconocido", 0) { }

    // Constructor principal
    public Libro(string titulo, string autor, int paginas)
    {
        Titulo = titulo;
        Autor = autor;
        Paginas = paginas;
    }
}

var libro1 = new Libro("1984");                        // Autor="Desconocido", Paginas=0
var libro2 = new Libro("1984", "Orwell", 328);         // todo completo
```

📌 **Ejemplo real:** Los formularios de compra online suelen tener "envío estándar" por defecto y "envío exprés" opcional: el segundo construye el pedido completo y el primero delega en él poniendo los valores por defecto. Mismo patrón.

## 6.6. Constructor estático

Un constructor **`static`** se ejecuta una sola vez, antes de que se use la clase por primera vez, para inicializar datos compartidos por todas sus instancias.

```csharp
public class Configuracion
{
    public static string RutaConfig { get; set; } = string.Empty;

    static Configuracion()
    {
        RutaConfig = "/etc/config"; // se ejecuta una única vez
    }
}
```

> 📝 **Nota:** Un constructor estático no tiene parámetros y no puede ser `public`: solo prepara lo que es **de la clase** (datos estáticos), no lo de cada objeto. Lo verás con más detalle en el punto 7, junto a los miembros estáticos.

## 6.7. Constructores privados

Los constructores **`private`** sirven para controlar cómo se instancian los objetos: nadie desde fuera puede hacer `new`, solo la propia clase decide cuántos y cuándo. Es la base de patrones como el **singleton** (una única instancia) o las fábricas.

```csharp
public class Singleton
{
    private static Singleton? _instancia;

    private Singleton() { } // nadie puede crearlo desde fuera

    public static Singleton ObtenerInstancia()
    {
        // Lazy: se crea solo si hace falta (y solo una vez)
        _instancia ??= new Singleton();
        return _instancia;
    }
}
```

📌 **Ejemplo real:** Tu app tiene un único gestor de conexión a la base de datos o un único reloj de sistema: si cada módulo pudiera crear el suyo, tendrías diez conexiones abiertas sin querer. El constructor privado impide ese desastre.

## 6.8. Constructor de copia

El **constructor de copia** crea una nueva instancia **copiando el estado** de otro objeto, lo que permite duplicar objetos sin compartir la referencia entre ambos.

```csharp
public class Punto
{
    public int X { get; set; }
    public int Y { get; set; }

    // Constructor de copia
    public Punto(Punto otro)
    {
        X = otro.X;
        Y = otro.Y;
    }
}

var p1 = new Punto { X = 5, Y = 10 };
var p2 = new Punto(p1); // p2 es una COPIA: p2.X = 5, p2.Y = 10

p2.X = 99;
Console.WriteLine(p1.X); // 5: p1 no se entera del cambio
```

> ⚠️ **Advertencia:** No confundas copia con referencia: `var p3 = p1` hace que apunten al **mismo** objeto; `var p3 = new Punto(p1)` crea uno **nuevo y separado**. Es la misma distinción del punto anterior.

## 6.9. Parámetros opcionales, named arguments y params

Puedes facilitar distintos modos de uso con parámetros por defecto y argumentos con nombre, igual que en los métodos normales.

```csharp
public class Rectangulo
{
    public int Alto { get; set; }
    public int Ancho { get; set; }

    public Rectangulo(int alto = 10, int ancho = 5)
    {
        Alto = alto;
        Ancho = ancho;
    }
}

var r1 = new Rectangulo();              // alto=10, ancho=5
var r2 = new Rectangulo(ancho: 15);     // alto=10, ancho=15 (argumento con nombre)
var r3 = new Rectangulo(20);            // alto=20, ancho=5
```

📌 **Ejemplo real:** Un constructor de `Usuario` con `rol = "cliente"` por defecto deja que la mayoría de registros no tengan que pensarlo, mientras que un administrador lo indica explícitamente con `rol: "admin"`.

## 6.10. Inicialización de campos readonly

Los campos **`readonly`** pueden fijarse solo una vez: en la declaración o dentro del constructor. Ayudan a crear objetos inmutables que no se pueden modificar después de ser creados.

```csharp
public class Circulo
{
    public readonly double Radio;

    public Circulo(double radio)
    {
        Radio = radio;
    }
}

var c = new Circulo(5.0);
// c.Radio = 10.0; // ERROR de compilación: no se puede modificar después
```

> 💡 **Truco:** `readonly` es tu forma de decir "este dato no cambia jamás" sin necesidad de propiedades complejas. Si alguien intenta tocarlo fuera del constructor, el compilador lo para antes de ejecutar nada.

## 6.11. Constructores en structs y records

Cada tipo tiene sus particularidades:

- **Structs:** debes inicializar **todos** los campos en el constructor; si no defines ninguno, existe uno por defecto que los pone a cero.
- **Records:** suelen tener constructores posicionales (`record Persona(string Nombre, int Edad)`) y soportan la inicialización con `with` para crear copias modificadas.

```csharp
// Record con constructor positional
record Persona(string Nombre, int Edad);

var ana = new Persona("Ana", 30);
var ana2 = ana with { Edad = 31 }; // copia con un cambio
```

📌 **Ejemplo real:** Los `record` son ideales para datos inmutables como líneas de factura: `linea with { Cantidad = 2 }` te devuelve una línea nueva sin tocar la original.

## 6.12. Manejo de errores en constructores

Lanza excepciones si los argumentos son inválidos, para asegurar objetos consistentes desde el principio: mejor un error en el `new` que un objeto roto escondido por el programa.

```csharp
public class CuentaBancaria
{
    public decimal Saldo { get; private set; }

    public CuentaBancaria(decimal saldoInicial)
    {
        if (saldoInicial < 0)
            throw new ArgumentException("El saldo inicial no puede ser negativo.");
        Saldo = saldoInicial;
    }
}

var cuenta = new CuentaBancaria(-100); // lanza ArgumentException
```

📌 **Ejemplo real:** Cuando una app de banca online te rechaza un alta con datos incorrectos en el primer paso, es el constructor (o su validación equivalente) el que se niega a crear un objeto inválido. Es preferible que falle ahí a que el problema aparezca tres pantallas después.

> 📝 **Nota:** Las excepciones y sus tipos (`ArgumentException`, `NullReferenceException`...) las estudiaremos en el punto 11.

## 6.13. Constructores primarios y secundarios (C# 12+)

Los **constructores primarios** permiten definir parámetros directamente en la declaración de la clase, simplificando la sintaxis para clases simples. Están disponibles desde C# 12.

```csharp
public class Persona(string nombre, int edad)
{
    public string Nombre { get; } = nombre;
    public int Edad { get; } = edad;
}

var p = new Persona("Ana", 30);
```

Esta forma es ideal para la **inyección de dependencias** y para simplificar clases con campos `readonly`, como este servicio de correo:

```csharp
public class ServicioCorreo(string servidorSmtp, int puerto)
{
    private readonly string _servidorSmtp = servidorSmtp;
    private readonly int _puerto = puerto;

    public void EnviarCorreo(string destinatario, string asunto, string cuerpo)
    {
        // Lógica para enviar el correo usando _servidorSmtp y _puerto
    }
}
```

Los constructores secundarios pueden seguir definiéndose como antes, y pueden llamar al constructor primario usando `this(...)`:

```csharp
public class Producto(string nombre, decimal precio)
{
    public string Nombre { get; } = nombre;
    public decimal Precio { get; } = precio;

    // Constructor secundario: precio por defecto 0
    public Producto(string nombre) : this(nombre, 0.0m) { }
}
```

> 💡 **Consejo:** En este ciclo usamos el constructor primario con **inyección de dependencias** en los servicios (como el patrón de la TiendaDawApi): los parámetros del constructor son las dependencias que la clase necesita para funcionar.

---

**Resumen del punto:**

| Concepto | Descripción |
| :--- | :--- |
| **Constructor** | Método especial que inicializa el objeto al crearlo; sin tipo de retorno |
| **Por defecto** | El sin parámetros que pone valores por defecto; desaparece si defines otro |
| **Parametrizado** | Recibe datos obligatorios para que el objeto nazca completo |
| **Sobrecarga** | Varios constructores con firmas distintas; delegan con `this(...)` |
| **Estático** | Se ejecuta una vez para inicializar datos de la clase |
| **Privado** | Controla la creación: singleton y fábricas |
| **Copia** | Duplica el estado de otro objeto sin compartir referencia |
| **`readonly`** | Campo fijable solo en la declaración o el constructor |
| **Validación** | Lanzar excepciones si los argumentos no son válidos |
| **Primario (C# 12+)** | Parámetros en la declaración de la clase; ideal para DI |

## ¿Qué viene después?

En el siguiente punto veremos la encapsulación en profundidad: propiedades completas, miembros estáticos y cómo proteger el estado de tus objetos.

## Buenas prácticas

- [ ] Hacer los constructores simples: delega los procesos largos en métodos o fábricas
- [ ] Mantener siempre los invariantes del objeto (nunca dejarlo en un estado inválido)
- [ ] Usar excepciones para validar argumentos desde el primer momento
- [ ] Preferir constructores parametrizados a rellenar setters después de crear el objeto
- [ ] Usar parámetros con valores por defecto para evitar sobrecargas innecesarias
- [ ] Empezar por constructores primarios y `with` en lugar de montones de constructores secundarios
