const path = require('path');//raiz de la app
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extPermitidas = ['png', 'jpg', 'jpeg', 'gif', 'svg'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        //Validar la extension del archivo
        const nombcortado = archivo.name.split('.');
        const extension = nombcortado[nombcortado.length - 1];

        if (!extPermitidas.includes(extension)) {
            return reject(`La extesion ${extension} no esta permitida, las permitidas son ${extPermitidas}`);
        }
        //Renombrar el archivo
        //asignar identificador unico con uuid
        const nombFile = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombFile);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(nombFile);
        });
    });
}

module.exports = {
    subirArchivo
}