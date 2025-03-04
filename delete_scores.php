<?php
$file = 'scores.txt';
if (file_exists($file)) {
    if (file_put_contents($file, '[]')) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Impossible de supprimer les scores']);
    }
} else {
    echo json_encode(['error' => 'Le fichier des scores n\'existe pas']);
}
?>
