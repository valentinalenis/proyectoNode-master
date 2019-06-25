const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const dirNode_modules = path.join(__dirname , '../node_modules')
const funciones = require('./funciones');



const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));
//Bootstrap
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine' , 'hbs');



app.get('/',(req, res)=>{
    res.render('index');
});

app.get('/crearCurso',(req, res)=>{
    res.render('crearCurso',{
        est: req.body.nombre
    });
});
app.get('/login',(req, res)=>{
    res.render('login');
});

app.get('/registro',(req, res)=>{
    res.render('registro');
});
app.post('/indexU',(req, res)=>{
    
    if(funciones.crear(req.body) == false){
        res.render('registro',{
            err:"Este estudiante ya esta registrado"
        });
    }else{
        res.render('indexU',{
            est:req.body.nombre
        });
    }
    
});

app.post('/curso',(req,res)=>{
    if(funciones.crearCurso(req.body)==false){
        res.render('crearCurso',{
            err:"Este curso ya existe!"
        });
    }else{
        res.render('crearCurso',{
            err:"Curso registrado con exito"
        });
    }
});
app.post('/in',(req,res)=>{
    console.log(req.body);
    if(req.body.documento == 123456){
        res.render('indexC',{
            est: req.body.nombre
        });
    }else{
        res.render('indexU',{
            est: req.body.nombre
        });
    }
    
});

app.get('/verCursos',(req, res)=>{
    res.render('verCursos');
    
});

app.get('/inscribir',(req, res)=>{
    res.render('inscribir');
    
});

app.get('/inscritos', (req, res) =>{
    res.render('inscritos');
});

app.post('/ins',(req,res)=>{
    if(funciones.matricular(req.body)==false){
        res.render('inscribir',{
            err:"El usuario ya se matriculo en este curso"
        });
    }else if(funciones.matricular(req.body)=="NC"){
        res.render('inscribir',{
            err:"El curso no existe"
        });
    }else if(funciones.matricular(req.body)=="NE"){
        res.render('inscribir',{
            err:"El estudiante no existe"
        });
    }else if(funciones.matricular(req.body)=="ND"){
        res.render('inscribir',{
            err:"El curso ya esta cerrado"
        });
    }else{
        res.render('inscribir',{
            err:"Estudiante matriculado"
        });
    }
})
app.get('/verCursosI',(req, res)=>{
    res.render('verCursosI');
    
});

app.post('/eliminar', (req, res) => {
    if(funciones.eliminarCurso(req.body.id) == false){
        console.log(req.body.id);
        res.render('verCursos',{
            
            err:'No se eliminó'
        } );
    }else{
        res.render('verCursos',{
            
            err:' se eliminó'
            
        } );
    }
});

app.post('/informacion', (req, res) => {
    if(funciones.informacion(req.body.id) == false){
        console.log(req.body.id);
        res.render('verCursosI',{
            
            err:'no se accedio a la info'
        } );
    }else{
        res.render('verCursosI',{
            
            err:'Info accedida correctamente'
            
        } );
    }
});

app.get('/misCursos',(req,res)=>{
    res.render('misCursos',{
            
    } );
});
let ide = "";
app.post('/misC',(req,res)=>{
    ide =req.body.idEst;
    
    if(funciones.cursosEst(req.body.idEst) == false){
        res.render('misCursos',{
            err: "Usuario no encontrado"
        } );
    }else{
        res.render('misCursos');
    }
    
})

app.post('/misCursos',(req,res)=>{
    console.log(ide);
    console.log(req.body.idc);
    if(funciones.eliminarCurso(req.body.idc,ide) ==false){
        res.render('misCursos',{
            err: "Curso no eliminado"
        } );
    }else{
        
        if(funciones.cursosEst(ide) == false){
            res.render('misCursos',{
                err: "Este usuario no esta resgistrado en ningun curso"
            } );
        }else{
            res.render('misCursos',{
                err: "Curso eliminado"
            });
        }
        
    }
    
})
app.post('/actualizarCurso',(req,res)=>{
    if(funciones.actualizarCurso(req.body.id)==false){
        res.render('verCursos',{
            err:"No se pudo actualizar "
        });
    }else{
        res.render('verCursos',{
            err:"Actualizado correctamente"
        });
    }
})

//////////////////////////inscritos
app.get('/inscritos',(req, res)=>{
    res.render('inscritos');
    
});

app.put('/actualizarUsuarios', (req, response) => {
    console.log(req.body, req.params)
    const { cc } = req.params;
    const { nombre, email,telefono, tipo } = req.body;
    if(funciones.actualizarUsuarios(req.body) == false){
        res.render('inscritos',{
            err:"no se pudo"
        });
    }else{
        res.render('inscritos',{
            usu:req.body.cc
        });
    }

    listU.forEach((usu) => {
        if(curso.cc == cc){
            usu.nombre = nombre;
            usu.email = email;
            usu.telefono = telefono;
            usu.tipo = tipo;
        }
    });
    response.json('Successfully update');
});


console.log(__dirname);

app.listen(3000,()=>{
    console.log('Puero 3000');
});

