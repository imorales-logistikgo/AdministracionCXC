$(function () {
    formInputMask();
    setAlertaTipoAcceso();

    $('#formRegister').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: true, // do not focus the last invalid input
        ignore: ":hidden", // ignore hidden elements when validating
        rules: {
            correo: { required: true, email: true },
            ncomercial: { required: true },
            razonsocial: { required: true },
            rfc: { required: true },
            ncbotipo: { required: true }
            //txtCorreo: { required: true, email: true }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass('has-error'); // set error class to the control group
        },
        success: function (label) {
            label
                .closest('.form-group').removeClass('has-error'); // set success class to the control group
        },
        submitHandler: function () {
            submitForm();
        }
    });


    $('#btnEnviarContrasena').click(function () {
        EnviarContrasena();
    });

    $('#btnGuardarRegistro').on('click', 'button', function () {

        $("#formRegister").valid();

    });

    $('#register-back-btn').on('click', 'button', function () {
        $("#formRegister").trigger('reset');
        $('#formRegister > div').removeClass('has-error');
        $('span.help-block-error').remove();
    });

    $('#register-back-btn').click(function () {
        $('.login-form').show();
        $('.register-form').hide();
    });

    //primer paso
    $('#linkRegistrar').click(function () {
        $('.login-form').hide();
        $('.register-form').show();
    });
    //Tercer paso
    $('#btnEncuesta').click(function () {
        $('.mensaje-encuesta').hide();
        $('.encuesta-form').show();
        if ($('#selectTipo').val() == 'Cliente') {
            $('#divCliente').removeClass('hidden');
            $('#divCliente').show();
        }

        else if ($('#selectTipo').val() == 'Transportista') {
            $('#divTransportista').removeClass('hidden');
            $('#divTransportista').show();
        }
    });
    //Cuarto paso
    $('#btnGuardarEncuesta').on('click', function () {
        submitEncuesta();
    });
    //Quinto paso
    $('#btnFinalizar').on('click', function () {
        $('.mensajefinalizar-form').hide();
        $('.login-form').show();
    });

    $('[data-toggle="popover"]').popover();


    $("#txtNuevaContraseña").bootstrapStrength({
        minLenght: 8,
        upperCase: 1,
        lowerCase: 1,
        numbers: 1,
        specialchars: 1
    });

    $("#txtConfirmarContraseña").bootstrapStrength({
        minLenght: 8,
        upperCase: 1,
        lowerCase: 1,
        numbers: 1,
        specialchars: 1
    });

    $('#btnActualizarContraseña').click(function () {
        if (!$('div.progress-bar').hasClass('progress-bar-success')) {
            let alert_message = "Please strengthen password"
            snackbar({
                type: enum_type_snackbar.warning,
                text: alert_message
            });
            $("#txtNuevaContraseña").focus();

        }
        else if ($('div.progress-bar').hasClass('progress-bar-success') && ($("#txtConfirmarContraseña").val() != $("#txtNuevaContraseña").val())) {
            let alert_message = "Passwords do not match"
            snackbar({
                type: enum_type_snackbar.warning,
                text: alert_message
            });
            $("#txtNuevaContraseña").focus();
            $("#txtConfirmarContraseña").focus()

        }
        else {
            _updateContrasena();
        }

    });

    $("#btnCerrarActualizarContrasena").click(function () {
        let alert_message = "You can reset your password later. See you then!"
        snackbar({
            type: enum_type_snackbar.warning,
            text: alert_message
        });

        WaitMe_Show($("#divLogin"));
        setTimeout(function () {
            WaitMe_Hide($("#divLogin"));
            window.location.href = '/Bro_Tablero_Control.aspx';
        }, 3000);
    });

    //$(".glyphicon-eye-open").mousedown(function () {
    //    $("#passwordfield").attr('type', 'text');
    //}).mouseup(function () {
    //    $("#passwordfield").attr('type', 'password');
    //}).mouseout(function () {
    //    $("#passwordfield").attr('type', 'password');
    //});

    //eye password
    $("#txtNuevaContraseña").password();
    $("#txtConfirmarContraseña").password();

    $("#mdActualizarContraseña").on('shown.bs.modal', function () {
        $("[data-toggle='popover']").popover('show');
    });
});

