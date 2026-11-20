using Calculadora.Services;

Console.WriteLine("Hola Calculadora");

Calculator calc = new Calculator();

int res = calc.Sumar(5, 3);
Console.WriteLine($"Resultado de la suma: {res}");

res = calc.Restar(5,3);
Console.WriteLine($"Resultado de la resta: {res}");

res = calc.Multiplicar(5,3);
Console.WriteLine($"Resultado de la multiplicación: {res}");

Console.WriteLine($"Ultimo Resultado: {calc.UltimoResultado}");

res = calc.Dividir(calc.UltimoResultado,3);
Console.WriteLine($"Resultado de la división: {res}");

res = calc.Modulo(5,3);
Console.WriteLine($"Resultado del módulo: {res}");

res = calc.Operacionesrealizadas();
Console.WriteLine($"Operaciones realizadas: {res}");

res = calc.OperacionesRealizadasPropiedad;
Console.WriteLine($"Operaciones realizadas (propiedad): {res}");