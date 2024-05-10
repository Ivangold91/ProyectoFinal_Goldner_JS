// declaro la base de datos de productos
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//Llamo a la API local en productos.json
fetch ("/data/productos.json")
    .then (res => res.json())
    .then (dataProductos => {
        mostrarProductos(dataProductos);
    })

// Creo las referencias a los ID del HTML
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carritoVacio");
const productosCarrito = document.querySelector("#productosCarrito");
const productoTotal = document.querySelector("#productosTotal");
const contenedorCantidadProductosTotal = document.querySelector("#contenedorCantidadProductosTotal");


// Incorporo cada producto con JS

const mostrarProductos = (dataProductos) => {
    dataProductos.forEach ( (producto) => {
        const div = document.createElement ("div");
        div.classList.add("card");
        div.innerHTML = `
        <img src="${producto.img}" class="card-img-top img-thumbnail" alt="${producto.titulo}">
            <div class="card-body">
                <h5 class="card-title">${producto.titulo}</h5>
                <p class="card-text">$ ${producto.precio}</p>
            </div>
        ` ;
        // Creo un boton con una clase de bootstrap y le agrego un evento.
        const btn = document.createElement ("button");
        btn.classList.add("pt-3");
        btn.classList.add("bg-secondary");
        btn.innerText = "Agregar al carrito";
        btn.classList.add("text-light");
        btn.classList.add("d-flex");
        btn.classList.add("align-items-center");
        btn.classList.add("justify-content-center");

        // Dentro de este evento llamo a una función para agregar producto al carrito
        btn.addEventListener ("click", () => {
            agregarAlCarrito (producto);
        })
    
        // Agrego el btn como append en el div y agrego el div como append en contenedorProductos
        div.append(btn);
        contenedorProductos.append(div);
    }  )
}



// Recibe el llamado del evento del boton de agregar al carrito y empieza a almacenar en el array carrito
const agregarAlCarrito = (producto) => {
    
    const itemEncontrado = carrito.find ( (item) => item.titulo === producto.titulo)

    if (itemEncontrado) {
        itemEncontrado.cantidad = itemEncontrado.cantidad + 1;
    } else (
        carrito.push({...producto, cantidad : 1})
    )

    actualizarCarrito(producto);

    Toastify({
        text: "Producto agregado",
        gravity: "bottom",
        duration: 1000,
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
}

const actualizarCarrito = (producto) => {

    if (carrito.length === 0) {
        // carritoVacio.classList.add ("d-none")
        productosCarrito.classList.add ("d-none")
    } else   {
        carritoVacio.classList.add ("d-none")
        productosCarrito.classList.remove ("d-none")

        productosCarrito.innerHTML=``;
        
        carrito.forEach (producto => {
            const div = document.createElement("div");
            div.classList.add ("d-flex");
            div.innerHTML = `
                    <h5 class="card-title m-3">${producto.titulo}</h5>
                    <p class="card-text m-3">Precio:$ ${producto.precio}</p>
                    <p class="card-text m-3">Cantidad: ${producto.cantidad}</p>
                    <p class="card-text m-3">Subtotal: $ ${producto.cantidad * producto.precio}</p>
                </div>
            ` ;
            
            const btnRestarProducto = document.createElement("button");
            btnRestarProducto.classList.add ("m-3");
            btnRestarProducto.innerText = "Restar";
            btnRestarProducto.addEventListener ("click", () => {
                restarProducto(producto);
            })
            div.append(btnRestarProducto);

            const btnSumarProducto = document.createElement("button");
            btnSumarProducto.classList.add ("m-3");
            btnSumarProducto.innerText = "Sumar";
            btnSumarProducto.addEventListener ("click", () => {
                sumarProducto(producto);
            })
            div.append(btnSumarProducto);
            
            const btnBorrarProducto = document.createElement ("button");
            btnBorrarProducto.classList.add ("m-3");
            btnBorrarProducto.innerText = "Borrar";
            btnBorrarProducto.addEventListener ("click", () => {
                borrarProducto(producto);
            })
            div.append(btnBorrarProducto);

            

            productosCarrito.append(div);
        })
    }   
    productosTotal(producto);
    contenedorCantidadProductosTotal.innerText = contadorProductosTotal() ;
    contenedorCantidadProductosTotal.classList.add ("fs-2");

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const sumarProducto = (producto) => {
    producto.cantidad ++;
    actualizarCarrito(producto);
}

const restarProducto = (producto) => {
    if(producto.cantidad !== 1) {
        producto.cantidad --;
    }
    actualizarCarrito(producto);
}

const borrarProducto = (producto) => {
    const itemBorrar = carrito.findIndex(item => item.titulo === producto.titulo);
    carrito.splice (itemBorrar,1)
    actualizarCarrito(producto)
}

const productosTotal = (producto) => {
        const costoTotal = carrito.reduce ( (acum,prod) => acum + prod.precio * prod.cantidad , 0);
        productoTotal.innerText = `Total = $ ${costoTotal}`;
        productoTotal.classList.add ("fw-bolder");
}

const contadorProductosTotal = () => {
    const contProdTotal = carrito.reduce ( (acum,prod) => acum + prod.cantidad,0);
   return contProdTotal;
}

actualizarCarrito ();