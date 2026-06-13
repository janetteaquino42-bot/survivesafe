<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- <!-- Primary Meta Tags -->
    <meta name="title" content="{{ config('app.name') }} - Promoting Local Artists Within Cavite">
    <meta name="description" content="A Cavite-based platform built to uplift and showcase local artists">
    <meta name="keywords"
        content="art gallery, online art marketplace, Filipino artists, artworks, paintings, sculptures, digital art, art materials, art exhibits, creative community">
    <meta name="author" content="{{ config('app.name') }}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:title" content="{{ config('app.name') }} - Promoting Local Artists Within Cavite">
    <meta property="og:description" content="A Cavite-based platform built to uplift and showcase local artists">
    <meta property="og:image" content="{{ asset('images/seo-thumbnail.jpg') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ config('app.name') }} Logo">
    <meta property="og:site_name" content="{{ config('app.name') }}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ config('app.url') }}">
    <meta name="twitter:title" content="{{ config('app.name') }} - Promoting Local Artists Within Cavite">
    <meta name="twitter:description" content="A Cavite-based platform built to uplift and showcase local artists">
    <meta name="twitter:image" content="{{ asset('images/seo-thumbnail.jpg') }}">
    <meta name="twitter:image:alt" content="{{ config('app.name') }} Logo">

    <!-- Additional Meta Tags -->
    <meta name="theme-color" content="#1a202c">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ config('app.url') }}"> --}}

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    {{-- <link rel="icon" href="{{ asset('favicon.ico') }}"> --}}
    <!-- Scripts -->
    @routes
    @production
        <link rel="stylesheet" href="{{ asset('build/assets/app-D3yfvd3H.css') }}">
        {{-- <link rel="stylesheet" href="{{ asset('build/assets/zoom-83rC1iuP.css') }}"> --}}
        <script type="module" src="{{ asset('build/assets/app-BjXJfs3E.js') }}"></script>
    @else
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @endproduction
    @inertiaHead
</head>

<body class="font-sans antialiased text-gray-700">
    @inertia
</body>

</html>
