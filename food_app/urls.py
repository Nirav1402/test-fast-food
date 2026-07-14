from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("menu/", views.product_list, name="product_list"),
    path("cart/", views.cart, name="cart"),
    path("checkout/", views.checkout, name="checkout"),

    path("place-order/", views.place_order, name="place_order"),  # ⭐ ADD THIS

    path("login/", views.user_login, name="login"),
    path("logout/", views.user_logout, name="logout"),
    path("register/", views.user_register, name="register"),
    path("dashboard/", views.user_dashboard, name="user_dashboard"),
    path("admin-dashboard/", views.admin_dashboard, name="admin_dashboard"),
    path("assign-delivery/<int:order_id>/", views.assign_delivery_person, name="assign_delivery_person"),
    path("delivery-dashboard/", views.delivery_dashboard, name="delivery_dashboard"),
    path("accept-delivery/<int:delivery_id>/", views.accept_delivery, name="accept_delivery"),
    path("mark-delivered/<int:delivery_id>/", views.mark_delivery_delivered, name="mark_delivery_delivered"),
    path("add-to-cart/<int:product_id>/", views.add_to_cart, name="add_to_cart"),
    path("remove-from-cart/<int:product_id>/", views.remove_from_cart, name="remove_from_cart"),

    path("product/<int:product_id>/", views.product_detail, name="product_detail"),
    
    # Delivery System URLs
    path("delivery-addresses/", views.delivery_addresses, name="delivery_addresses"),
    path("add-delivery-address/", views.add_delivery_address, name="add_delivery_address"),
    path("edit-delivery-address/<int:address_id>/", views.edit_delivery_address, name="edit_delivery_address"),
    path("delete-delivery-address/<int:address_id>/", views.delete_delivery_address, name="delete_delivery_address"),
    
    # Order & Tracking URLs
    path("order/<int:order_id>/", views.order_detail, name="order_detail"),
    path("order-status/<int:order_id>/", views.order_status, name="order_status"),
    path("order-history/", views.order_history, name="order_history"),
    path("track-order/<int:order_id>/", views.track_order, name="track_order"),
    path("api/delivery-status/<int:order_id>/", views.delivery_status_api, name="delivery_status_api"),
    path("api/products/", views.api_products, name="api_products"),
    path("api/delivery-addresses/", views.api_delivery_addresses, name="api_delivery_addresses"),
    path("api/orders/", views.api_orders, name="api_orders"),
    path("api/deliveries/", views.api_deliveries, name="api_deliveries"),
    path("react/", views.react_app, name="react_app"),
]

