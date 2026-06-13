<?php

namespace App\Helpers;

class AuthUserHelper
{
    public static function getAuthUserAttribute($attribute)
    {
        return auth()->user()->$attribute;
    }
}
