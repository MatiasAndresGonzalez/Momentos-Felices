import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarFavoritos, quitarFavorito } from '../services/favoritosService.js';

function obtenerUrlImagen(imagen) {
    if (typeof imagen === 'string') return imagen;
    return imagen?.url || '';
}

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [eliminando, setEliminando] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let activo = true;

        listarFavoritos()
            .then((data) => {
                if (activo) setFavoritos(data);
            })
            .catch((err) => {
                if (activo) {
                    setError(err.response?.data?.mensaje || 'No se pudieron cargar tus favoritos.');
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, []);

    const quitar = async (idExcursion) => {
        setEliminando(idExcursion);
        setError('');

        try {
            await quitarFavorito(idExcursion);
            setFavoritos((actuales) => actuales.filter(
                (favorito) => favorito.excursion?.id !== idExcursion
            ));
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo quitar de favoritos.');
        } finally {
            setEliminando(null);
        }
    };

    return (
        <section className="space-y-8">
            <header>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Tu colección
                </p>
                <h1 className="mt-8 text-3xl font-black text-slate-900 sm:text-4xl">
                    Mis favoritos
                </h1>
            </header>

            {cargando && <p className="text-slate-500">Cargando favoritos...</p>}

            {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {!cargando && !error && favoritos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="font-semibold text-slate-800">Todavía no guardaste excursiones.</p>
                    <Link to="/excursiones" className="mt-4 inline-block font-semibold text-orange-600 hover:text-orange-700">
                        Explorar excursiones
                    </Link>
                </div>
            )}

            {!cargando && favoritos.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favoritos.filter((favorito) => favorito.excursion).map((favorito) => {
                        const excursion = favorito.excursion;
                        const imagen = obtenerUrlImagen(excursion.imagen);

                        return (
                            <article key={favorito.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                {imagen ? (
                                    <img src={imagen} alt={excursion.nombre} className="h-52 w-full object-cover" />
                                ) : (
                                    <div className="flex h-52 items-center justify-center bg-slate-200 text-slate-500">
                                        Sin imagen
                                    </div>
                                )}
                                <div className="space-y-4 p-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{excursion.nombre}</h2>
                                        <p className="mt-1 text-sm text-orange-600">{excursion.ubicacion}</p>
                                    </div>
                                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">{excursion.descripcion}</p>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                                        <span className="font-semibold text-slate-900">${excursion.precio}</span>
                                        <span className="text-slate-500">{excursion.duracion || 'Duración a confirmar'}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => quitar(excursion.id)}
                                        disabled={eliminando === excursion.id}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
                                    >
                                        {eliminando === excursion.id ? 'Quitando...' : 'Quitar de favoritos'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Favoritos;