const routeAPI = new Route(getCookie('Entorno'));

//initCookieEntorno();
loadScripts();

async function loadScripts() {
    let response = await fetch(`../Files/scripts.json`);
    let scripts = await response.json();
    let _version = "8.0";

    for (var item of scripts) {

        let script = document.createElement('script');

        script.setAttribute('src', `${item.name}?v=${_version}`);
        script.defer = true;
        script.async = false;

        document.head.appendChild(script);
    }

}