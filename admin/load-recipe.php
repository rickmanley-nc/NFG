<?php
header('Content-Type: application/json');

try {
    if (!isset($_GET['filename'])) {
        throw new Exception('No filename provided');
    }
    
    $filename = $_GET['filename'];
    $recipePath = '../_recipes/' . basename($filename);
    
    if (!file_exists($recipePath)) {
        throw new Exception('Recipe not found');
    }
    
    $content = file_get_contents($recipePath);
    if ($content === false) {
        throw new Exception('Failed to read recipe file');
    }
    
    // Parse front matter and content
    preg_match('/^---\n(.*?)\n---\n(.*)/s', $content, $matches);
    
    if (count($matches) < 3) {
        throw new Exception('Invalid recipe format');
    }
    
    $frontMatter = $matches[1];
    $body = $matches[2];
    
    // Parse YAML front matter more accurately
    $data = [];
    $currentKey = null;
    $currentArray = [];
    $inArray = false;
    
    foreach (preg_split('/\n/', $frontMatter) as $line) {
        if (empty(trim($line))) continue;
        
        // Check for main key
        if (preg_match('/^(\w+):(\s*(.*))?$/', $line, $matches)) {
            if ($inArray && $currentKey) {
                $data[$currentKey] = $currentArray;
            }
            
            $currentKey = $matches[1];
            $value = isset($matches[3]) ? trim($matches[3]) : '';
            
            if (empty($value)) {
                $inArray = true;
                $currentArray = [];
            } else {
                $inArray = false;
                $data[$currentKey] = $value;
            }
        }
        // Array item
        else if (preg_match('/^\s*-\s*(.+?):\s*(.+)$/', $line, $matches)) {
            if ($inArray) {
                $item = [];
                $item[$matches[1]] = $matches[2];
                $currentArray[] = $item;
            }
        }
        // Nested array item
        else if (preg_match('/^\s+(\w+):\s*(.+)$/', $line, $matches)) {
            if ($inArray && !empty($currentArray)) {
                $lastIndex = count($currentArray) - 1;
                $currentArray[$lastIndex][$matches[1]] = $matches[2];
            }
        }
    }
    
    // Add the last array if we were processing one
    if ($inArray && $currentKey) {
        $data[$currentKey] = $currentArray;
    }
    
    // Check for associated image
    $imagePath = '../assets/img/portfolio/' . pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
    $imageExists = file_exists($imagePath);
    
    echo json_encode([
        'success' => true,
        'recipe' => [
            'content' => $content,
            'frontMatter' => $data,
            'hasImage' => $imageExists,
            'imagePath' => $imageExists ? '/assets/img/portfolio/' . basename($imagePath) : null
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
