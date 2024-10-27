const baseUrl = 'http://localhost/totalcode_back/public';

$('#loginForm').submit(function (e) {
    e.preventDefault();

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
                const token = data.token;
                localStorage.setItem('auth_token', token);

                $('.login-container').hide();
                $('.table-container').show();

                $('#username').val('');
                $('#password').val('');
                getOrders();
            } else {
                $('#loginMessage').text('Usuario o contraseña incorrectos').css('color', '#d32f2f');
            }
        },
        error: function (e) {
            $('#loginMessage').text('Ocurrió un error en la autenticación').css('color', '#d32f2f');
            console.error("error>>>", e);
        }
    });
});

$(document).ready(function () {
    isTokenExpired(); // Comprobar si el token ha expirado al cargar la página
});


$('.btn-salir').click(function () {
    localStorage.removeItem('auth_token');
    $('.login-container').show();
    $('.table-container').hide();
});

function getOrders() {
    $.ajax({
        url: baseUrl + '/api/orders',
        type: 'GET',
        success: function (orders) {
            if (orders) {
                const tableBody = $('#tableBody');

                orders.forEach(order => {
                    const row = `<tr>
                        <td>${order.first_name} ${order.last_name}<br /><small>${order.email}</small></td>
                        <td>${order.order_num}</td>
                        <td>${formatCurrency(order.total)}</td>
                    </tr>`;
                    tableBody.append(row);
                });

                const total = orders.reduce((acc, order) => acc + Number(order.total), 0);

                const totalRow = `
                    <tr class="total-row">
                        <td>Total</td>
                        <td>21</td>
                        <td>${formatCurrency(total)}</td>
                    </tr>`;
                tableBody.append(totalRow);

                $('.records').text(`Registros (${orders.length})`)
            } else {
                console.error('Error al obtener las órdenes');
            }
        },
        error: function (e) {
            console.error("error>>>", e);
        }
    })
}

function isTokenExpired() {
    const token = localStorage.getItem('auth_token');

    $.ajax({
        url: baseUrl + '/api/auth/check',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            if (!data.status) {
                localStorage.removeItem('auth_token');
                $('.login-container').show();
                $('.table-container').hide();
                return;
            }

            $('.login-container').hide();
            $('.table-container').show();
            getOrders();
        },
        error: function (e) {
            console.error("error>>>", e);
        }
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value);
}
