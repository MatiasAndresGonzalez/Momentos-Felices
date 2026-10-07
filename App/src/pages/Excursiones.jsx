import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarExcursionesPublicas } from '../services/excursionesService.js';
import { agregarAlCarrito } from '../services/carritoService.js';
import { agregarFavorito, listarFavoritos, quitarFavorito } from '../services/favoritosService.js';
import { useAuth } from '../context/AuthContext.jsx';

function obtenerUrlImagen(imagen) {
    if (typeof imagen === 'string') return imagen;
    return imagen?.url || '';
}

function Excursiones() {
    const navigate = useNavigate();
    const { isAuthenticated, usuario } = useAuth();
    const [excursiones, setExcursiones] = useState([]);
    const [favoritos, setFavoritos] = useState(new Set());
    const [favoritosUsuarioId, setFavoritosUsuarioId] = useState(null);
    const [favoritoProcesando, setFavoritoProcesando] = useState(null);
    const [cantidades, setCantidades] = useState({});
    const [agregando, setAgregando] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarExcursiones = async () => {
            try {
                const data = await listarExcursionesPublicas();
                setExcursiones(data);
            } catch (err) {
                setError(err.message || 'No se pudieron cargar las excursiones.');
            } finally {
                setCargando(false);
            }
        };

        cargarExcursiones();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

        let activo = true;
        const idUsuario = usuario?.id;

        listarFavoritos()
            .then((data) => {
                if (activo) {
                    setFavoritos(new Set(data.map((favorito) => favorito.idExcursion)));
                    setFavoritosUsuarioId(idUsuario);
                }
            })
            .catch((err) => {
                if (activo) setMensaje(err.response?.data?.mensaje || 'No se pudieron cargar tus favoritos.');
            })
            ;

        return () => {
            activo = false;
        };
    }, [isAuthenticated, usuario?.id]);

    const esFavorita = (idExcursion) => (
        favoritosUsuarioId === usuario?.id && favoritos.has(idExcursion)
    );

    const alternarFavorito = async (excursion) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const yaEsFavorita = esFavorita(excursion.id);
        setFavoritoProcesando(excursion.id);
        setMensaje('');

        try {
            if (yaEsFavorita) {
                await quitarFavorito(excursion.id);
            } else {
                await agregarFavorito(excursion.id);
            }

            setFavoritos((actuales) => {
                const siguientes = new Set(actuales);
                if (yaEsFavorita) siguientes.delete(excursion.id);
                else siguientes.add(excursion.id);
                return siguientes;
            });
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || 'No se pudo actualizar el favorito.');
        } finally {
            setFavoritoProcesando(null);
        }
    };

    const reservar = async (excursion) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const cantidad = Number(cantidades[excursion.id] || 1);
        setAgregando(excursion.id);
        setMensaje('');

        try {
            await agregarAlCarrito(excursion.id, cantidad);
            setMensaje(`"${excursion.nombre}" se agregó al carrito.`);
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || err.message || 'No se pudo agregar al carrito.');
        } finally {
            setAgregando(null);
        }
    };

    return (
        <section className="space-y-8">
            <header>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Descubre Córdoba
                </p>
                <h1 className="mt-8 text-3xl font-black text-slate-900 sm:text-4xl">
                    Elegí tu próxima experiencia
                </h1>
                <p className="mt-3 max-w-2xl text-slate-600">
                    Explorá excursiones, paisajes y actividades para disfrutar Córdoba.
                </p>
            </header>

            {cargando && <p className="text-slate-500">Cargando excursiones...</p>}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
                    {mensaje}
                </div>
            )}

            {!cargando && !error && excursiones.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="font-semibold text-slate-800">Todavía no hay excursiones disponibles.</p>
                </div>
            )}

            {!cargando && !error && excursiones.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {excursiones.map((excursion) => {
                        const imagen = obtenerUrlImagen(excursion.imagen);

                        return (
                            <article key={excursion.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="relative">
                                    {imagen ? (
                                        <img
                                            src={imagen}
                                            alt={excursion.nombre}
                                            className="h-52 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-52 items-center justify-center bg-slate-200 text-slate-500">
                                            Sin imagen
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => alternarFavorito(excursion)}
                                        disabled={(isAuthenticated && favoritosUsuarioId !== usuario?.id) || favoritoProcesando === excursion.id}
                                        aria-label={esFavorita(excursion.id) ? `Quitar ${excursion.nombre} de favoritos` : `Agregar ${excursion.nombre} a favoritos`}
                                        aria-pressed={esFavorita(excursion.id)}
                                        title={esFavorita(excursion.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-red-600 shadow transition hover:scale-105 disabled:cursor-wait disabled:opacity-60"
                                    >
                                        {esFavorita(excursion.id) ? '♥' : '♡'}
                                    </button>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{excursion.nombre}</h2>
                                        <p className="mt-1 text-sm text-orange-600">{excursion.ubicacion}</p>
                                    </div>
                                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                                        {excursion.descripcion}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                                        <span className="font-semibold text-slate-900">${excursion.precio}</span>
                                        <span className="text-slate-500">{excursion.duracion || 'Duración a confirmar'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm text-slate-600" htmlFor={`cantidad-${excursion.id}`}>
                                            Personas
                                        </label>
                                        <input
                                            id={`cantidad-${excursion.id}`}
                                            type="number"
                                            min="1"
                                            max={excursion.cupos || undefined}
                                            value={cantidades[excursion.id] || 1}
                                            onChange={(event) => setCantidades((actuales) => ({
                                                ...actuales,
                                                [excursion.id]: event.target.value,
                                            }))}
                                            className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => reservar(excursion)}
                                            disabled={agregando === excursion.id || excursion.cupos === 0}
                                            className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            {agregando === excursion.id ? 'Agregando...' : excursion.cupos === 0 ? 'Sin cupos' : 'Reservar'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Excursiones;
