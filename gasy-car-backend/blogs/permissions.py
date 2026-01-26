from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Lecture pour tout le monde
    Écriture uniquement pour admin/staff
    """

    def has_permission(self, request, view):
        # Autorise GET, HEAD, OPTIONS pour tous
        if request.method in permissions.SAFE_METHODS:
            return True

        # Autorise POST, PUT, PATCH, DELETE seulement aux staff/admin
        return bool(request.user and request.user.is_staff)
