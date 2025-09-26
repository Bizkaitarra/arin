<?php

// Leer el archivo JSON de origen
$inputFile = 'paradas_kbus_original.json';
$outputFile = 'paradas_kbus.json';
$jsonData = file_get_contents($inputFile);
$data = json_decode($jsonData, true);

$paradasList = [];
$paradasMap = [];
$repetidos = [];

// Recorrer los datos para extraer la información de cada parada
foreach ($data as $linea) {
    $nombreLinea = $linea['nombre'];
    $labelBus = $linea['label'];

    foreach ($linea['rutas'] as $ruta) {
        $direccionRuta = $ruta['direccion'];
        $nombreRuta = $ruta['nombre'];

        foreach ($ruta['paradas'] as $parada) {
            $label = $parada['label'];

            if (!isset($paradasMap[$label])) {
                $paradasMap[$label] = [
                    'id' => $label,
                    'name' => $parada['nombre'],
                    'latitude' => $parada['coord']['lat'],
                    'longitude' => $parada['coord']['lon'],
                    'lines' => []
                ];
            }

            $paradasMap[$label]['lines'][] = [
                'lineName' => $nombreRuta,
                'direction' => $direccionRuta,
                'ruteName' => $nombreLinea,
                'bus' => $labelBus
            ];
        }
    }
}

// Convertir el mapa en una lista de paradas
$paradasList = array_values($paradasMap);

// Guardar el resultado en un nuevo archivo JSON
file_put_contents($outputFile, json_encode($paradasList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Archivo JSON generado correctamente: $outputFile\n";
?>
