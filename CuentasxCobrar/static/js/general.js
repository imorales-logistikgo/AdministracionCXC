class Route {

    constructor(entorno) {
        if (entorno === "DEBUG") {

            this.logistikgo = 'https://api-debug.logistikgo.com/';
            this.logistikgoAdmon = 'https://logistikgo.com/admon-demo/api/';
            this.pusher = 'https://pusher-triggers-demo.azurewebsites.net/api';
        }
        else if (entorno === "DEMO") {

            this.logistikgo = 'https://api-debug.logistikgo.com/';
            this.logistikgoAdmon = 'https://logistikgo.com/admon-demo/api/';
            this.pusher = 'https://pusher-triggers-demo.azurewebsites.net/api';
        }
        else if (entorno === "PRODUCCION") {
            this.logistikgo = 'https://api.logistikgo.com/';
            this.logistikgoAdmon = 'https://logistikgo.com/admon-produccion/api';
            this.pusher = 'https://pusher-triggers-demo.azurewebsites.net/api';
        }
    }
}