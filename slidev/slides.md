---
theme: default
title: 'UD04 · Programación Orientada a Objetos (POO)'
info: |
  Programación Orientada a Objetos
  Programación · 1DAW · Curso 2026-2027 · IES Luis Vives
  José Luis González Sánchez
author: José Luis González Sánchez
transition: slide-left
colorScheme: auto
lineNumbers: false
layout: cover
class: ud-cover-bg
---

<div class="flex items-center gap-4 w-full">
  <img src="/logo.webp" alt="Logo" class="h-11 rounded-md shadow" />
  <span class="ud-pill">Programación · 1DAW · Curso 2026-2027</span>
</div>

# Programación Orientada a Objetos

### Creando programas organizados en clases y objetos

<div class="mt-10 flex items-end justify-between w-full">
  <div class="text-left">
    <b class="text-lg">José Luis González Sánchez</b><br/>
    <span class="opacity-70">IES Luis Vives · Leganés · <a href="https://joseluisgs.dev">joseluisgs.dev</a></span>
  </div>
  <PacMan :size="54" label="Cargando ideas..." />
</div>

---

## 📦 Materiales de la unidad

Todo el material de la UD04 está publicado en el repositorio de GitHub, organizado por carpetas:

<div class="grid grid-cols-2 gap-6 items-start">
<div>

- 📚 **14 puntos** — teoría, ejemplos reales y resúmenes
- 📝 **Prácticas** — ejercicios graduados en `practicas/`
- 💻 **Soluciones** — programas C# resueltos en `soluciones/`
- 🖼️ **Imágenes y recursos** — diagramas y esquemas en `images/`
- 🎬 **Vídeos** — lista de reproducción en YouTube

</div>
<div class="flex flex-col items-center justify-center gap-4 pt-4">

<RepoBadge caption="Repositorio con materiales de la unidad" />

<div class="text-sm opacity-75 text-center max-w-55">

Clónalo, forquéalo o descárgalo en zip: el material siempre está a un clic.

</div>

</div>
</div>

---

## 📚 Índice: los 14 puntos del tema

<div class="grid grid-cols-5 gap-3 text-sm">

<TopicCard :num="1" title="Conceptos y principios de la POO" desc="Qué es la POO y sus principios" />
<TopicCard :num="2" title="Objetos y clases" desc="Identidad, estado y comportamiento" />
<TopicCard :num="3" title="Espacios de nombres y organización" desc="Namespaces, soluciones y proyectos" />
<TopicCard :num="4" title="Definición de clases y miembros" desc="Propiedades, métodos y visibilidad" />
<TopicCard :num="5" title="Instanciación, referencias e igualdad" desc="new, this, ToString e identidad" />
<TopicCard :num="6" title="Constructores e inicialización" desc="Defecto, sobrecarga y readonly" />
<TopicCard :num="7" title="Encapsulación y propiedades" desc="Getters, setters y miembros estáticos" />
<TopicCard :num="8" title="Enums, structs y records" desc="Tipos de valor propios" />
<TopicCard :num="9" title="Clases anidadas y composición" desc="Clases dentro de clases y relaciones" />
<TopicCard :num="10" title="Diseño orientado a objetos" desc="Del diagrama E/R a las clases" />
<TopicCard :num="11" title="Patrones básicos de diseño" desc="Singleton, factory, builder y fachada" />
<TopicCard :num="12" title="Excepciones en la POO" desc="throw, try/catch y jerarquía" />
<TopicCard :num="13" title="Buenas prácticas" desc="SRP, nomenclatura y documentación" />
<TopicCard :num="14" title="Resumen y conclusiones" desc="Mapa, errores y checklist" />

</div>

<div class="ud-card mt-4 flex items-center justify-between gap-4 px-4 py-2">

<span class="text-sm">📦 <b>Materiales:</b> los 14 puntos, prácticas, soluciones y vídeos de la unidad</span>

<RepoBadge />

</div>

---

## 🎯 Resultados de aprendizaje: RA 2

<RaaCcee
  code="RA 2"
  title="Escribe y prueba programas sencillos, reconociendo y aplicando los fundamentos de la programación orientada a objetos."
  :ccee="[
    'Se han identificado los fundamentos de la programación orientada a objetos.',
    'Se han escrito programas simples.',
    'Se han instanciado objetos a partir de clases predefinidas.',
    'Se han utilizado métodos y propiedades de los objetos.',
    'Se han escrito llamadas a métodos estáticos.',
    'Se han utilizado parámetros en la llamada a métodos.',
    'Se han incorporado y utilizado librerías de objetos.',
    'Se han utilizado constructores.',
    'Se ha utilizado el entorno integrado de desarrollo en la creación y compilación de programas simples.',
  ]"
/>

---

## 🎯 Resultados de aprendizaje: RA 4

<RaaCcee
  code="RA 4"
  title="Desarrolla programas organizados en clases analizando y aplicando los principios de la programación orientada a objetos."
  :ccee="[
    'Se ha reconocido la sintaxis, estructura y componentes típicos de una clase.',
    'Se han definido clases.',
    'Se han definido propiedades y métodos.',
    'Se han creado constructores.',
    'Se han desarrollado programas que instancien y utilicen objetos de las clases creadas anteriormente.',
    'Se han utilizado mecanismos para controlar la visibilidad de las clases y de sus miembros.',
  ]"
/>

---
layout: center
---

<div class="flex flex-col items-center gap-3 w-full text-center">

<PacMan :size="64" />

# ¡Hasta el próximo deploy! <span class="ud-emoji">👋</span>

<b class="text-lg">Tema 04: Programación Orientada a Objetos (POO)</b>

<span class="ud-pill">Programación · 1DAW · Curso 2026-2027</span>

<RepoBadge caption="📚 Materiales, prácticas y soluciones" size="lg" />

<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">

<a class="ud-pill ud-pill-link" href="https://joseluisgs.dev" target="_blank">🌐 joseluisgs.dev</a>
<a class="ud-pill ud-pill-link" href="https://github.com/joseluisgs" target="_blank">🐙 GitHub</a>
<a class="ud-pill ud-pill-link" href="https://www.linkedin.com/in/JoseLuisGSDev" target="_blank">💼 LinkedIn</a>
<a class="ud-pill ud-pill-link" href="https://www.youtube.com/@joseluisgs" target="_blank">🎬 YouTube</a>
<a class="ud-pill ud-pill-link" href="https://x.com/JoseLuisGSDev" target="_blank">🐦 X</a>
<a class="ud-pill ud-pill-link" href="https://www.instagram.com/joseluisgs.dev/" target="_blank">📸 Instagram</a>

</div>

</div>
