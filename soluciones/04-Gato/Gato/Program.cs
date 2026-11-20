using Gato.Models;

var g1= new GatitoA();
g1.Nombre = "Michi";
g1.Edad = -1;
g1.Maullar();
Console.WriteLine($"Nombre: {g1.Nombre}, Edad: {g1.Edad}");
Console.WriteLine($"Número de bostezos: {g1.NumeroDeBostezos()}");

Console.WriteLine("--------------------------------------------------");


var g2= new GatitoB();
g2.SetNombre("Pelusa");
// g2.Edad = -1; ya nadie lo toca
g2.SetEdad(-1);
g2.Maullar();
Console.WriteLine($"Nombre: {g2.GetNombre()}, Edad: {g2.GetEdad()}");
Console.WriteLine($"Número de bostezos: {g2.NumeroDeBostezos()}");


Console.WriteLine("--------------------------------------------------");

var g3= new GatitoC();
// g3.Edad = -1; ya nadie lo toca
g3.Nombre = "Firulais";
g3.Edad = -1;
g3.Maullar();
Console.WriteLine($"Nombre: {g3.Nombre}, Edad: {g3.Edad}");
Console.WriteLine($"Número de bostezos: {g3.NumeroDeBostezos()}");


Console.WriteLine("--------------------------------------------------");

// Podemos crearlo e inicializarlo de una vez
var g4 = new GatitoC {
    Nombre = "Peludito",
    Edad = 2
};
g4.Maullar();
Console.WriteLine($"Nombre: {g4.Nombre}, Edad: {g4.Edad}");
Console.WriteLine($"Número de bostezos: {g4.NumeroDeBostezos()}");

Console.WriteLine("--------------------------------------------------");

GatitoC? g5 = null;

// Opción 1: comprobación explícita
if (g5 is not null)
{
    Console.WriteLine(g5.Nombre); // evita NullReferenceException
}
else
{
    Console.WriteLine("El gato es nulo.");
}

// Opción 2: acceso seguro con ?. (si es null, no falla: devuelve null)
Console.WriteLine(g5?.Nombre ?? "Sin nombre");
 
