namespace Calculadora.Services;

public class Calculator {
    
    // Estado con propiedades: no se puede escribir
    public int OperacionesRealizadasPropiedad { get; private set; } = 0;
    public int UltimoResultado { get; private set; } = 0;
    
    // Estado como atributo privado y un getter para leerlo
    private int _operacionesrealizadas = 0;
    public int Operacionesrealizadas() {
        return _operacionesrealizadas;
    }
    
    public int Sumar(int a, int b) {
        OperacionesRealizadasPropiedad++;
        _operacionesrealizadas++;
        UltimoResultado = a + b;
        return UltimoResultado;
    }
    
    public int Restar(int a, int b) {
        OperacionesRealizadasPropiedad++;
        _operacionesrealizadas++;
        UltimoResultado = a - b;
        return UltimoResultado;
    }
    
    public int Multiplicar(int a, int b) {
        OperacionesRealizadasPropiedad++;
        _operacionesrealizadas++;
        UltimoResultado = a * b;
        return UltimoResultado;
    }
    
    public int Dividir(int a, int b) {
        if (b == 0) {
            throw new DivideByZeroException("No se puede dividir por cero");
        }
        OperacionesRealizadasPropiedad++;
        _operacionesrealizadas++;
        UltimoResultado = a / b;
        return UltimoResultado;
    }
    
    public int Modulo(int a, int b) {
        if (b == 0) {
            throw new DivideByZeroException("No se puede calcular el módulo con divisor cero");
        }
        OperacionesRealizadasPropiedad++;
        _operacionesrealizadas++;
        UltimoResultado = a % b;
        return UltimoResultado;
    }
}