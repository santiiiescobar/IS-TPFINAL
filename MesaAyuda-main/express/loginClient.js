
    const formE1=document.querySelector('.form');

    /*---
    Intercepta el submit del formulario
    */

    formE1.addEventListener('submit',  event => {
        event.preventDefault();
        const formData = new FormData(formE1);
        const data = Object.fromEntries(formData);
        console.log('Revisa el valor del form');

        console.log(data);

        /*---
        Realiza validaciones en los datos del formulario antes de procesar
        */

        if (data.username == '' || data.password == '') {
            console.log('debe indicar usuario');
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='Debe informar usuario y password para  completar el acceso';
            return;
        }

        if (data.username == 'pec'){
            console.log('pec no es bienvenido en éste sistema');
            const m=`<li>El usuario <pec> no es bienvenido en éste sistema</li>`;
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='El usuario <pec> no es bienvenido en éste sistema';
            return;
        }
        if (data.termscondition != 'on') {
            console.log('no aceptó los T&C no se puede loggear');
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='Debe aceptar los T&C para poder usar el sistema';
            return;
        }

        const listarTicketURL="http://127.0.0.1:5500/listarTicket.html";

        /*---
        Forma URL para acceder, typicode es un fake API REST para pruebas
        */
        //const testLoginURL='https://my-json-server.typicode.com/lu7did/testJASON/posts/';
        //const api_LoginURL=testLoginURL+data.id;

        /*---
          Dirección de REST API en AWS
        */
        //const RESTapi_LoginURL="https://ss6iifck5m.execute-api.us-east-1.amazonaws.com/loginClienteGET";
        //const api_LoginURL=RESTapi_LoginURL+"?id="+data.id+"&password="+data.password;

        const api_LoginURL="http://localhost:8080/api/loginClienteContacto"

        /*---
        Genera objeto HTML a ser actualizado en el tag identificado como "app"
        */

        /*
        id de cliente para test 
        0533a95d-7eef-4c6b-b753-1a41c9d1fbd0
        */

        const HTMLResponse=document.querySelector("#app");
        const ul=document.createElement("ul");

        const tpl=document.createDocumentFragment();
        console.log("accediendo URL "+api_LoginURL);       
        console.log("data es "+JSON.stringify(data));

        const login = {
            "contacto" : data.id,
            "password" : data.password
        };
            
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
            };


        console.log("login structure "+JSON.stringify(login));
        console.log("options "+JSON.stringify(options));
        /*-----
        Realiza el acceso al API Rest utilizando gestión de sincronización mediante promesas
        */
        
        fetch(`${api_LoginURL}`,options)
        .then(res => {
            return res.json();
        }).then(users=>{
            console.log(users);
//          if (users.response == 'OK') {         //<==Habilitar esto para dejar que el API REST verifique sin exponer la password
            if (users.password == data.password) {
                console.log('La password es correcta');
                console.log("nombre("+users.nombre+") fecha_ultimo_ingreso("+users.fecha_ultimo_ingreso+")");
                document.getElementById('resultado').style.color="BLACK";
                document.getElementById('resultado').textContent='Bienvenido al sistema '+users.nombre+', ultimo ingreso '+users.fecha_ultimo_ingreso;
                
                localStorage.clear();
                const mysession="MesaAyuda";
                var session = {'clienteID': users.id,"nombre" : users.nombre,"contacto":users.contacto,"fecha_ultimo_ingreso":users.fecha_ultimo_ingreso};
                localStorage.setItem(mysession,JSON.stringify(session));
                
                //window.location.href = listarTicketURL+"?id="+users.id+"&nombre="+users.nombre+"&ultimo="+users.fecha_ultimo_ingreso+"&contacto="+users.contacto+"&session="+mysession;
                window.location.href = listarTicketURL;
            }  else {
                console.log('La password no es correcta');
                document.getElementById('resultado').style.color="RED";
                document.getElementById('resultado').textContent='Error de login, intente nuevamente';
            }

        })
    });
