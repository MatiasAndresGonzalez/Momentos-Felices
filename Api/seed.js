import 'dotenv/config';

import sequelize from './src/config/database.js';
import Admin from './src/models/admin.model.js';
import Client from './src/models/client.model.js';
import Rol from './src/models/rol.model.js';
import Product from './src/models/product.model.js';
import Category from './src/models/category.model.js';

const roles = [
  { nombre: 'SUPERADMIN', descripcion: 'Administrador del sistema, acceso total' },
  { nombre: 'GESTOR', descripcion: 'Gestiona el catálogo de productos y categorías' },
  { nombre: 'AUDITOR', descripcion: 'Consulta el catálogo sin permisos de escritura' },
];

const categorias = [
  { name: 'Alimentación', description: 'Productos para alimentación y lactancia del bebé.' },
  { name: 'Higiene', description: 'Productos para higiene y cuidado diario.' },
  { name: 'Ropa', description: 'Ropa y accesorios para bebés y niños pequeños.' },
  { name: 'Regalos', description: 'Regalos y detalles para acompañar momentos especiales.' },
];

const productos = [
  { name: 'Mamadera Anticólicos 250 ml', price: 12500, stock: 18, category: 'Alimentación', image: 'https://images.unsplash.com/photo-1584839404042-8bc2b6c6f2f5?w=600&h=600&fit=crop' },
  { name: 'Set de Cubiertos Infantil', price: 8900, stock: 25, category: 'Alimentación', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop' },
  { name: 'Babero Impermeable', price: 4900, stock: 30, category: 'Alimentación', image: 'https://images.unsplash.com/photo-1544126592-807daa2ee9f0?w=600&h=600&fit=crop' },
  { name: 'Kit Higiene Recién Nacido', price: 15900, stock: 12, category: 'Higiene', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop' },
  { name: 'Toalla con Capucha', price: 13900, stock: 20, category: 'Higiene', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=600&fit=crop' },
  { name: 'Body Manga Corta Algodón', price: 11900, stock: 35, category: 'Ropa', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop' },
  { name: 'Pijama Enterito Suave', price: 18900, stock: 16, category: 'Ropa', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop' },
  { name: 'Manta de Apego', price: 10900, stock: 22, category: 'Regalos', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=600&fit=crop' },
  { name: 'Sonajero de Madera', price: 7500, stock: 28, category: 'Regalos', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop' },
  { name: 'Set de Regalo Bienvenido Bebé', price: 24900, stock: 10, category: 'Regalos', image: 'https://images.unsplash.com/photo-1511117833895-4b2b3c6f1d1f?w=600&h=600&fit=crop' },
];

const ejecutarSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    await sequelize.sync();
    console.log('Tablas sincronizadas.');

    const rolesCreados = {};
    for (const rolData of roles) {
      const [rol] = await Rol.findOrCreate({
        where: { nombre: rolData.nombre },
        defaults: { descripcion: rolData.descripcion },
      });
      rolesCreados[rolData.nombre] = rol;
    }

    const [admin] = await Admin.findOrCreate({
      where: { email: 'admin@tienda.com' },
      defaults: {
        nombre: 'Administrador',
        password: 'admin123',
        idRol: rolesCreados.SUPERADMIN.id,
      },
    });
    console.log(`Administrador listo: ${admin.email}`);

    const [cliente] = await Client.findOrCreate({
      where: { email: 'cliente@tienda.com' },
      defaults: {
        nombre: 'Cliente1',
        password: 'cliente123',
      },
    });
    console.log(`Cliente listo: ${cliente.email}`);

    for (const categoriaData of categorias) {
      await Category.findOrCreate({
        where: { name: categoriaData.name },
        defaults: categoriaData,
      });
    }
    console.log(`${categorias.length} categorías listas.`);

    for (const producto of productos) {
      await Product.findOrCreate({
        where: { name: producto.name },
        defaults: producto,
      });
    }
    console.log(`${productos.length} productos listos.`);

    console.log('Seed ejecutado correctamente.');
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

ejecutarSeed();
