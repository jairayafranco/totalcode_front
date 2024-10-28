const baseUrl = 'http://localhost/totalcode_back/public';

$(document).ready(function () {
    isTokenExpired(); // Comprobar si el token ha expirado al cargar la página
});

// Iniciar sesion
$('#loginForm').submit(function (e) {
    e.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();

    // Realiza una solicitud AJAX con jQuery
    $.ajax({
        url: baseUrl + '/api/auth/login',
        type: 'POST',
        data: {
            username,
            password
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
            }
        },
        error: function (e) {
            $('#loginMessage').text('Ocurrió un error en la autenticación').css('color', '#d32f2f');
            console.error("error>>>", e);
        }
    });
});

$(".clear-button").click(function () {
    $('#month').val('0');
    $('#status').val('0');
    getOrders();
});

// Filtrar por mes y estado
$('#month, #status').on('input', function () {
    const month = $('#month').val();
    const status = $('#status').val();

    if (month && status) {
        getOrders(`month=${month}&status=${status}`)
    }
});

// Cerrar sesión
$('.btn-salir').click(function () {
    localStorage.removeItem('auth_token');
    $('.login-container').show();
    $('.table-container').hide();
});

// Obtener las ordenes
function getOrders(query = '') {
    $.ajax({
        url: baseUrl + '/api/orders' + (query ? `?${query}` : ''),
        type: 'GET',
        success: function (orders) {
            updateTable(orders);
        },
        error: function (e) {
            console.error("error>>>", e);
        }
    })
}

// Actualizar la tabla
function updateTable(orders) {
    if (orders.length) {
        const tableBody = $('#tableBody');
        tableBody.empty();

        orders.forEach(order => {
            const row = `<tr id="${order.order_num}">
                <td>${order.first_name} ${order.last_name}<br /><small>${order.email}</small></td>
                <td>${order.order_num}</td>
                <td>${formatCurrency(order.total)}</td>
            </tr>`;
            tableBody.append(row);
        });

        const total = reduceOrders({ orders, field: 'total' });
        const orders_num = reduceOrders({ orders, field: 'order_num' });

        const totalRow = `
            <tr class="total-row">
                <td style="text-align: right;">Total</td>
                <td>${orders_num}</td>
                <td>${formatCurrency(total)}</td>
            </tr>`;
        tableBody.append(totalRow);

        $('.records').text(`Registros (${orders.length})`)
    } else {
        $('#tableBody').html('<tr><td colspan="3" style="text-align: center;">No hay registros</td></tr>');
        $('.records').text('Registros (0)')
    }
}

// Comprobar si el token ha expirado
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

// Formatear moneda
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value);
}

// Reducir las órdenes
function reduceOrders({ orders, field }) {
    return orders.reduce((acc, order) => acc + Number(order[field]), 0);
}
