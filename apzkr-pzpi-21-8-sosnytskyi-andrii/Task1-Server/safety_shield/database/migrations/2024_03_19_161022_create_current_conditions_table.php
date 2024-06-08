<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrentConditionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('current_conditions', function (Blueprint $table) {
            $table->id('condition_id');
            $table->string('status')->nullable();
            $table->string('notes')->nullable();
            $table->unsignedBigInteger('organization_id')->nullable();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->timestamps();

            $table->index('organization_id', 'organization_id_idx');
            $table->index('employee_id', 'employee_id_idx');
            $table->index('location_id', 'location_id_idx');

            $table->foreign('organization_id', 'current_organization_id_fk')->on('organizations')->references('organization_id');
            $table->foreign('employee_id', 'current_employee_id_fk')->on('employees')->references('employee_id');
            $table->foreign('location_id', 'current_location_id_fk')->on('current_locations')->references('location_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('current_conditions');
    }
}
