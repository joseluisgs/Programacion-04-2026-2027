// Para importar o usar 
// código que está en namespace usamos using

using UsingAlias.SctructsA;

// si tenemos dos clases iguales
// en distintos namespace, para trabajar con
// ambas a la vez usamos los Alias
using A = UsingAlias.Classes;
using B = UsingAlias.ClassesB;

Console.WriteLine("Hello, World!");

var s1 = new MyStruct();
var c1 = new A.MyClaseA();
var c2 = new B.MyClaseA();
var o = new B.Otro();