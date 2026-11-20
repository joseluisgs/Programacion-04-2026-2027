namespace Gato.Models;

public class GatitoA {
    // Atributos (estado)
    // Ponerlo todo publico es un error, porque pueden 
    // Dejar el estado inconsistente
    public string Nombre = string.Empty;
    public int Edad = 0;
    public double Peso = 0.0; // Pero es solo de lectura, como lo hago

    // Método (comportamiento)
    public void Maullar() {
        Console.WriteLine($"{Nombre} está maullando.");
        Console.WriteLine($"Edad: {Edad} años.");
    }

    public int NumeroDeBostezos() {
        return new Random().Next(1, 10);
    }
}