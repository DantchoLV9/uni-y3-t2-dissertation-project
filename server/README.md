# Server / Backend API

This is the server or the backend API that is used for the photography social media website. It uses PHP Laravel with a MySQL database.

## Installation

-   Install composer dependencies:

```bash
composer install
```

-   Make an `.env` file:

```bash
cp .env.example .env
```

-   Generate an encryption key:

```bash
php artisan key:generate
```

-   Set up `.env` variables:
    -   `APP_NAME` should be the application name.
    -   `APP_URL` should be the server URL.
    -   `FRONTEND_URL` should be the client URL.
    -   Database variables are self explanatory.

## For production

Steps from [installation](#installation) section above plus:

-   Change `.env` variables:
    -   `APP_ENV` to `production`
    -   `APP_DEBUG` to `false`

## Development server

```bash
php artisan serve
```
