namespace Models;

public class EstudianteC {
    public string Nombre { get; set; } = string.Empty;
    
    public int Edad { 
        get; 
        set {
            if(value < 0) {
                throw new ArgumentException("La edad no puede ser negativa.");
            }
            field = value;
        }
    }

    public decimal Calificacion {
        get;
        set {
            if(value < 0 || value > 10) {
                throw new ArgumentException("La calificación debe estar entre 0 y 10.");
            }
            field = value;
        }
    }
    
    public int Estudiar(int numHoras) {
        return numHoras * 2;
    }

    public void Animar(string mensaje) {
        Console.WriteLine(mensaje);
    }

    public override string ToString() {
        return $"Nombre: {Nombre}, Edad: {Edad}, Calificación: {Calificacion}";
    }
    
    public override bool Equals(object? obj) {
        if (obj is EstudianteC other) {
            return Nombre == other.Nombre && Edad == other.Edad && Calificacion == other.Calificacion;
        }
        return false;
    }

    public override int GetHashCode() {
        return HashCode.Combine(Nombre, Edad, Calificacion);
    }
}