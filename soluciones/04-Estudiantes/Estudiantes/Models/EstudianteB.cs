namespace Models;

public class EstudianteB {
    private string _nombre = string.Empty;
    private int _edad;
    private decimal _calificacion;
    
    // Getter and Setters
    public string GetNombre() => _nombre;

    public int GetEdad() => _edad;
    
    public decimal GetCalificacion() => _calificacion; 
    
    public void SetNombre(string nombre) {
        _nombre = nombre;
    }
    
    public void SetEdad(int edad) {
        if(edad < 0) {
            throw new ArgumentException("La edad no puede ser negativa.");
        }
        _edad = edad;
    }
    
    public void SetCalificacion(decimal calificacion) {
        if(calificacion < 0 || calificacion > 10) {
            throw new ArgumentException("La calificación debe estar entre 0 y 10.");
        }
        _calificacion = calificacion;
    }
    
    public int Estudiar(int numHoras) {
        return numHoras * 2;
    }

    public void Animar(string mensaje) {
        Console.WriteLine(mensaje);
    }
}