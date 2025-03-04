<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['name']) && isset($_POST['score'])) {
        $name = htmlspecialchars($_POST['name']);
        $score = intval($_POST['score']);

        // Créer ou ouvrir le fichier texte pour écrire les scores
        $file = 'scores.txt';
        $scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        $scores[] = ['name' => $name, 'score' => $score];

        // Sauvegarde des scores dans un fichier texte
        file_put_contents($file, json_encode($scores));
    } else {
        echo json_encode(['error' => 'Données manquantes']);
    }
}
?>
