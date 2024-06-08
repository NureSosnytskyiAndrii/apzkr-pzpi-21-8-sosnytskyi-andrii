<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSensorDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id('reading_id');
            $table->string('type')->nullable();
            $table->string('value')->nullable();
            $table->timestamp('created')->nullable();
            $table->unsignedBigInteger('health_reading_id')->nullable();
            $table->timestamps();

            $table->index('health_reading_id', 'health_reading_id_idx');

            $table->foreign('health_reading_id', 'data_health_reading_id_fk')->references('health_reading_id')->on('health_readings');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sensor_data');
    }
}
