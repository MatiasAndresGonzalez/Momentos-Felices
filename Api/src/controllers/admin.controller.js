import { Admin, Rol } from '../models/index.js';

export const listarAdministradores = async (req,res) => {
 try { const data=await Admin.findAll({include:{model:Rol,as:'rol'},attributes:{exclude:['password']},order:[['id','ASC']]}); res.json({estado:true,data}); }
 catch(error){res.status(500).json({estado:false,mensaje:'Error al listar administradores',error:error.message});}
};
export const obtenerAdministradorPorId = async (req,res) => {
 try { const admin=await Admin.findByPk(parseInt(req.params.id,10),{include:{model:Rol,as:'rol'},attributes:{exclude:['password']}}); if(!admin)return res.status(404).json({estado:false,mensaje:'Administrador no encontrado'}); res.json({estado:true,data:admin});}
 catch(error){res.status(500).json({estado:false,mensaje:'Error al obtener administrador',error:error.message});}
};
export const crearAdministrador = async (req,res) => {
 try {
  const {nombre,email,password,idRol}=req.body;
  if(!nombre||!email||!password||!idRol)return res.status(400).json({estado:false,mensaje:'Debe proporcionar nombre, email, password y idRol'});
  const rol=await Rol.findByPk(idRol);
  if(!rol||!['SUPERADMIN','GESTOR','AUDITOR'].includes(rol.nombre.toUpperCase()))return res.status(400).json({estado:false,mensaje:'El rol seleccionado no es válido'});
  if(await Admin.findOne({where:{email}}))return res.status(400).json({estado:false,mensaje:'El email ya está registrado'});
  const data=await Admin.create({nombre,email,password,idRol});
  res.status(201).json({estado:true,mensaje:'Usuario administrativo creado correctamente',data:await Admin.findByPk(data.id,{include:{model:Rol,as:'rol'},attributes:{exclude:['password']}})});
 } catch(error){res.status(400).json({estado:false,mensaje:'Error al crear administrador',error:error.message});}
};
export const actualizarAdministrador = async (req,res) => {
 try {
  const id=parseInt(req.params.id,10), admin=await Admin.findByPk(id);
  if(!admin)return res.status(404).json({estado:false,mensaje:'Usuario administrativo no encontrado'});
  const {nombre,email,password,idRol}=req.body;
  if(email&&email!==admin.email){const existe=await Admin.findOne({where:{email}});if(existe&&existe.id!==id)return res.status(400).json({estado:false,mensaje:'El email ya se encuentra registrado'});}
  if(idRol){const rol=await Rol.findByPk(idRol);if(!rol||!['SUPERADMIN','GESTOR','AUDITOR'].includes(rol.nombre.toUpperCase()))return res.status(400).json({estado:false,mensaje:'El rol seleccionado no es válido'});}
  const campos={}; if(nombre!==undefined)campos.nombre=nombre;if(email!==undefined)campos.email=email;if(idRol!==undefined)campos.idRol=idRol;if(password&&password.trim())campos.password=password;
  await admin.update(campos);
  res.json({estado:true,mensaje:'Usuario administrativo actualizado correctamente',data:await Admin.findByPk(id,{include:{model:Rol,as:'rol'},attributes:{exclude:['password']}})});
 } catch(error){res.status(400).json({estado:false,mensaje:'Error al actualizar administrador',error:error.message});}
};
export const eliminarAdministrador = async (req,res) => {
 try {
  const id=parseInt(req.params.id,10); if(req.admin.id===id)return res.status(400).json({estado:false,mensaje:'No podés eliminar tu propio usuario'});
  const admin=await Admin.findByPk(id); if(!admin)return res.status(404).json({estado:false,mensaje:'Usuario administrativo no encontrado'});
  await admin.destroy(); res.json({estado:true,mensaje:'Usuario administrativo eliminado correctamente'});
 } catch(error){res.status(500).json({estado:false,mensaje:'Error al eliminar usuario administrativo',error:error.message});}
};
export const listarRoles = async (req,res) => {
 try { const data=await Rol.findAll({where:{nombre:['SUPERADMIN','GESTOR','AUDITOR']},order:[['nombre','ASC']]});res.json({estado:true,data});}
 catch(error){res.status(500).json({estado:false,mensaje:'Error al listar roles',error:error.message});}
};