function submitUsuario() {
    var fnSuccess = (data) => {

        var IsUsuarioExistente = (data.d) != '';

        if (IsUsuarioExistente) {
            let jsonData = JSON.parse(data.d);
            //   ----------------------------- Inicio de Cambio de contraseña  -----------------------------------
            //if ((jsonData.PeriodoLimite - jsonData.PeriodoActual) <= 0 || jsonData.FechaCambioContrasena == "" || jsonData.IsCambioContrasena) {
            //    $("#mdActualizarContraseña").modal('show');
            //    $("#lblTiempoExpiracion").html('');
            //    $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
            //    $("#lblTiempoExpiracion").html(`Last change password: ${jsonData.FechaCambioContrasena}`);
            //    $("#btnCerrarActualizarContrasena").remove();
            //} else if ((jsonData.PeriodoLimite - jsonData.PeriodoActual) < 9) {
            //    $("#lblTiempoExpiracion").html('');
            //    $("#mdActualizarContraseña").modal('show');
            //    $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
            //    $("#lblTiempoExpiracion").html(`Last change password: ${jsonData.FechaCambioContrasena}`);
            //} else {
            //    window.location.href = '/Bro_Tablero_Control.aspx';
            //}

            var diasSugerencia = 3;
            $("#btnCerrarActualizarContrasena").show();
            if ((jsonData.PeriodoLimite - jsonData.PeriodoActual) <= 0 || jsonData.FechaCambioContrasena == "" || jsonData.IsCambioContrasena || jsonData.PeriodoActual > jsonData.PeriodoLimite) {
                $("#btnCerrarActualizarContrasena").hide();
            } else if (!jsonData.IsCambioContrasena && ((jsonData.PeriodoLimite - jsonData.PeriodoActual) >= diasSugerencia)) {
                window.location.href = '/Bro_Tablero_Control.aspx';
                return;
            }

            $("#mdActualizarContraseña").modal('show');
            $("#mdActualizarContraseña .modal-body").css("overflow-y", "unset");
            $("#lblTiempoExpiracion").html('');
            $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
            $("#lblTiempoExpiracion").html(`Last change password: ${jsonData.FechaCambioContrasena}`);


            //   ----------------------------- Fin de Cambio de contraseña  -----------------------------------

            //   ----------------------------- Sin validar cambio de contraseña  -----------------------------------
            //window.location.href = '/Bro_Tablero_Control.aspx';
            //   ----------------------------- Sin validar cambio de contraseña  -----------------------------------

        } else {
            //Contrasena incorrecta
            $("#divAlert").removeClass("display-hide").addClass("alert-danger");
            $("#lblErrorAlert").text("Usuario y/o contraseña incorrecta");
            $("#divAlert").css("display", "block");
        }

        WaitMe_Hide($("#divLogin"));
    };

    var jParams = {
        strUsuario: $("#txtUsuario").val(),
        strContrasena: $("#txtContrasena").val()
    };

    var fnBeforeSend = () => {
        if (!($('#divAlert').hasClass("display-hide"))) {
            $('#divAlert').addClass("display-hide");
        }

        WaitMe_Show($("#divLogin"));
    };

    var fnError = (data) => {
        var jData = $.parseJSON(data.responseText);
        let alert_message = $.parseJSON(jData.Message);

        if (alert_message.TipoExcepcion == 'UsuarioProyectoInvalido') {
            $("#divAlert").removeClass("display-hide").addClass("alert-warning").removeClass("alert-danger");
            $("#lblErrorAlert").text(alert_message.Mensaje);
        } else if (alert_message.TipoExcepcion == 'ContrasenaUsuarioInvalido') {
            $('#divAlert').removeClass("display-hide").addClass("alert-danger").removeClass("alert-warning");
            $("#lblErrorAlert").text(alert_message.Mensaje);
        } else {
            snackbar({
                type: enum_type_snackbar.error,
                text: `System error. Consult your manager`
            });
        }

        WaitMe_Hide($("#divLogin"));
    };

    loginUsuario(fnSuccess, jParams, fnBeforeSend, fnError);
}

function loginUsuario(fnSuccess, jParams, fnBeforeSend, fnError) {
    $.ajax({
        url: "Login.aspx/LoginUsuario",
        data: JSON.stringify(jParams),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        beforeSend: fnBeforeSend,
        success: fnSuccess,
        error: fnError
    });
}

function displayAlert() {
    $('#divAlert').removeClass('display-hide');
};

function displayAlertProyecto() {
    $('#divAlertProyecto').removeClass('display-hide');
};

function WaitMe_Show(idForm) {
    $(idForm).waitMe(
        {
            effect: 'ios',
            text: 'Please wait...',
            bg: 'rgb(255,255,255)',
            color: '#38227F',
            sizeW: '',
            sizeH: '',
            source: ''
        });
};

function WaitMe_Hide(idForm) {
    $(idForm).waitMe('hide');
};

function submitForm() {
    //WaitMe_Show('#divLogin');
    var params = {
        Correo: $('#txtCorreo').val(),
        NombreComercial: $('#txtNombreComercial').val(),
        RazonSocial: $('#txtRazonSocial').val(),
        RFC: $('#txtRFC').val(),
        Tipo: $('#selectTipo').val(),
    }
    var paramJSon = JSON.stringify(params);

    $.ajax({
        type: 'POST',
        url: getRutaApi() + 'api/Cliente/SavePreregistro',
        data: paramJSon,
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (data) {
            WaitMe_Hide('#divLogin');
            $('#HFTipoUsuario').val($('#selectTipo').val());
            //$("#formRegister").trigger('reset');
            swal({
                title: "Registro guardado correctamente",
                text: "En breve te contactaremos",
                type: "success",
                confirmButtonText: "Ok"
            });
            $('.mensaje-encuesta').show();
            $('.register-form').hide();

        },
        error: function (data) {
            WaitMe_Hide('#divLogin');
            var dataError = $.parseJSON(data.responseText);
            swal({
                title: "¡Error!",
                text: dataError.Message,
                type: "error",
            });
            $('.register-form').show();
        },
    });
}

