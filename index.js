const baseUrl = 'http://localhost/totalcode_back/public';

$('#loginForm').submit(function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma normal

    // Obtiene los valores del formulario
    const username = $('#username').val();
    const password = $('#password').val();

    // Realiza una solicitud AJAX con jQuery
    $.ajax({
        url: baseUrl + '/api/auth/login',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        success: function (data) {
            if (data.status) {
                $('#loginMessage').text('Inicio de sesión exitoso').css('color', 'green');
                // Redirigir o cargar contenido protegido

                const token = data.token;
                const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutos en milisegundos

                // Guardar el token y el tiempo de expiración en localStorage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('expirationTime', expirationTime);

                $('.login-container').hide();
                $('.table-container').show();
            } else {
                $('#loginMessage').text('Usuario o contraseña incorrectos').css('color', '#d32f2f');
            }
        },
        error: function (e) {
            $('#loginMessage').text('Ocurrió un error en la autenticación').css('color', '#d32f2f');
            console.log("error", e);
        }
    });
});

$(document).ready(function () {
    // Comprobar si el token ha expirado al cargar la página
    if (isTokenExpired()) {
        // Token expirado, redirigir a la página de inicio de sesión o mostrar un mensaje
        $('.login-container').show();
        $('.table-container').hide();
    } else {
        // Token válido, puedes proceder con las operaciones que requieran autenticación
        const token = sessionStorage.getItem('miToken');
        console.log('Token válido:', token);
        $('.login-container').hide();
        $('.table-container').show();
        // Aquí puedes hacer llamadas a tu API usando el token
    }
});

function isTokenExpired() {
    const expirationTime = localStorage.getItem('expirationTime');
    return expirationTime ? Date.now() > expirationTime : true;
}