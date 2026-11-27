using Models;

var e1 = new EstudianteA();
e1.Nombre = "Juan";
e1.Edad = 20;
e1.Calificacion = 8.5m;

Console.WriteLine($"Nombre: {e1.Nombre}, Edad: {e1.Edad}, Calificación: {e1.Calificacion}");

var horasEstudiadas = e1.Estudiar(5);
Console.WriteLine($"Horas estudiadas: {horasEstudiadas}");

e1.Animar("¡Vamos a estudiar!");

// Problemas, estados inconsistente
e1.Edad = -10;
e1.Calificacion = -10;


var e2 = new EstudianteB();
e2.SetNombre("Juan");
e2.SetEdad(20);
e2.SetCalificacion(8.5m);

Console.WriteLine($"Nombre: {e2.GetNombre()}, Edad: {e2.GetEdad()}, Calificación: {e2.GetCalificacion()}");

horasEstudiadas = e2.Estudiar(5);
Console.WriteLine($"Horas estudiadas: {horasEstudiadas}");

e2.Animar("¡Vamos a estudiar!");

// Problemas, estados inconsistente
try {
    e2.SetCalificacion(-1);
}
catch (ArgumentException ex) {
    Console.Error.WriteLine("ERROR: " + ex.Message);
}


var e3 = new EstudianteC();
e3.Nombre = "Juan";
e3.Edad = 20;
e3.Calificacion = 8.5m;

Console.WriteLine($"Nombre: {e3.Nombre}, Edad: {e3.Edad}, Calificación: {e3.Calificacion}");

horasEstudiadas = e1.Estudiar(5);
Console.WriteLine($"Horas estudiadas: {horasEstudiadas}");

e3.Animar("¡Vamos a estudiar!");

// Problemas, estados inconsistente
try {
    e3.Calificacion = -1;
}
catch (ArgumentException ex) {
    Console.Error.WriteLine("ERROR: " + ex.Message);
}

// ToString
Console.WriteLine(e3);

var e4 = new EstudianteC {
    Nombre = "Juan",
    Edad = 20,
    Calificacion = 8.5m
};
Console.WriteLine(e4);

// ojo que comparamos referencias, no estado
if (e3 == e4)
    Console.WriteLine("e3 y e4 son iguales");
else
    Console.WriteLine("e3 y e4 son diferentes");

Console.WriteLine(e3.GetHashCode());
Console.WriteLine(e4.GetHashCode());

// Dos objetos son iuales si tiene el mismo hasCode
if (e3.GetHashCode() == e4.GetHashCode())
    Console.WriteLine("e3 y e4 tienen el mismo hash code");
else
    Console.WriteLine("e3 y e4 tienen diferente hash code");

// Dos objetos son iguales si Equals es true
if (e3.Equals(e4))
    Console.WriteLine("e3 y e4 son iguales");
else
    Console.WriteLine("e3 y e4 son diferentes");