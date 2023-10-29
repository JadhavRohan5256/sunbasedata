const toast_wrapper = document.querySelector('.toast-wrapper')
let url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';

jQuery(() => {
    $('.customer-form').on("submit", (event) => {
        const target = event.target;
        const token = JSON.parse(localStorage.getItem('token'));
        const newURL = url + '?cmd=create';
        event.preventDefault();
        const data = {
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
                $('.loader').hide();
                $('.customer-form')[0].reset();
            },
            error: (error) => {
                toast('error-message', error.responseText);
                $('.loader').hide();
            }
        })
    })
})


//toast
const toast = (messageType, messageDesc) => {
    const div = document.createElement("div");
    div.classList.add("toast", messageType);
    div.setAttribute('onClick', 'closeToast(this)')
    const p = document.createElement("p");
    p.classList.add('toast-message');
    p.textContent = messageDesc;
    div.appendChild(p);
    toast_wrapper.appendChild(div);
}

const toastTimeOut = () => {
    setInterval(() => {
        if (toast_wrapper.firstChild !== null) {
            toast_wrapper.removeChild(toast_wrapper.firstChild);
         }
    },3000)
}

const closeToast = (current) => {
    current.remove();
}


toastTimeOut();