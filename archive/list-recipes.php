<?php
header('Content-Type: application/json');

try {
    $recipesDir = '../_recipes/';
    $recipes = [];
    
    if (is_dir($recipesDir)) {
        foreach (new DirectoryIterator($recipesDir) as $file) {
            if ($file->isDot() || $file->getExtension() !== 'md') continue;
            
            $content = file_get_contents($file->getPathname());
            
            // Extract title from front matter
            preg_match('/title:\s*(.+)$/m', $content, $titleMatch);
            $title = $titleMatch[1] ?? $file->getBasename('.md');
            
            // Extract category from front matter
            preg_match('/category:\s*(.+)$/m', $content, $categoryMatch);
            $category = $categoryMatch[1] ?? 'uncategorized';
            
            $recipes[] = [
                'filename' => $file->getBasename(),
                'title' => $title,
                'category' => $category,
                'path' => $file->getPathname(),
                'modified' => $file->getMTime()
            ];
        }
    }
    
    // Sort recipes by title
    usort($recipes, function($a, $b) {
        return strcasecmp($a['title'], $b['title']);
    });
    
    echo json_encode([
        'success' => true,
        'recipes' => $recipes
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
