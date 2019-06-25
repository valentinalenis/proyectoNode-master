const fs = require('fs');
const hbs = require('hbs');
listU = [];
listC =[];
listM = [];
l = [];

function crear(estudiante){
    listar();
    let est = {
        cc: estudiante.documento,
        nombre: estudiante.nombre,
        email: estudiante.email,
        telfono: estudiante.telefono_cel,
        tipo:"e"

    }
    let duplicado = listU.find(nom => nom.cc == estudiante.documento);
    if(!duplicado){
        listU.push(est);
        console.log(listU);
        guardar();
    }else{
        return false;
    }
    
}

const listar = () =>{
    try{
        listU = require('../usuarios');
    }catch(error){
        listU = [];
    }
    
}
const guardar = () =>{
    let datos = JSON.stringify(listU);
    fs.writeFile('usuarios.json',datos,(err)=>{
        if(err) throw (err);
        console.log('Archivo creado con exito');
    })
}

const actualizar = (nom, asignatura, calificacion ) =>{
    listar();

    let encontrado = listE.find(buscar => buscar.nombre == nom );

    if(!encontrado){
        console.log('El estudiante no existe');
    }else{
        encontrado[asignatura] = calificacion;
        guardar();
    }
}

const eliminar = (nom)=>{
    listar();
    let nuevo = listE.filter(n => n.nombre != nom);
    if(nuevo.length == listE.length){
        console.log('Ningun estudinate tiene ese nombre');
    }else{
        listE = nuevo;
        guardar();

    }
}

/////////////////Cursos

const crearCurso =(curso)=>{
    listarCurso();
    let cur = {
        id:parseInt(curso.newId),
        nombre: curso.newNombre,
        des: curso.newDescripcion,
        valor: parseInt(curso.newValor),
        modalidad:curso.newModalidad,
        horas:curso.newHoras,
        estado:"disponible"

    }
    let duplicado = listC.find(c => c.id == curso.newId);
    if(!duplicado){
        listC.push(cur);
        console.log(listU);
        guardarCurso();
    }else{
        return false;
    }
}


const listarCurso = () =>{
    try{
        listC = require('../cursos.json');
    }catch(error){
        listC = [];
    }
    
}

const listarCursosDisponibles = () =>{
    try{
        listC = require('../cursos.json');
        let nuevo = listC.filter(c => c.estado != 'cerrado');
        if(listC.length == nuevo.length){
            console.log('Todos los cursos estan disponibles');
        } else {
            listC = nuevo;
        }
    }catch(error){
        listC = [];
    }
    
}


const guardarCurso = () =>{
    let datos = JSON.stringify(listC);
    console.log(datos);
    fs.writeFile('cursos.json',datos,(err)=>{
        if(err) throw (err);
        console.log('Archivo guardado con exito');
        
    })
}



const matricular =(matricula) =>{
    listarMatriculas();
    listarCurso();
    listar();
    let m = {
        idCurso: parseInt(matricula.idcur),
        idest: matricula.idEst
    }
    let estd = listU.find(e => e.cc == matricula.idEst);
    let curd = listC.find(c => c.id == matricula.idcur);
    let duplicado = listM.find(ma => ma.idCurso == matricula.idcur && ma.idest == matricula.idEst);
    if(!duplicado){
        if(estd){
            if(curd){
                if(curd.estado == "disponible"){
                    listM.push(m);
                    guardarMatricula();
                }else{
                    return "ND"
                }
                
            }else{
                return "NC"
            }
        }else{
            return "NE"
        }
    }else{
        return false;
    }

}

const listarMatriculas = () =>{
    try{
        listM = require('../matricula');
    }catch(error){
        listM = [];
    }
    
}
const guardarMatricula = () =>{
    let datos = JSON.stringify(listM);
    fs.writeFile('matricula.json',datos,(err)=>{
        if(err) throw (err);
        console.log('Archivo guardado con exito');
    })
}

const mostrarInscritos = (idCurso) => {
    listarMatriculas();
    listar();

    let lstEstudiantes = [];

    let estudiantes = listM.filter(e => e.idCurso == idCurso)

    estudiantes.forEach(est => {
        let e = listU.find(u => u.cc == est.idest);
        lstEstudiantes.push(e);
    });
    return lstEstudiantes;
    
}

const eliminarInscrito = (idEst) => {
    listarMatriculas();
    let nuevo = listM.filter(m => m.idest != idEst);
    listM = nuevo;
    guardarMatricula();
}

