namespace Models;

public class EstudianteA {
    public string Nombre = string.Empty;
    public int Edad;
    public decimal Calificacion;
    
    public int Estudiar(int numHoras) {
        return numHoras * 2;
    }

    public void Animar(string mensaje) {
        Console.WriteLine(mensaje);
    }
}