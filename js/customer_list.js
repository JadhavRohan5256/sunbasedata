let customer_data = [];
const icons = document.querySelectorAll('.icons');
const table_body = document.querySelector('.table-body');
const toast_wrapper = document.querySelector('.toast-wrapper')
let url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';


const iconsHandler = (event, column_name) => {
    //removing active class from each icons
    if (event.classList.contains('active')) {
        return;
    }

    icons.forEach((icon) => {
        if (icon.classList.contains('active')) {
            icon.classList.remove('active');
        }
    })

    const isUp = event.classList.contains('fa-chevron-up');
    event.classList.add('active');
    sort_customer_data(column_name, isUp);
}


const sort_customer_data = (column_name, isUp) => {
    customer_data = customer_data.sort((a, b) => {
        const prop_a = a[column_name];
        const prop_b = b[column_name];

        if (isUp) {
            return prop_a > prop_b ? 1 : -1;
        }
        else {
            return prop_a < prop_b ? 1 : -1;
        }
    });


    load_customer_data();
}

const load_customer_data = () => {
    let output = ``;
    if (customer_data.length <= 0) {
        output += `
                <tr>
                    <td colSpan='7' class='not-found'>no data found</td>
                </tr>`;
    }

    customer_data.forEach((row, idx) => {
        if (row.first_name !== '' && row.last_name !== '') {
            output += `
                <tr>
                    <td>${row.first_name}</td>
                    <td>${row.last_name}</td>
                    <td>${row.address}</td>
                    <td>${row.city}</td>
                    <td>${row.state}</td>
                    <td>${row.email}</td>
                    <td>${row.phone}</td>
                    <td class='action'>
                        <i class="fa-solid fa-trash" onClick="deleteCustomer('${row.uuid}');" style="color: #ff0000"></i>
                        <a href="/customer_update.html?uuid=${row.uuid}">
                            <i class="fa-solid fa-pen-to-square" style="color: #155724"></i>
                        </a>
                    </td>
                </tr>`;
        }
    })

    table_body.innerHTML = output;
}

function fetch_customer_data() {
    const token = `Bearer ${JSON.parse(localStorage.getItem('token'))}`
    jQuery(() => {
        $('.loader').show();
        $.ajax({
            url: url,
            method: 'GET',
            headers: {
                "Authorization": token
            },
            data: jQuery.param({ 'cmd': 'get_customer_list' }),
            success: (data) => {
                customer_data = data;
                load_customer_data();
                $('.loader').hide();
            },
            error: (error) => {
                toast('error-message', error.responseText.trim())
                load_customer_data();
                $('.loader').hide();
            }
        })
    })
}


//toast
const toast = (messageType, messageDesc) => {
    const div = document.createElement("div");
    div.classList.add("toast", messageType);
    div.setAttribute('onClick', 'closeToast(this)')
    const p = document.createElement("p");
    p.classList.add('toast-message');
    p.textContent = messageDesc;
    div.appendChild(p);
    toast_wrapper?.appendChild(div);
}

const toastTimeOut = () => {
    setInterval(() => {
        if (toast_wrapper?.firstChild !== null) {
            toast_wrapper?.removeChild(toast_wrapper.firstChild);
        }
    }, 3000)
}

const closeToast = (current) => {
    current.remove();
}


const deleteCustomer = (uuid) => {
    const token = `Bearer ${JSON.parse(localStorage.getItem('token'))}`
    const newURL = url + `?cmd=delete&uuid=${uuid}`
    $('.loader').show();

    jQuery(() => {
        $.ajax({
            url: newURL,
            method: 'POST',
            headers: {
                "Authorization": token
            },
            success: (data) => {
                toast('success-message', data.trim())
                fetch_customer_data();
                $('.loader').hide();
            },
            error: (error) => {
                toast('error-message', error.responseText.trim())
                load_customer_data();
                $('.loader').hide();
            }
        })
    })
}

toastTimeOut();
window.addEventListener('load', fetch_customer_data)