class AuthRouter:
    """
    A router to control all database operations on models in the
    auth and contenttypes applications.
    """
    route_app_labels = {'usersadmon', 'EstadosdeCuenta', 'PendienteEnviar'}
    route_app_labels_bkg = {'bkg_viajes'}
    route_app_labels_XD = {'XD_Viajes'}

    def db_for_read(self, model, **hints):
        """
        Attempts to read auth and contenttypes models go to auth_db.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'users'
        if model._meta.app_label in self.route_app_labels_bkg:
            return 'bkg_viajesDB'
        if model._meta.app_label in self.route_app_labels_XD:
            return 'XD_ViajesDB'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth and contenttypes models go to auth_db.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'users'
        if model._meta.app_label in self.route_app_labels_bkg:
            return 'bkg_viajesDB'
        if model._meta.app_label in self.route_app_labels_XD:
            return 'XD_ViajesDB'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the auth or contenttypes apps is
        involved.
        """
        if (
            obj1._meta.app_label in self.route_app_labels or
            obj2._meta.app_label in self.route_app_labels
        ):
           return True
        if (
            obj1._meta.app_label in self.route_app_labels_bkg or
            obj2._meta.app_label in self.route_app_labels_bkg
        ):
            return True
        if (
            obj1._meta.app_label in self.route_app_labels_XD or
            obj2._meta.app_label in self.route_app_labels_XD
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the auth and contenttypes apps only appear in the
        'auth_db' database.
        """
        if app_label in self.route_app_labels:
            return db == 'users'
        if app_label in self.route_app_labels_bkg:
            return db == 'bkg_viajesDB'
        if app_label in self.route_app_labels_XD:
            return db == 'XD_ViajesDB'
        return None
