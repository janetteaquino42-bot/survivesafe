<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Forbidden | Art Carousel</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(44, 62, 80, 0.75) 0%, rgba(52, 73, 94, 0.85) 100%), url('/images/forum-header-bg.jpg') center/cover;
            background-attachment: fixed;
            color: white;
            padding: 20px;
            position: relative;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }

        .container {
            text-align: center;
            max-width: 600px;
            position: relative;
            z-index: 2;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 50px 30px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo {
            width: 100px;
            height: 70px;
            margin: 0 auto 30px;
            animation: fadeIn 0.6s ease-in;
            display: flex;
            justify-content: center;
            gap: 30px;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .error-code {
            font-size: 120px;
            font-weight: bold;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #3498db, #2ecc71);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.8s ease-in;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 15px;
            color: #ecf0f1;
            animation: fadeIn 1s ease-in;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
            color: #bdc3c7;
            animation: fadeIn 1.2s ease-in;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            padding: 14px 35px;
            background: linear-gradient(135deg, #3498db, #2ecc71);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            animation: fadeIn 1.4s ease-in;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
        }

        .icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .brand-name {
            font-size: 14px;
            color: #95a5a6;
            margin-top: 30px;
            font-weight: 500;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-20px);
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 40px 20px;
            }

            .error-code {
                font-size: 80px;
            }

            h1 {
                font-size: 24px;
            }

            p {
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo ">
            <img src="/images/AC_LOGO_WHITE.png" alt="Art Carousel Logo"style="width: 100px">
            <img src="/images/ccc_logo.png" alt="Cavite Creative Community Logo" width="100px">
        </div>
        <div class="icon">🎨</div>
        <div class="error-code">403</div>
        <h1>Invalid Access</h1>
        <p>This page is private or requires special access. Please check your credentials or contact us for
            access.</p>
        <a href="/" class="btn">Return to Home</a>
        <div class="brand-name">Art Carousel</div>
    </div>
</body>

</html>
