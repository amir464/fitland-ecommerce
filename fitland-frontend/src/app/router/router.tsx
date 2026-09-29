import { createBrowserRouter } from 'react-router'

import { StorefrontLayout } from '@/app/layouts/storefront/StorefrontLayout'
import { RouteErrorPage } from '@/app/router/RouteErrorPage'
import {
  GuestOnlyRoute,
  ProtectedRoute,
} from '@/features/auth/ui/AuthRouteGuards'
import {
  CHECKOUT_ROUTE_PATH,
  ORDER_SUCCESS_ROUTE_PATH,
  PRODUCT_DETAILS_ROUTE_PATH,
} from '@/shared/config/routePaths'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StorefrontLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/home/ui/HomePage'),
      },
      {
        path: 'shop',
        lazy: () => import('@/pages/shop/ui/ShopPage'),
      },
      {
        path: PRODUCT_DETAILS_ROUTE_PATH,
        lazy: () => import('@/pages/product-details/ui/ProductDetailsPage'),
      },
      {
        path: 'men',
        lazy: () => import('@/pages/men/ui/MenPage'),
      },
      {
        path: 'women',
        lazy: () => import('@/pages/women/ui/WomenPage'),
      },
      {
        path: 'collections',
        lazy: () => import('@/pages/collections/ui/CollectionsPage'),
      },
      {
        path: 'account',
        lazy: () => import('@/pages/account/ui/AccountPage'),
      },
      {
        element: <GuestOnlyRoute />,
        children: [
          {
            path: 'login',
            lazy: () => import('@/pages/login/ui/LoginPage'),
          },
          {
            path: 'register',
            lazy: () => import('@/pages/register/ui/RegisterPage'),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRole="customer" />,
        children: [
          {
            path: 'account/dashboard',
            lazy: () =>
              import('@/pages/account-dashboard/ui/AccountDashboardPage'),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRole="admin" />,
        children: [
          {
            path: 'admin/dashboard',
            lazy: () =>
              import('@/pages/admin-dashboard/ui/AdminDashboardPage'),
          },
        ],
      },
      {
        path: 'wishlist',
        lazy: () => import('@/pages/wishlist/ui/WishlistPage'),
      },
      {
        path: 'cart',
        lazy: () => import('@/pages/cart/ui/CartPage'),
      },
      {
        path: CHECKOUT_ROUTE_PATH,
        lazy: () => import('@/pages/checkout/ui/CheckoutPage'),
      },
      {
        path: ORDER_SUCCESS_ROUTE_PATH,
        lazy: () => import('@/pages/order-success/ui/OrderSuccessPage'),
      },
      {
        path: '*',
        lazy: () => import('@/pages/not-found/ui/NotFoundPage'),
      },
    ],
  },
])
