const dbValidator=require('./db-validators');
const generarJWT=require('./generar-jwt');
const googleVerify=require('./google-verify');
const subirArchivo=require('./subir-archivo');

module.exports={
    ...dbValidator,//exporta todo lo q contiene, metodos, propiedades
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}