hbs.registerHelper('listar',()=>{
    listarCurso();
    let texto = `<table id="tb" class="table table-hover" >\
                    <thead>\
                        <tr>\
                            <th>ID</th>\
                            <th>Curso</th>\
                            <th>Descripción</th>\
                            <th>Valor</th>\
                            <th>Estado</th>\
                        </tr>\
                    </thead>\
                    <tbody> `;

    listC.forEach(curso => {
        texto = texto + 
            '<tr> ' +
            '<td class ="id">' + curso.id + '</td>' +
            '<td class = "nombre"> ' + curso.nombre + '</td>' +
            '<td> ' + curso.des + '</td>'+
            '<td> ' + curso.valor + '</td>'+
            '<td> <input type = "text"  class = "tipo" value=' + curso.estado +' ></td>'


    });
    
    texto = texto + '</tbody></table>'
    return texto;
})

hbs.registerHelper('listarCursosInscritos', () => {
    listarCursosDisponibles();
    let texto = "";
    listC.forEach(curso => {
        let lstEstudiantes = mostrarInscritos(curso.id);
        texto = texto + 
            '<p>' +
            '<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample' + curso.id +'" aria-expanded="false" aria-controls="collapseExample' + curso.id +'">' +
              curso.nombre +
            '</button>' +
          '</p>' + 
          '<div class="collapse" id="collapseExample' + curso.id +'">' +
            '<div class="card card-body">' + 
                `<table id="tb" class="table table-hover" >\
                <thead>\
                    <tr>\
                        <th>Documento</th>\
                        <th>Nombre</th>\
                        <th>Correo</th>\
                        <th>Telefono</th>\
                        <th>Eliminar</th>\
                    </tr>\
                </thead>\
                <tbody> `;

                lstEstudiantes.forEach(est => {
                    texto = texto + 
                        '<tr> ' +
                        '<td class ="id">' + est.cc + '</td>' +
                        '<td class = "nombre"> ' + est.nombre + '</td>' +
                        '<td> ' + est.email + '</td>'+
                        '<td> ' + est.telfono + '</td>'+
                        '<td> <button class="btn btn-danger">Eliminar</button></td>'
                });

                texto = texto + '</tbody></table>' +
              
            '</div>' +
          '</div>';
    });
    return texto;
});


const actualizarCurso = (idCurso) => {
    listarCurso();
    console.log(idCurso);
    
    listC.forEach(c => {
        if(c.id == idCurso ){
         c.estado = 'Cerrado';
         guardarCurso();
        }
    });
  
}

hbs.registerHelper('masInfo',()=>{
    console.log(msj);
     
})

hbs.registerHelper('listarDispo',()=>{
    listarCurso();
    let texto = `<table id="tb" class="table table-hover" >\
                    <thead>\
                        <tr>\
                            <th>ID</th>\
                            <th>Curso</th>\
                            <th>Descripción</th>\
                        </tr>\
                    </thead>\
                    <tbody> 
                    `;

    listC.forEach(curso => {
        if(curso.estado == 'disponible'){
            texto = texto + 
            '<tr> ' +
            '<td>' + curso.id + '</td>' +
            '<td> ' + curso.nombre + '</td>' +
            '<td> ' + curso.des + '</td>'
        }
        
    });
    
   
    texto = texto + '</tbody></table>'
    return texto;
})

hbs.registerHelper('comboBoxUsu',()=>{
    listar();
    let texto;
    listU.forEach(usu => {
            texto = texto + 
            `<div class="dropdown">\
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
    Dropdown</button>\
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">'+usu.cc+'</a>`;
            
        
        console.log(usu.cc+'-');
    });
   
    texto = texto + '</div></div>'
    return texto;
})


hbs.registerHelper('listarUsu',()=>{
    listar();
    let texto = `<table id="tb" class="table table-hover" >\
                    <thead>\
                        <tr>\
                            <th>cc</th>\
                            <th>nombre</th>\
                            <th>telefono</th>\
                            <th>email</th>\
                            <th>tipo</th>\
                            <th>Actualizar</th>\
                        </tr>\
                    </thead>\
                    <tbody> 
                    `;

    listU.forEach(usu => {
       
            texto = texto + 
            '<tr> ' +
            '<td><input type = "text"  class = "cc" id="cc" value='+usu.cc+' ></td>' +
            '<td> <input type = "text"  class = "nombre" value='+usu.nombre+' ></td>' +
            '<td> <input type = "text"  class = "telefono" value='+usu.telefono+' ></td>' +
            '<td> <input type = "text"  class = "email" value='+usu.email+' ></td>' +
            '<td> <input type = "text"  class = "tipo" value='+usu.tipo+' ></td>'+
            '<td><button class="btn btn-primary">Actualizar</button></td>'
        
        
    });
    
   
    texto = texto + '</tbody></table>'
    return texto;
})

