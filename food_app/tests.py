from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import Category, DeliveryAddress, Delivery, DeliveryPerson, Order, Product, UserProfile


class LoginRoleTests(TestCase):
    def test_admin_login_ajax_returns_admin_dashboard_redirect(self):
        user = User.objects.create_user(username="adminlogin", password="pass123")
        UserProfile.objects.create(user=user, role="admin")

        response = self.client.post(
            reverse("login"),
            {"username": "adminlogin", "password": "pass123"},
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["redirect_to"], "/admin-dashboard/")

    def test_delivery_login_ajax_returns_delivery_dashboard_redirect(self):
        user = User.objects.create_user(username="deliverylogin", password="pass123")
        UserProfile.objects.create(user=user, role="delivery")

        response = self.client.post(
            reverse("login"),
            {"username": "deliverylogin", "password": "pass123"},
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["redirect_to"], "/delivery-dashboard/")


class DeliveryAddressAjaxTests(TestCase):
    def test_user_dashboard_requires_login(self):
        response = self.client.get(reverse("user_dashboard"))

        self.assertEqual(response.status_code, 302)

    def test_delivery_user_is_redirected_from_customer_dashboard(self):
        user = User.objects.create_user(username="deliverydashboard", password="pass123")
        UserProfile.objects.create(user=user, role="delivery")
        self.client.force_login(user)

        response = self.client.get(reverse("user_dashboard"))

        self.assertRedirects(response, reverse("delivery_dashboard"))

    def test_admin_user_is_redirected_from_customer_dashboard(self):
        user = User.objects.create_user(username="admindashboard", password="pass123")
        UserProfile.objects.create(user=user, role="admin")
        self.client.force_login(user)

        response = self.client.get(reverse("user_dashboard"))

        self.assertRedirects(response, reverse("admin_dashboard"))

    def test_admin_can_add_inventory_item_from_dashboard(self):
        user = User.objects.create_user(username="admininventory", password="pass123")
        UserProfile.objects.create(user=user, role="admin")
        category = Category.objects.create(name="Desserts", slug="desserts")
        self.client.force_login(user)

        response = self.client.post(
            reverse("admin_dashboard"),
            {
                "inventory_action": "add",
                "name": "Chocolate Cake",
                "description": "Rich chocolate cake",
                "price": "6.50",
                "category": category.id,
                "available": "on",
            },
        )

        self.assertEqual(response.status_code, 302)
        self.assertTrue(Product.objects.filter(name="Chocolate Cake").exists())

    def test_delivery_user_is_redirected_from_cart(self):
        user = User.objects.create_user(username="deliverycart", password="pass123")
        UserProfile.objects.create(user=user, role="delivery")
        self.client.force_login(user)

        response = self.client.get(reverse("cart"))

        self.assertRedirects(response, reverse("delivery_dashboard"))

    def test_delivery_dashboard_shows_history_and_earnings(self):
        user = User.objects.create_user(username="deliveryhistory", password="pass123")
        UserProfile.objects.create(user=user, role="delivery")
        delivery_person = DeliveryPerson.objects.create(user=user, phone="5551234")
        customer = User.objects.create_user(username="customerhistory", password="pass123")

        completed_order = Order.objects.create(user=customer, total=Decimal("12.50"), status="Delivered")
        Delivery.objects.create(order=completed_order, delivery_person=delivery_person, status="delivered")

        active_order = Order.objects.create(user=customer, total=Decimal("8.00"), status="Pending")
        Delivery.objects.create(order=active_order, delivery_person=delivery_person, status="assigned")

        self.client.force_login(user)
        response = self.client.get(reverse("delivery_dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Total Earnings")
        self.assertContains(response, "Completed Deliveries")
        self.assertContains(response, "₹12.50")

    def test_user_dashboard_shows_summary_for_authenticated_user(self):
        user = User.objects.create_user(username="dashboarduser", password="pass123")
        UserProfile.objects.create(user=user, role="customer")
        self.client.force_login(user)

        response = self.client.get(reverse("user_dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dashboard")
        self.assertContains(response, user.username)

    def test_home_page_renders_global_csrf_token(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "csrfmiddlewaretoken")

    def test_add_to_cart_ajax_requires_login(self):
        category = Category.objects.create(name="Snacks", slug="snacks")
        product = Product.objects.create(
            category=category,
            name="Fries",
            price="3.50",
            available=True,
        )

        response = self.client.post(
            reverse("add_to_cart", args=[product.id]),
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.json()["success"])

    def test_add_delivery_address_ajax_returns_json_on_success(self):
        user = User.objects.create_user(username="ajaxuser", password="pass123")
        self.client.force_login(user)

        response = self.client.post(
            reverse("add_delivery_address"),
            {
                "street_address": "123 Main St",
                "city": "Testville",
                "postal_code": "12345",
                "phone": "5551234",
                "is_default": "on",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(DeliveryAddress.objects.filter(user=user).count(), 1)

    def test_add_delivery_address_ajax_returns_validation_errors(self):
        user = User.objects.create_user(username="ajaxuser2", password="pass123")
        self.client.force_login(user)

        response = self.client.post(
            reverse("add_delivery_address"),
            {
                "street_address": "",
                "city": "",
                "postal_code": "",
                "phone": "",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()["success"])
        self.assertIn("errors", response.json())

    def test_products_api_returns_available_products(self):
        category = Category.objects.create(name="Burgers", slug="burgers")
        Product.objects.create(
            category=category,
            name="Classic Burger",
            description="Tasty burger",
            price="5.99",
            available=True,
        )
        Product.objects.create(
            category=category,
            name="Hidden Burger",
            description="Not shown",
            price="6.99",
            available=False,
        )

        response = self.client.get(reverse("api_products"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)
        self.assertEqual(response.json()["products"][0]["name"], "Classic Burger")

    def test_addresses_api_requires_login(self):
        response = self.client.get(reverse("api_delivery_addresses"))

        self.assertEqual(response.status_code, 302)
