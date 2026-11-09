<?php

use App\Enums\UserRole;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default(UserRole::Customer->value)->index()->after('password');
            $table->string('phone_number')->nullable()->after('role');
            $table->string('gender')->nullable()->after('phone_number');
            $table->text('address')->nullable()->after('gender');
            $table->text('profile_url')->nullable()->after('address');
            $table->string('service_name')->nullable()->after('profile_url');
            $table->string('service_lisence')->nullable()->after('service_name');
            $table->string('status')->default('active')->index()->after('service_lisence');
            $table->boolean('is_verified')->default(true)->after('status');
            $table->boolean('is_deleted')->default(false)->after('is_verified');
            $table->boolean('is_profile_completed')->default(false)->after('is_deleted');
            $table->string('provider')->nullable()->after('is_profile_completed');
            $table->string('provider_id')->nullable()->index()->after('provider');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'phone_number',
                'gender',
                'address',
                'profile_url',
                'service_name',
                'service_lisence',
                'status',
                'is_verified',
                'is_deleted',
                'is_profile_completed',
                'provider',
                'provider_id',
            ]);
        });
    }
};
