# Frontend para la API de Órdenes de Pedidos

Este proyecto es el frontend para la API de órdenes de pedidos, desarrollado en HTML, CSS, JavaScript y jQuery. Permite visualizar y manipular la información de las órdenes de pedidos obtenidas de la API.

## Características

- **Interfaz de usuario**: Presentación de las órdenes de pedidos en una tabla dinámica.
- **Filtro de datos**: Interacción mediante selectores para filtrar y consultar órdenes en tiempo real.
- **Actualización asíncrona**: La tabla de órdenes se actualiza dinámicamente a través de llamadas AJAX a la API.
- **Autenticación simulada**: Falso login implementado que otorga acceso a la información de la API.

## Tecnologías Utilizadas

- **HTML** y **CSS**: Para la estructura y estilos de la interfaz.
- **JavaScript** y **jQuery**: Para la interacción dinámica y la comunicación con la API.

## Requisitos Previos

- Acceso a la [API de Órdenes de Pedidos]([GitHub - jairayafranco/totalcode_back](https://github.com/jairayafranco/totalcode_back.git)).
- Navegador actualizado (Chrome, Firefox, Edge).

## Instalación

1. Clona el repositorio en el servidor local o abre el proyecto en tu máquina.
   
   ```bash
   https://github.com/jairayafranco/totalcode_front.git
   ```

2. Configura el enlace de la API en el archivo JavaScript principal (`script.js`) en la constante `baseUrl` en caso que el dominio por defecto no funcione o no se utilice xampp. 

3. Abre el archivo `index.html` en el navegador.

## Uso

1. **Iniciar sesión**: Completa el falso formulario de inicio de sesión.
2. **Consultar órdenes**: Usa los selectores para filtrar las órdenes y mostrar los resultados en la tabla.
3. **Actualizar tabla**: Presiona el botón "Limpiar" para restablecer la tabla o consulta de nuevo para refrescar los datos.

## Credenciales Login

```bash
username: admin
password: 1234
```

## Estructura del Proyecto

```cpp
    📁assets
        └── logo-total.png
        └── on-off-button.png
    └── index.html
    └── index.js
    └── styles.css
```

## Ejemplo de Uso de la API con AJAX

```javascript
function getOrders() {
    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(data) {
            updateTabla(data); // Llama a la función que muestra los datos en la tabla
        },
        error: function(error) {
            console.error("Error al obtener órdenes:", error);
        }
    });
}
```
