import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
	listarCategorias,
	crearCategoria,
	actualizarCategoria,
	eliminarCategoria,
} from '../../services/adminService.js';

const formularioInicial = { nombre: '' };

function AdminCategorias() {
	const { accesoGestor } = useAdminAuth();
	const [categorias, setCategorias] = useState([]);
	const [form, setForm] = useState(formularioInicial);
	const [editandoId, setEditandoId] = useState(null);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState('');
	const [mensaje, setMensaje] = useState('');

	const cargarCategorias = async () => {
		try {
			setCargando(true);
			setError('');
			const data = await listarCategorias();
			setCategorias(data || []);
		} catch (err) {
			setError(err.message || 'Error al cargar las categorías.');
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarCategorias();
	}, []);

	const limpiarFormulario = () => {
		setForm(formularioInicial);
		setEditandoId(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setMensaje('');

		const nombre = form.nombre.trim();
		if (!nombre) {
			setError('El nombre de la categoría es obligatorio.');
			return;
		}

		try {
			if (editandoId) {
				await actualizarCategoria(editandoId, { nombre });
				setMensaje('Categoría actualizada correctamente.');
			} else {
				await crearCategoria({ nombre });
				setMensaje('Categoría creada correctamente.');
			}

			limpiarFormulario();
			await cargarCategorias();
		} catch (err) {
			setError(err.message || 'Error al guardar la categoría.');
		}
	};

	const iniciarEdicion = (categoria) => {
		setEditandoId(categoria.id);
		setForm({ nombre: categoria.nombre || '' });
		setError('');
		setMensaje('');
	};

	const handleEliminar = async (id) => {
		if (!window.confirm('¿Querés eliminar esta categoría?')) return;

		try {
			setError('');
			await eliminarCategoria(id);
			setMensaje('Categoría eliminada correctamente.');
			await cargarCategorias();
		} catch (err) {
			setError(err.message || 'Error al eliminar la categoría.');
		}
	};

	if (cargando) {
		return <div className="p-8 text-slate-400">Cargando categorías...</div>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-slate-100">Categorías</h2>
				<p className="text-sm text-slate-400">
					Organizá las excursiones según el tipo de experiencia.
				</p>
			</div>

			{mensaje && (
				<div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">
					{mensaje}
				</div>
			)}

			{error && (
				<div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
					{error}
				</div>
			)}

			{accesoGestor && (
				<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
					<h3 className="mb-4 text-lg font-bold text-white">
						{editandoId ? 'Editar categoría' : 'Nueva categoría'}
					</h3>

					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							type="text"
							name="nombre"
							value={form.nombre}
							onChange={(event) => setForm({ nombre: event.target.value })}
							placeholder="Ej: Aventura"
							className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
							required
						/>
						<button type="submit" className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400">
							{editandoId ? 'Guardar' : 'Crear'}
						</button>
						{editandoId && (
							<button type="button" onClick={limpiarFormulario} className="rounded-lg border border-slate-600 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-800">
								Cancelar
							</button>
						)}
					</div>
				</form>
			)}

			<section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
				{categorias.length === 0 ? (
					<p className="p-6 text-slate-400">Todavía no hay categorías creadas.</p>
				) : (
					<ul className="divide-y divide-slate-800">
						{categorias.map((categoria) => (
							<li key={categoria.id} className="flex items-center justify-between gap-4 px-6 py-4">
								<div>
									<p className="font-semibold text-white">{categoria.nombre}</p>
									<p className="text-xs text-slate-500">ID {categoria.id}</p>
								</div>
								{accesoGestor && (
									<div className="flex gap-2">
										<button onClick={() => iniciarEdicion(categoria)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">
											Editar
										</button>
										<button onClick={() => handleEliminar(categoria.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500">
											Eliminar
										</button>
									</div>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

export default AdminCategorias;