function submitEncuesta() {
    var params = {
        strEmbarques: $('#selectEmbarque').val(),
        strContacto: $('#selectMedioComunicacion').val(),
        strFlotilla: $('#selectFlotilla').val(),
        strTipo: $('#selectTipo').val(),
    }

    var paramJSon = JSON.stringify(params);

    $.ajax({
        type: 'POST',
        url: 'Login.aspx/SaveEncuesta',
        data: paramJSon,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function () {
            $('.encuesta-form').hide();
            $('.mensajefinalizar-form').show();
        },
        error: function (data) {
            var dataError = $.parseJSON(data.responseText);
            swal({
                title: "¡Error!",
                text: dataError.Message,
                type: "error",
            });
        },

    });
}

function formInputMask() {
    $('.telefono').inputmask("mask", {
        mask: "(999) 999-9999"
    });

    $('.cuentaBancaria').inputmask("mask", {
        mask: "9999-9999-9999-9999-9999"
    });

    $('.clabeinterbancaria').inputmask("mask", {
        mask: "999-999-99999999999-9"
    });

    $('.rfc').inputmask('mask', {
        mask: 'a{3,4} 999999 ****',
        placeholder: "" // remove underscores from the input mask
    });

    $('.peso').inputmask('numeric', {
        min: 0,
        max: 28000,
        placeholder: "" // remove underscores from the input mask
    });
}

function setAlertaTipoAcceso() {
    if ($('#HFTipoAcceso').val() == "DEBUG") {
        $('#divAlertDebug').show();
    }
    else if ($('#HFTipoAcceso').val() == "DEMO") {
        $('#divAlertDemo').show();
    }
}

function getRutaApi() {
    var strRutaApi = "";

    if ($('#HFTipoAcceso').val() == "DEBUG") {
        strRutaApi = 'https://api-debug.logistikgo.com/';
    }
    else if ($('#HFTipoAcceso').val() == "DEMO") {
        strRutaApi = "https://api-test.logistikgo.com/";
    }
    else if ($('#HFTipoAcceso').val() == "PRODUCCION") {
        strRutaApi = "https://api.logistikgo.com/";
    }

    return strRutaApi;
}



function EnviarContrasena() {

    if ($('#txtUsuarioContrasena').val() == '') {
        $('#txtUsuarioContrasena').closest('.form-group').addClass('has-error');

    } else {

        var jParams = {
            strUsuarioContrasena: $('#txtUsuarioContrasena').val()
        };

        var fnBeforeSend = function () {
            WaitMe_Show($('#divLogin'));
        };

        var fnSuccess = function () {

            WaitMe_Hide($('#divLogin'));
            $('#divAlertInexistente').addClass('display-hide');
            $("#txtUsuarioContrasena").closest('.form-group').removeClass('has-error');

            $('.forget-form').hide();

            var forgetForm = $('.forget-form').validate();
            forgetForm.destroy();
            $('.login-form').validate(jsonLoginForm);

            $('.login-form').show();

            $("#divAlertCorreo").removeClass("display-hide");
        }

        var fnError = function () {
            WaitMe_Hide($('#divLogin'));
            $('#txtUsuarioContrasena').closest('.form-group').addClass('has-error');
            $('#divAlertInexistente').removeClass('display-hide');
        };
       // "use strict";
        restablecerContrasena(fnSuccess, jParams, fnBeforeSend, fnError);
    }
}


// Cambio de contraseña (Funcion anterior)
//function validaAcceso() {

//    let fnSuccess = function (data) {
//        var jsonData = JSON.parse(data.d);

//        var periodoTemp = 8;
//        var isCambioContrasena = false;

//        if (jsonData.FechaCambioContrasena != null) {
//            $("#mdActualizarContraseña").modal('show');
//            $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
//            $("#lblTiempoExpiracion").html($("#lblTiempoExpiracion").html() + `${jsonData.TiempoExpiracion}`);

//        } else if (periodoTemp <= 0) {
//            $("#mdActualizarContraseña").modal('show');
//            $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
//            $("#lblTiempoExpiracion").html($("#lblTiempoExpiracion").html() + `${jsonData.TiempoExpiracion}`);
//            $("#btnCerrarActualizarContrasena").remove();
//        }
//        else if ((periodoTemp - 9) < 0 || isCambioContrasena) {
//            $("#mdActualizarContraseña").modal('show');
//            $("#txtcurrentUsuario").val(jsonData.NombreUsuario).data("IDUsurio", jsonData.IDUsuario);
//            $("#lblTiempoExpiracion").html($("#lblTiempoExpiracion").html() + `${jsonData.TiempoExpiracion}`);
//        } else {
//            window.location.href = '/Bro_Tablero_Control.aspx';
//        }

//    };

//    let fnError = function (data) {
//        var jData = $.parseJSON(data.responseText);
//        let alert_message = `${jData.Message}. System error, consult your manager`;

//        snackbar({
//            type: enum_type_snackbar.error,
//            text: alert_message
//        });
//    };

//    getUsuario(fnSuccess, fnError);
//}
