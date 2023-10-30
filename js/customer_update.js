let customer_data = [];
const toast_wrapper = document.querySelector('.toast-wrapper')
let url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
const customer_form = document.querySelector('.customer-form');
const domain = location.protocol + '//' + location.host;



const addFormData = (uuid) => {
    const customer = customer_data.find((customer) => customer.uuid === uuid)

    let output = `
        <div class="two-column">
        <input 
            type="hidden" 
            name="uuid" 
            id="uuid"
            value="${customer.uuid}"
        />
        <input 
            type="text" 
            name="first_name" 
            id="first_name"
            placeholder="First Name"
            value="${customer.first_name}"
        />
        <input 
            type="text" 
            name="last_name" 
            id="last_name"
            placeholder="Last Name"
            value="${customer.last_name}"
            />
        </div>
        <div class="two-column">
            <input 
                type="text" 
                name="street" 
                id="street"
                placeholder="Street"
                value="${customer.street}"
            />
            <input 
                type="text" 
                name="address" 
                id="address"
                placeholder="Address"
                value="${customer.address}"
                />
            </div>
            <div class="two-column">
                <input 
                    type="text" 
                    name="city" 
                    id="city"
                    placeholder="City"
                    value="${customer.city}"
                />
            <input 
                type="text" 
                name="state" 
                id="state"
                placeholder="State"
                value="${customer.state}"
            />
        </div>
        <div class="two-column">
            <input 
                type="text" 
                name="email" 
                id="email"
                placeholder="Email"
                value="${customer.email}"
            />
            <input 
                type="text" 
                name="phone" 
                id="phone"
                placeholder="Phone"
                value="${customer.phone}"
            />
        </div>

        <div class="two-column">
            <button class="submit-btn" type="submit">Update</button>
        </div>`

    customer_form.innerHTML = output;
}


function fetch_customer_data(uuid) {
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
                addFormData(uuid)
                $('.loader').hide();
            },
            error: (error) => {
                toast('error-message', error.responseText.trim())
                $('.loader').hide();
            }
        })
    })
}

const getURLParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has('uuid')) {
        const uuid = searchParams.get('uuid');
        fetch_customer_data(uuid);
    }
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


jQuery(() => {
    $('.customer-form').on("submit", (event) => {
        const target = event.target;
        const token = JSON.parse(localStorage.getItem('token'));
        const newURL = url + `?cmd=update&uuid=${target['uuid'].value}`

        event.preventDefault();
        const data = {
            "uuid": target['uuid'].value,
            "first_name": target['first_name'].value,
            "last_name": target['last_name'].value,
            "street": target['street'].value,
            "address": target['address'].value,
            "city": target['city'].value,
            "state": target['state'].value,
            "email": target['email'].value,
            "phone": target['phone'].value,
            
        }

        if(data.first_name === '' || data.last_name === '') {
            toast('error-message', 'first name and last name is required!');
            return;
        }


        $('.loader').show();
        $.ajax({
            url: newURL,
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(data),
            success: (response) => {
                toast('success-message', response.trim());
                setTimeout(() => {
                    window.location = domain + '/customer_list.html';
                    $('.loader').hide();
                },2000)
            },
            error: (error) => {
                toast('error-message', error.responseText);
                $('.loader').hide();
            }
        })
    })
})

toastTimeOut();
window.addEventListener('load', getURLParams)