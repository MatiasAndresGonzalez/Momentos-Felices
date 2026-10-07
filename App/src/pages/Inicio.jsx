// Inicio.jsx
// Página principal de Descubre Córdoba.
//
// Tiene un hero con carrusel automático de imágenes.
// No necesita backend.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import cordoba1 from '../assets/img/cordoba1.png';
import cordoba2 from '../assets/img/cordoba2.png';
import cordoba3 from '../assets/img/cordoba3.png';

// Declaramos las imágenes fuera del componente.
// Así el array no se vuelve a crear en cada render.
const imagenes = [
  cordoba1,
  cordoba2,
  cordoba3,
];

function Inicio() {
  // Guarda cuál imagen está visible.
  const [indiceActual, setIndiceActual] = useState(0);

  // Cambia automáticamente de imagen cada 5 segundos.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((indiceAnterior) => {
        // Si estamos en la última imagen,
        // volvemos a la primera.
        if (indiceAnterior === imagenes.length - 1) {
          return 0;
        }

        // Si no, avanzamos una.
        return indiceAnterior + 1;
      });
    }, 5000);

    // Limpiamos el intervalo cuando se desmonta el componente.
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* =====================================================
          IMAGEN DE FONDO
      ====================================================== */}
      <div className="absolute inset-0">

        <img
          src={imagenes[indiceActual]}
          alt="Paisaje de Córdoba"
          className="h-full w-full object-cover"
        />

        {/* Overlay oscuro para mejorar la lectura del texto */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/10" />

        {/* Sombra inferior */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />

      </div>


      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-24 pt-28 sm:px-6 lg:px-8">

        <div className="max-w-2xl text-white">

          {/* TEXTO SUPERIOR */}
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-400 sm:text-xs sm:tracking-[0.35em]">
            Naturaleza · aventura · experiencias
          </p>


          {/* TÍTULO PRINCIPAL */}
          <h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">

            VIVÍ LA

            <span className="block text-orange-500">
              AVENTURA
            </span>

          </h1>


          {/* SUBTÍTULO */}
          <p className="mt-5 text-sm uppercase tracking-[0.25em] text-orange-100 sm:text-base lg:text-lg">
            Córdoba te espera
          </p>


          {/* DETALLE VISUAL */}
          <div className="my-5 flex items-center gap-3">

            <div className="h-px w-16 bg-orange-500 sm:w-20" />

            <span className="text-sm text-orange-500">
              ◆
            </span>

            <div className="h-px w-16 bg-orange-500 sm:w-20" />

          </div>


          {/* DESCRIPCIÓN */}
          <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-lg">
            Explorá la naturaleza, viví experiencias inolvidables
            y descubrí rincones únicos de Córdoba.
          </p>


          {/* =================================================
              BOTONES
          ================================================== */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            <Link
              to="/excursiones"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Explorar experiencias
            </Link>

            {/* Va a la página de registro */}
            <Link
              to="/registro"
              className="rounded-xl border border-white/60 bg-black/20 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              Crear mi cuenta
            </Link>

          </div>


          {/* =================================================
              DESTACADOS
          ================================================== */}
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-5 border-t border-white/20 pt-6 sm:grid-cols-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">
                Paisajes
              </p>

              <p className="mt-1 text-sm text-white/70">
                Impactantes
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">
                Experiencias
              </p>

              <p className="mt-1 text-sm text-white/70">
                Auténticas
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">
                Rincones
              </p>

              <p className="mt-1 text-sm text-white/70">
                Únicos
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          INDICADORES DEL CARRUSEL
      ====================================================== */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">

        {imagenes.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Mostrar imagen ${index + 1}`}
            onClick={() => setIndiceActual(index)}
            className={`rounded-full transition-all duration-300 ${
              indiceActual === index
                ? 'h-2.5 w-7 bg-orange-500'
                : 'h-2.5 w-2.5 bg-white/50 hover:bg-white'
            }`}
          />
        ))}

      </div>

    </section>
  );
}

export default Inicio;