// import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    actualizarCantidadItem,
    confirmarCompra,
    eliminarItemCarrito,
    obtenerResumenCarrito,
} from '../services/carritoService.js';

function Carrito() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarCarrito = async () => {
        try {
            setError('');
            const resumen = await obtenerResumenCarrito();
            setItems(resumen.items);
        } catch (err) {
            setError(err.response?.data?.mensaje || err.message || 'No se pudo cargar el carrito.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCarrito();
    }, []);

    const cambiarCantidad = async (item, cantidad) => {
        if (!Number.isInteger(cantidad) || cantidad < 1) return;

        try {
            setError('');
            await actualizarCantidadItem(item.id, cantidad);
            await cargarCarrito();
        } catch (err) {
            setError(err.response?.data?.mensaje || err.message || 'No se pudo actualizar la cantidad.');
        }
    };

    const eliminar = async (idItem) => {
        try {
            setError('');
            await eliminarItemCarrito(idItem);
            await cargarCarrito();
        } catch (err) {
            setError(err.response?.data?.mensaje || err.message || 'No se pudo quitar el item.');
        }
    };

    const reservar = async () => {
        try {
            setProcesando(true);
            setError('');
            const compra = await confirmarCompra();
            setMensaje(`Reserva confirmada. Número de compra: ${compra.id}.`);
            setItems([]);
        } catch (err) {
            setError(err.response?.data?.mensaje || err.message || 'No se pudo confirmar la reserva.');
        } finally {
            setProcesando(false);
        }
    };

    const total = items.reduce((acumulado, item) => (
        acumulado + Number(item.subtotal)
    ), 0);

    if (cargando) {
        return <p className="text-slate-500">Cargando carrito...</p>;
    }

    return (
        <section className="space-y-8">
            <header>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Tu reserva</p>
                <h1 className="mt-8 text-3xl font-black text-slate-900 sm:text-4xl">Carrito</h1>
                <p className="mt-3 text-slate-600">Revisá las personas antes de confirmar la reserva.</p>
            </header>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
            {mensaje && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">{mensaje}</div>}

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="font-semibold text-slate-800">Tu carrito está vacío.</p>
                    <Link to="/excursiones" className="mt-4 inline-block font-semibold text-orange-600 hover:text-orange-700">
                        Ver excursiones
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{item.excursion?.nombre || 'Excursión'}</h2>
                                    <p className="mt-1 text-sm text-slate-500">${item.excursion?.precio} por persona</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-slate-600" htmlFor={`item-${item.id}`}>Personas</label>
                                    <input
                                        id={`item-${item.id}`}
                                        type="number"
                                        min="1"
                                        max={item.excursion?.cupos || undefined}
                                        value={item.cantidad}
                                        onChange={(event) => cambiarCantidad(item, Number(event.target.value))}
                                        className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                                    />
                                    <strong className="min-w-24 text-right text-slate-900">${Number(item.subtotal).toFixed(2)}</strong>
                                    <button type="button" onClick={() => eliminar(item.id)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                                        Quitar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-slate-900">Resumen</h2>
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="text-slate-600">Total</span>
                            <strong className="text-2xl text-slate-900">${total.toFixed(2)}</strong>
                        </div>
                        <button
                            type="button"
                            onClick={reservar}
                            disabled={procesando}
                            className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {procesando ? 'Confirmando...' : 'Confirmar reserva'}
                        </button>
                    </aside>
                </div>
            )}

            <button type="button" onClick={() => navigate('/excursiones')} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Volver a excursiones
            </button>
        </section>
    );
}

export default Carrito;
