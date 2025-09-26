<?php
// Configuración del directorio
$directory = __DIR__; // Directorio actual
$dbName = 'metro-scheduled.db'; // Nombre de la base de datos SQLite

// Crea una nueva base de datos SQLite
$db = new PDO('sqlite:' . $dbName);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ficheros a procesar
$files = [
    'agency.txt', 'calendar_dates.txt', 'fare_rules.txt', 'shapes.txt', 'stops.txt',
    'calendar.txt', 'fare_attributes.txt', 'routes.txt', 'stop_times.txt', 'trips.txt'
];

// Itera sobre cada fichero
foreach ($files as $file) {
    $filePath = $directory . '/' . $file;

    if (file_exists($filePath)) {
        // Lee el contenido del fichero
        $data = array_map('str_getcsv', file($filePath));

        // Si el archivo no está vacío, crea la tabla
        if (!empty($data)) {
            // La primera línea es el encabezado
            $columns = array_map('strtolower', $data[0]); // Convertir los nombres de las columnas a minúsculas
            $tableName = basename($file, '.txt'); // Nombre de la tabla (sin la extensión .txt)

            // Crear la tabla en SQLite
            $columnsSql = [];
            foreach ($columns as $column) {
                $columnsSql[] = "$column TEXT"; // Asumimos que todos los datos son de tipo texto
            }
            $columnsSql = implode(', ', $columnsSql);
            $createTableSql = "CREATE TABLE IF NOT EXISTS $tableName ($columnsSql)";
            $db->exec($createTableSql);

            // Insertar los datos en la tabla
            array_shift($data); // Eliminar la primera fila (encabezado)
            $insertSql = "INSERT INTO $tableName (" . implode(', ', $columns) . ") VALUES (" . str_repeat('?,', count($columns) - 1) . "?)";
            $stmt = $db->prepare($insertSql);

            foreach ($data as $row) {
                $stmt->execute($row); // Inserta cada fila
            }
        }
    } else {
        echo "El archivo $file no existe.\n";
    }
}

echo "Proceso completado. La base de datos $dbName ha sido creada.\n";
?>
