<?php

// Leer el contenido del archivo JSON
$jsonData = file_get_contents(__DIR__ . '/paradas_api.json');

// Decodificar el JSON a un array de PHP
$paradas = json_decode($jsonData, true);

// Verificar si la decodificación fue exitosa
if (!is_array($paradas)) {
    echo json_last_error_msg();
    die("Error al leer el archivo JSON");
}

// Transformar los datos
$paradasFiltradas = array_map(function ($parada) {
    return [
        'PROVINCIA' => $parada['PROVINCIA'],
        'DESCRIPCION_PROVINCIA' => $parada['DESCRIPCION_PROVINCIA'],
        'MUNICIPIO' => $parada['MUNICIPIO'],
        'DESCRIPCION_MUNICIPIO' => $parada['DESCRIPCION_MUNICIPIO'],
        'PARADA' => $parada['CODIGOREDUCIDOPARADA'], // Renombrado de CODIGOREDUCIDOPARADA a PARADA
        'DENOMINACION' => $parada['DENOMINACION'],
        'DIRECCION' => $parada['DIRECCION'],
        'COORDX' => $parada['COORDX'],
        'COORDY' => $parada['COORDY'],
        'LATITUD' => $parada['LATITUD'],
        'LONGITUD' => $parada['LONGITUD'],
    ];
}, $paradas);

file_put_contents(__DIR__ . '/src/data/paradas.json', json_encode($paradasFiltradas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));