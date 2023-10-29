const theme_wrapper = document.querySelector('.theme-wrapper');
const root = document.querySelector(':root');
const icon = document.querySelector('.icon');

const light = () => {
  root.style.setProperty('--bg-color', '#f1f1f1');
  root.style.setProperty('--bg-surface', '#ffffff');
  root.style.setProperty('--text-color', '#424242');
  root.style.setProperty('--shadow-color', '#2f2b3d29');
  theme_wrapper.innerHTML = '<i class="fa-solid fa-moon" id="icon" onClick="changeTheme()"></i>';
}

const dark = () => {
  root.style.setProperty('--bg-color', '#121212');
  root.style.setProperty('--bg-surface', '#313131');
  root.style.setProperty('--text-color', '#ffffff');
  root.style.setProperty('--shadow-color', '#d0d4f129');
  theme_wrapper.innerHTML = '<i class="fa-solid fa-sun rotate" id="icon" onClick="changeTheme()"></i>';
}


const applyTheme = () => {
    let storage = JSON.parse(localStorage.getItem('isDark'));
    if(storage === undefined || storage === null) {
        localStorage.setItem('isDark', JSON.stringify(false));
        storage = JSON.parse(localStorage.getItem('isDark'))
    }
    
    if(storage === true) {
        dark();
    }
    else {
        light();
    }
}


const changeTheme = () => {
    let storage = JSON.parse(localStorage.getItem('isDark'));
    if(storage === false) {
        dark();
        localStorage.setItem('isDark', JSON.stringify(true))
    }
    else {
        light();
        localStorage.setItem('isDark', JSON.stringify(false))
    }
}

window.addEventListener('load', applyTheme);