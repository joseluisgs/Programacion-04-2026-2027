namespace Gato.Models;

public class GatitoC
{
    // Propiedades = Atributos privados 
    // Con los Getters and Setters incorporados
    public string Nombre { get; set; } = string.Empty;
    public int Edad { 
        get; 
        // La edad no puede ser negativa
        set
        {
            if (value < 0)
            {
                Console.WriteLine("La edad no puede ser negativa.");
                field = 0;
                return;
            }
            field = value;
        }
    } = 0;
    
    public double Peso { get; private set; } = 0.0;
    
   
    // Método (comportamiento)
    public void Maullar()
    {
        Console.WriteLine($"{Nombre} está maullando.");
        Console.WriteLine($"Edad: {Edad} años.");
    }
    
    public int NumeroDeBostezos() {
        return new Random().Next(1, 10);
    }
}