hbs.registerHelper('actualizarUsuarios',(cc, nombre, email, telefono, tipo)=>{
    listar();

    let encontrado = listE.find(buscar => buscar.cc == cc );

    if(!encontrado){
        console.log('El usuario no existe');
    }else{
        cc=cc;
        nombre=nombre;
        email=email;
        telefono=telefono;
        tipo=tipo;
        guardar();
    }
})

const actualizarUsuarios = (cc, nombre, email, telefono, tipo) =>{
    listar();

    let encontrado = listE.find(buscar => buscar.cc == cc );

    if(!encontrado){
        console.log('El usuario no existe');
    }else{
        cc=cc;
        nombre=nombre;
        email=email;
        telefono=telefono;
        tipo=tipo;
        guardar();
    }
}
  
hbs.registerHelper('buscar',(id)=>{
    listarCurso();
    let texto = listcC.find(buscar => buscar.id == id );
    return texto.nombre;
})



const eliminarCurso = (idc,idE) => {
    listarMatriculas();
    let idC = parseInt(idc);
    let cursoId = [];// listM.filter(c =>c.idCurso != idC && c.idest != idE);
    
    
    listM.forEach(s =>{
        console.log(s.idCurso);
        console.log(s.idest);
        if(s.idCurso != idC || s.idest != idE){
            cursoId.push(s);
        }
    })
    console.log(cursoId.length);
    if(cursoId.length == listM.length){
        return false;
    }else{
        listM = cursoId;
        console.log(listM)
        guardarMatricula();
    }
    
};

var msj;
const informacion = (id) => {
    listarCurso();
    let idC = parseInt(id);
    let cursoId = listC.filter(c =>c.id == idC);
    var yourval = JSON.stringify(cursoId);
    console.log(cursoId);
    cursoId.forEach(element => {
        msj=(`El curso ${element.nombre}, tiene un 
        valor de ${element.valor}, con modalidad ${element.modalidad}
        de ${element.horas} horas:
        ${element.des}`);
    });
    
        return msj;
};

hbs.registerHelper('mostrar',()=>{
    console.log(msj);
    let t = `<div class="alert alert-primary" role="alert">\
            `+msj+`
    <tbody> 
    `;
    t = t + '</tbody></div>'
    return t;
})


const cursosEst = (cedula) =>{
    listarCurso();
    listarMatriculas();
    listar();
    l = [];
    let ma = listM.filter(m => m.idest == cedula);
    let cur;
    if(ma.length>0){
        ma.forEach(cu =>{
            cur = listC.filter(c => c.id == cu.idCurso);
            cur.forEach(s =>{
                l.push(s);
                
            })
            
    
        })
        console.log(l);
        if(cur.length>0){
            
            return l;
        }else{
            console.log(cur);
        }
    }else{
        return false;
    }
    

}
hbs.registerHelper('listarMC',()=>{
    let texto = `<table id="tb" class="table table-hover" >\
                    <thead>\
                        <tr>\
                            <th>ID</th>\
                            <th>Curso</th>\
                            <th>Descripción</th>\
                        </tr>\
                    </thead>\
                    <tbody> 
                    `;
    //console.log("ff " + l);
    l.forEach(curso => {
        
        texto = texto + 
        '<tr> ' +
        '<td>' + curso.id + '</td>' +
        '<td> ' + curso.nombre + '</td>' +
        '<td> ' + curso.des + '</td>'
        
        
    });
    
   
    texto = texto + '</tbody></table> <form class="form-inline" action="./misCursos" method="POST">\
    <label class="sr-only" for="inlineFormInputName2">Name</label>\
    <input type="text" class="form-control mb-2 mr-sm-2" name="idc" placeholder=" ID curso a eliminar" required>\
    <button type="submit" class="btn btn-primary mb-2">Eliminar</button></form>'
    return texto;
})
  

module.exports = {
    crear,
    actualizar,
    eliminar,
    crearCurso,
    matricular, 
    mostrarInscritos,
    eliminarCurso,
    informacion,
    cursosEst,
    eliminarInscrito,
    actualizarUsuarios,
    listarMatriculas,
    actualizarCurso
}