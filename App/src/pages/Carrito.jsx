import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { actualizarCantidadItem, confirmarCompra, eliminarItemCarrito, obtenerResumenCarrito } from "../services/carritoService.js";

function Carrito() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargar = () => {
    const resumen = obtenerResumenCarrito();
    setItems(resumen.items);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const cambiarCantidad = (id, cantidad) => {
    if (!Number.isInteger(cantidad) || cantidad < 1) return;
    const resumen = obtenerResumenCarrito();
    const item = resumen.items.find((actual) => actual.id === id);
    const max = Number(item?.producto?.stock || 999999);
    actualizarCantidadItem(id, Math.min(cantidad, max));
    cargar();
  };

  const eliminar = (id) => {
    eliminarItemCarrito(id);
    cargar();
  };

  const confirmar = () => {
    try {
      setProcesando(true);
      setError("");
      const compra = confirmarCompra();
      setMensaje(`Compra confirmada correctamente. Número de compra: ${compra.id}.`);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const total = items.reduce((sum, item) => sum + Number(item.producto?.price || 0) * Number(item.cantidad || 0), 0);

  if (cargando) return <p className="text-slate-500">Cargando carrito...</p>;

  return (
    <section className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-#8B6F47">Tu compra</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Carrito</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Revisá tus productos antes de confirmar la compra.</p>
      </header>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {mensaje && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">{mensaje}</div>}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold text-slate-800 dark:text-white">Tu carrito está vacío.</p>
          <Link to="/productos" className="mt-4 inline-block font-semibold text-#765C39">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-4">
            {items.map((item) => {
              const producto = item.producto;
              const subtotal = Number(producto?.price || 0) * Number(item.cantidad || 0);
              return (
                <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {producto?.image ? <img src={producto.image} alt={producto.name} className="h-20 w-20 rounded-xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-#FFF8E7 text-3xl">🧸</div>}
                    <div>
                      <p className="text-xs font-semibold uppercase text-#8B6F47">{producto?.category}</p>
                      <h2 className="font-bold text-slate-900 dark:text-white">{producto?.name}</h2>
                      <p className="text-sm text-slate-500">$ {producto?.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="number" min="1" max={producto?.stock || undefined} value={item.cantidad} onChange={(e) => cambiarCantidad(item.id, Number(e.target.value))} className="w-20 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-center dark:border-slate-700" />
                    <strong className="min-w-24 text-right text-slate-900 dark:text-white">$ {subtotal.toFixed(2)}</strong>
                    <button type="button" onClick={() => eliminar(item.id)} className="text-sm font-semibold text-red-600">Quitar</button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resumen</h2>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">Total</span>
              <strong className="text-2xl text-slate-900 dark:text-white">$ {total.toFixed(2)}</strong>
            </div>
            <button type="button" onClick={confirmar} disabled={procesando} className="mt-6 w-full rounded-xl bg-#8B6F47 px-4 py-3 font-semibold text-white hover:bg-#765C39 disabled:opacity-50">
              {procesando ? "Confirmando..." : "Confirmar compra"}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Carrito;
