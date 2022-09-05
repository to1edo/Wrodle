const intentos = 6;
let intento = 0;
let fin = false;
let palabra;
let palabraSeparada = [];
let palabraPrueba = [];
let datos = [];

let repetidos = new Map();
let vecesPintadas = new Map();

const spinner = document.querySelector('.sk-cube-grid');


window.onload = ()=>{

    obtenerPalabra();
}

function iniciar() {
    palabraSeparada = palabra.split('');

    palabraPrueba = palabraSeparada.map( letra => '');

    mostrarDivLetras(palabraPrueba);
    mostrarGrid(palabraSeparada,intento);
}

const teclado = document.querySelector('.teclado');


function mostrarDivLetras(letras, isTest = false){

    const actual = document.querySelector('.actual');

    actual.innerHTML = '';

    if(isTest){
        contarPintadas(letras);
    }

    letras.forEach((letra,index) => {
        const div = document.createElement('div');
        div.classList.add('letra');

        if(isTest){

            //pintar green
            //si la letra esta en la posicion correcta
            if(letra === palabraSeparada[index]){
                div.classList.add('green');
                
                const tecla = document.querySelector(`.teclado button[value="${letra}"]`);
                tecla.classList.add('green');

                vecesPintadas.set(letra,vecesPintadas.get(letra)+1);

                if(vecesPintadas.get(letra) > repetidos.get(letra)){
                    const nodeList = document.querySelectorAll('.yellow');

                    // si la letra ya esta pintada de green y no esta repetida no debe pintarse de yellow en otras posiciones
                    nodeList.forEach( node =>{
                        if(node.textContent === letra){
                            node.classList.remove('yellow');
                            node.classList.add('grey');
                            vecesPintadas.get(letra)-1;

                            tecla.classList.remove('yellow');
                        }
                    })
                }
            }

            //pintar de yellow :`(
            //1- si la letra aparece en la palabra
            //2- si la letra no esta en lugar correcto dentro de la palabra
            if(palabraSeparada.includes(letra) && letra !== palabraSeparada[index] ){
                const tecla = document.querySelector(`.teclado button[value="${letra}"]`);

                //3- si la cantida de veces pintada es menor a la cantidad de veces que se repite la letra
                if(vecesPintadas.get(letra) < repetidos.get(letra) ){
                    div.classList.add('yellow');
                    tecla.classList.add('yellow');
                    vecesPintadas.set(letra,vecesPintadas.get(letra)+1);
                }else{
                    div.classList.add('grey');
                }
            }

            //pintar grey
            if(!palabraSeparada.includes(letra)){
                const tecla = document.querySelector(`.teclado button[value="${letra}"]`);

                div.classList.add('grey');
                tecla.classList.add('grey');

            }


        }

        div.innerHTML = letra;
        div.dataset.pos = index;
        actual.appendChild(div);
    });

}

function mostrarGrid(letras, intento){

    const siguientes = document.querySelector('.siguientes');

    siguientes.innerHTML = '';

    for (let i = 1; i < intentos - intento; i++) {
        
        
        letras.forEach((letra,index) => {
            const div = document.createElement('div');
            div.classList.add('letra');
            div.dataset.pos = index;
            siguientes.appendChild(div);
        });
    
        
    }

}


teclado.onclick = detectarTecla;

function detectarTecla(e){
    if (e.target.type === 'submit') {

        if(e.target.value === 'borrar'){
            //borrar letra
            borrarLetra();
            return;
        }

        if(e.target.value === 'enviar'){

            let datosSinTilde = datos.map( palabra =>{
                return removeAccents(palabra);
            });

            if( palabraPrueba.includes('') ){

                mostrarAlerta('Faltan letras', 'error');
                return;
            }

            if( !datosSinTilde.includes(palabraPrueba.join('')) ){

                mostrarAlerta('La palabra no esta en nuestra lista', 'error');
                return;
            }

            if(!palabraPrueba.includes('')){
                //comprobar palabra
                intento ++;
                comprobarPalabra();
            }
            return;
        }

        colocarLetra(e.target.value);
    }
}

function colocarLetra(letraEntrada) {

    for (let i = 0 ; i < palabraSeparada.length; i++){

        if(palabraPrueba[i] === ''){
            palabraPrueba[i] = letraEntrada;
            break;
        }
    }
    mostrarDivLetras(palabraPrueba);
    mostrarGrid(palabraSeparada,intento);
}

function borrarLetra(){

    for (let i = 0 ; i < palabraSeparada.length; i++){

        if(palabraPrueba[i] === ''){
            palabraPrueba[i-1] = '';
            break;
        }

        if( i === palabraSeparada.length - 1){
            palabraPrueba[i] = '';
            break;
        }
    }
    mostrarDivLetras(palabraPrueba);
    mostrarGrid(palabraSeparada,intento);
}

