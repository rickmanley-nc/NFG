<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('No data received');
    }

    $markdown = $data['markdown'];
    $filename = $data['filename'];
    $imageData = $data['image'] ?? null;

    // Base paths
    $recipesDir = '../_recipes/';
    $imagesDir = '../assets/img/portfolio/';
    
    // Ensure directories exist
    if (!file_exists($recipesDir)) {
        mkdir($recipesDir, 0755, true);
    }
    if (!file_exists($imagesDir)) {
        mkdir($imagesDir, 0755, true);
    }

    // Create a new branch for this recipe
    $branchName = 'recipe/' . pathinfo($filename, PATHINFO_FILENAME) . '-' . date('Y-m-d');
    
    // Git commands to create and switch to new branch
    exec('git checkout main 2>&1', $output, $returnVar);
    if ($returnVar !== 0) {
        throw new Exception('Failed to checkout main branch: ' . implode("\n", $output));
    }
    
    exec('git pull origin main 2>&1', $output, $returnVar);
    if ($returnVar !== 0) {
        throw new Exception('Failed to pull latest changes: ' . implode("\n", $output));
    }

    exec('git checkout -b ' . escapeshellarg($branchName) . ' 2>&1', $output, $returnVar);
    if ($returnVar !== 0) {
        throw new Exception('Failed to create new branch: ' . implode("\n", $output));
    }

    // Save image if present
    $imagePath = null;
    if ($imageData && preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
        $imageData = substr($imageData, strpos($imageData, ',') + 1);
        $imageData = base64_decode($imageData);
        
        if ($imageData === false) {
            throw new Exception('Failed to decode image data');
        }

        // Generate image filename from recipe name
        $imageName = pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
        $imagePath = $imagesDir . $imageName;
        
        if (file_put_contents($imagePath, $imageData) === false) {
            throw new Exception('Failed to save image');
        }
    }

    // Save markdown file
    $recipePath = $recipesDir . $filename;
    if (file_put_contents($recipePath, $markdown) === false) {
        throw new Exception('Failed to save recipe');
    }

    // Git operations
    $gitCommands = [
        'git add ' . escapeshellarg($recipePath),
    ];

    if ($imagePath) {
        $gitCommands[] = 'git add ' . escapeshellarg($imagePath);
    }

    // Create commit with detailed message
    $commitMessage = "Add recipe: " . pathinfo($filename, PATHINFO_FILENAME) . "\n\n" .
                    "- Added new recipe markdown file\n" .
                    ($imagePath ? "- Added recipe image\n" : "") .
                    "\nThis change adds a new recipe to the collection.";

    $gitCommands[] = 'git commit -m ' . escapeshellarg($commitMessage);
    
    // Push branch to remote
    $gitCommands[] = 'git push -u origin ' . escapeshellarg($branchName);

    // Execute git commands
    foreach ($gitCommands as $command) {
        exec($command . ' 2>&1', $output, $returnVar);
        if ($returnVar !== 0) {
            throw new Exception('Git command failed: ' . implode("\n", $output));
        }
    }

    // Generate GitHub pull request URL
    $repoUrl = trim(shell_exec('git config --get remote.origin.url'));
    $repoUrl = preg_replace('/\.git$/', '', $repoUrl);
    $repoUrl = preg_replace('/^git@github\.com:/', 'https://github.com/', $repoUrl);
    $prUrl = $repoUrl . '/compare/main...' . $branchName . '?expand=1';

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Recipe saved and branch created successfully',
        'recipePath' => $recipePath,
        'imagePath' => $imagePath,
        'branch' => $branchName,
        'prUrl' => $prUrl
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
