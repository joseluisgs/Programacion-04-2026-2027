namespace Gato.Models;

public class GatitoB
{
    // Atributos (estado)
    // Siempre privados
    private string _nombre = string.Empty;
    private int _edad = 0;
    private double _peso = 0.0;
    
    
    // Creamos los metodos getters y setters
    public string GetNombre() => _nombre;
    public int GetEdad() => _edad;
    public double GetPeso() => _peso;

    public void SetNombre(string nombre) => _nombre = nombre;
    public void SetEdad(int edad)
    {
        if (edad < 0)
        {
            Console.WriteLine("La edad no puede ser negativa.");
            _edad = 0;
            return;
        }
        _edad = edad;
    }
    // Método (comportamiento)
    public void Maullar()
    {
        Console.WriteLine($"{_nombre} está maullando.");
        Console.WriteLine($"Edad: {_edad} años.");
    }
    
    public int NumeroDeBostezos() {
        return new Random().Next(1, 10);
    }
}