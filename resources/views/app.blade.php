<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">

    <title>{{ config('app.name', 'Small E-Commerce') }}</title>

    @viteReactRefresh
    @vite(['resources/js/main.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>

