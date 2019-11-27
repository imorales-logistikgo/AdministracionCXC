// <reference path="login-4.js" />
var jsonForgetForm = {
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {
        txtUsuarioContrasena: {
            required: true,
            email: true
        }
    },

    messages: {
        txtUsuarioContrasena: {
            required: "Email or user is required."
        }
    },

    invalidHandler: function (event, validator) { //display error alert on form submit

    },

    highlight: function (element) { // hightlight error inputs
        $(element)
            .closest('.form-group').addClass('has-error'); // set error class to the control group
    },

    success: function (label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
    },

    errorPlacement: function (error, element) {
        error.insertAfter(element.closest('.input-icon'));
    },

    submitHandler: function (form) {
        form.submit();
    }
};
var jsonLoginForm = {
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    rules: {
        txtUsuario: {
            required: true
        },
        txtContrasena: {
            required: true
        },
        remember: {
            required: false
        }
    },

    messages: {
        txtUsuario: {
            required: "El usuario es requerido"
        },
        txtContrasena: {
            required: "La contraseña es requerida"
        }
    },

    invalidHandler: function (event, validator) { //display error alert on form submit
        // $('.alert-danger', $('.login-form')).show();
    },

    highlight: function (element) { // hightlight error inputs
        $(element)
            .closest('.form-group').addClass('has-error'); // set error class to the control group
    },

    success: function (label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
    },

    errorPlacement: function (error, element) {
        error.insertAfter(element.closest('.input-icon'));
    },

    submitHandler: function (form) {
        submitUsuario();
    }
};
var Login = function () {

    var handleLogin = function () {
        $('.login-form').validate(jsonLoginForm);

        $('.login-form input').keypress(function (e) {
            //if (e.which == 13) {
            //    if ($('.login-form').validate().form()) {
            //        $('.login-form').submit();
            //    }
            //    return false;
            //}
        });
    }

    var handleForgetPassword = function () {

        $('.forget-form input').keypress(function (e) {
            //if (e.which == 13) {
            //    if ($('.forget-form').validate().form()) {
            //        $('.forget-form').submit();
            //    }
            //    return false;
            //}
        });

        jQuery('#forget-password').click(function () {
            jQuery('.login-form').hide();

            var loginForm = $('.login-form').validate();
            loginForm.destroy();
            $('.forget-form').validate(jsonForgetForm);

            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function () {
            jQuery('.login-form').show();

            var forgetForm = $('.forget-form').validate();
            forgetForm.destroy();
            $('.login-form').validate(jsonLoginForm);


            jQuery('.forget-form').hide();
        });

    }

    var handleRegister = function () {

        function format(state) {
            if (!state.id) { return state.text; }
            var $state = $(
                '<span><img src="../assets/global/img/flags/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
            );

            return $state;
        }

        if (jQuery().select2 && $('#country_list').size() > 0) {
            $("#country_list").select2({
                placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
                templateResult: format,
                templateSelection: format,
                width: 'auto',
                escapeMarkup: function (m) {
                    return m;
                }
            });


            $('#country_list').change(function () {
                $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }


        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                address: {
                    required: true
                },
                city: {
                    required: true
                },
                country: {
                    required: true
                },

                username: {
                    required: true
                },
                password: {
                    required: true
                },
                rpassword: {
                    equalTo: "#register_password"
                },

                tnc: {
                    required: true
                }
            },

            messages: { // custom messages for radio buttons and checkboxes
                tnc: {
                    required: "Please accept TNC first."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function (form) {
                form.submit();
            }
        });

        $('.register-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

    }



    return {
        //main function to initiate the module
        init: function () {

            handleLogin();
            handleForgetPassword();
            handleRegister();

            $('#txtUsuario').focus();

            // init background slide images
            $.backstretch([
                "/static/img/Login/Login-Final-camion-blur.jpg",
                "/static/img/Login/Login-Final-camion-regular.jpg",
                "/static/img/Login/LoginFinal_trailer_blur.jpg",
                "/static/img/Login/LoginFinal_Trailer_regular.jpg",
                "/static/img/Login/LoginFinal_Chofer_Blur.jpg",
                "/static/img/Login/LoginFinal_chofer_regular.jpg",
                "/static/img/Login/LoginFinal_xpress_blur.jpg",
                "/static/img/Login/LoginFinal_xpress_regular.jpg",
            ], {
                    fade: 3000,
                    duration: 1000
                }
            );
        }
    };

}();

jQuery(document).ready(function () {
    Login.init();
});
