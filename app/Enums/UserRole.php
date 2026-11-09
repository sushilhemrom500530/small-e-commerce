<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case ShopOwner = 'shop_owner';
    case Customer = 'customer';

    /**
     * Get all role values.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get user-assignable roles (excludes admin to prevent privilege escalation).
     *
     * @return list<string>
     */
    public static function assignableValues(): array
    {
        return [
            self::Customer->value,
            self::ShopOwner->value,
        ];
    }
}