function comprobarPalabra(){
    const previos = document.querySelector('.previos');
    const actual = document.querySelector('.actual');


    if(JSON.stringify(palabraPrueba) === JSON.stringify(palabraSeparada)){

        const teclado = document.querySelector('.teclado');
        teclado.classList.add('ocultar');
        mostrarBtn();
        mostrarAlerta("Felicidades, Has adivinado la palabra",'exito',false);
        fin = true;
    }

    if(intento === intentos && JSON.stringify(palabraPrueba) !== JSON.stringify(palabraSeparada)){
        const teclado = document.querySelector('.teclado');
        teclado.classList.add('ocultar');
        mostrarAlerta(`Se acabaron los intentos, suerte la  proxima vez. La palabra correcta era: ${palabra}`,'error',false);
        mostrarBtn();
        fin = true;
    }


    mostrarDivLetras(palabraPrueba,true);

    const previo =document.createElement('div');
    previo.classList.add('previo');
    previo.innerHTML +=  actual.innerHTML;
    previos.appendChild(previo);

    palabraPrueba.fill('',0,palabraPrueba.length)
    mostrarDivLetras(palabraPrueba);
    mostrarGrid(palabraSeparada,intento);

    if(fin && intento === intentos){
        actual.innerHTML = '';
    }

}


function mostrarAlerta(menasje,tipo,borrar = true){

    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia){
        alertaPrevia.remove();
    }

    const alertaDiv = document.createElement('div');
    alertaDiv.textContent = menasje;
    alertaDiv.classList.add(tipo,'alerta');

    const alertContainer = document.querySelector('.alertaContainer');

    alertContainer.appendChild(alertaDiv);

    if(borrar){
        setTimeout(() => {
            alertaDiv.remove();
        }, 3000);
    }

}



function mostrarBtn(){
    const empezarNuevo = document.createElement('button');
    empezarNuevo.classList.add('boton','comenzar');
    empezarNuevo.textContent = 'Jugar de nuevo';

    empezarNuevo.onclick = () =>{
        resetear();
        empezarNuevo.remove();
    }

    document.querySelector('body').appendChild(empezarNuevo);
}

function resetear(){

    const previos = document.querySelector('.previos');
    previos.innerHTML = '';

    const actual = document.querySelector('.actual');
    actual.innerHTML = '';

    const btn = document.querySelector('.boton.comenzar');
    btn.remove();

    const teclado = document.querySelector('.teclado');
    teclado.classList.remove('ocultar');


    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia){
        alertaPrevia.remove();
    }

    intento = 0;
    fin = false;

    //asignar una nueva palabra
    spinner.classList.remove('ocultar');
    reasignarPalabra();

    const keys = document.querySelectorAll('.teclado .key');

    keys.forEach( key=>{
        key.classList.remove('green','yellow','grey');
    })
    

}


function obtenerPalabra(){
    repetidos.clear();

    // fetch('https://api-palabras.herokuapp.com/palabras-caracteres?largo=5') //pronto agregar mas palabras eligiendo dificultad
    fetch('./dictionary.json') //pronto agregar mas palabras eligiendo dificultad
        .then( response => response.json())
        .then( result =>{
            datos = result;
            const palabraSinFiltro = datos[random(0,5119)];  
            
            palabra = removeAccents(palabraSinFiltro);
            contarRepetidas(palabra);
            iniciar();
            spinner.classList.add('ocultar');
        })
}

function reasignarPalabra(){
    const palabraSinFiltro = datos[random(0,5119)].palabra;  
            
    palabra = removeAccents(palabraSinFiltro);
    contarRepetidas(palabra);
    iniciar();
    spinner.classList.add('ocultar');
}

function contarRepetidas(word){

    let wordSplit = word.split('');
    let sort = wordSplit.sort();
    let contador = 1;

    for(let i = 0 ; i < sort.length ; i++ ){

        if(sort[i] === sort[i+1]){
            contador++;
        }else{

            repetidos.set(sort[i],contador);
            contador = 1;
        }
    }
}

function contarPintadas(array){
    for(let i = 0 ; i < array.length ; i++ ){
        vecesPintadas.set(array[i],0);
    }
}


function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// funcion para remover tildes
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// ventana de ayuda
const ayudaDiv = document.querySelector('.ayuda');
const ayudaCerrar = document.querySelector('.ayuda .boton');
const ayudaAbrir = document.querySelector('.info');

ayudaCerrar.onclick = ()=>{
    
    ayudaDiv.classList.add('ocultarY');
}

ayudaAbrir.onclick = ()=>{
    
    ayudaDiv.classList.toggle('ocultarY');
}



//Light Mode

const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const body = document.querySelector('body')
const siguientes = document.querySelector('.siguientes');
const actual = document.querySelector('.actual');
const ayuda = document.querySelector('.ayuda');


sun.onclick = ()=>{
    moon.classList.toggle('ocultar');
    sun.classList.toggle('ocultar');


    teclado.classList.add('light');
    body.classList.add('light');
    siguientes.classList.add('light');
    actual.classList.add('light');
    ayuda.classList.add('light');
}

moon.onclick = ()=>{
    moon.classList.toggle('ocultar');
    sun.classList.toggle('ocultar');

    teclado.classList.remove('light');
    body.classList.remove('light');
    siguientes.classList.remove('light');
    actual.classList.remove('light');
    ayuda.classList.remove('light');
}