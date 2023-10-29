const toast_wrapper = document.querySelector('.toast-wrapper')
const url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
const domain = location.protocol + '//' + location.host;


jQuery(() => {
    $('#login-form').on("submit", (event) => {
        event.preventDefault();
        const login_id = event.target['login_id'].value;
        const password = event.target['password'].value;

        if(login_id === '' || password === '') {
            toast('error-message', 'Login Id and Password are required.')
            return;
        }

        let data = {
            "login_id" : login_id,
            "password" : password
        }
        data = JSON.stringify(data)

        $('.loader').show();
        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            success: (data) => {
                if(data?.access_token) {
                    localStorage.setItem('token', JSON.stringify(data.access_token))
                    toast('success-message', 'successfully login');
                    $('.loader').hide();
                    setTimeout(() => {
                        window.location = domain + '/customer_list.html';
                    },2000)
                    $('#login-form')[0].reset();
                }
            },
            error: (error) => {
                toast('error-message', error.responseText);
                $('.loader').hide();
            }
        })
        
    })
})

// toast 

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