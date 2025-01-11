// Functions need to be defined before they're used in event listeners
function addIngredientRow(btn) {
    const container = btn.closest('.ingredient-group').querySelector('.ingredients-container');
    const row = document.createElement('div');
    row.className = 'ingredient-row row';
    row.innerHTML = `
        <div class="col-md-3">
            <input type="text" class="form-control" placeholder="Item" required>
        </div>
        <div class="col-md-2">
            <input type="text" class="form-control" placeholder="Amount">
        </div>
        <div class="col-md-2">
            <select class="form-select" aria-label="Unit">
                <option value="">Select unit</option>
                <option value="tsp">teaspoon (tsp)</option>
                <option value="tbsp">tablespoon (tbsp)</option>
                <option value="cup">cup</option>
                <option value="oz">ounce (oz)</option>
                <option value="lb">pound (lb)</option>
                <option value="g">gram (g)</option>
                <option value="ml">milliliter (ml)</option>
                <option value="l">liter (l)</option>
                <option value="pinch">pinch</option>
                <option value="whole">whole</option>
                <option value="piece">piece</option>
                <option value="to taste">to taste</option>
            </select>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Note">
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeRow(this)">×</button>
        </div>
    `;
    container.appendChild(row);
}

function addStepRow(btn) {
    const container = btn.closest('.step-group').querySelector('.steps-container');
    const row = document.createElement('div');
    row.className = 'row mb-2';
    row.innerHTML = `
        <div class="col">
            <textarea class="form-control" placeholder="Step instruction" required></textarea>
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeRow(this)">×</button>
        </div>
    `;
    container.appendChild(row);
}

function removeRow(btn) {
    btn.closest('.row').remove();
}

function removeGroup(btn) {
    btn.closest('.ingredient-group, .step-group').remove();
}

function generatePreview() {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const category = document.getElementById('category').value;
    const prepTime = document.getElementById('prepTime').value;
    const cookTime = document.getElementById('cookTime').value;
    const servings = document.getElementById('servings').value;
    
    let markdown = `---
layout: recipe
title: ${title}
${subtitle ? `subtitle: ${subtitle}` : ''}
category: ${category}
${prepTime ? `prep_time: ${prepTime}` : ''}
${cookTime ? `cook_time: ${cookTime}` : ''}
${servings ? `servings: ${servings}` : ''}
`;

    // Add image if selected
    const imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        const imageName = imageInput.files[0].name;
        markdown += `images:
  - path: /assets/img/portfolio/${imageName}
    alt: ${title}\n`;
    }

    // Add ingredients
    markdown += '\ningredients:\n';
    document.querySelectorAll('.ingredient-group').forEach(group => {
        const groupName = group.querySelector('input').value;
        markdown += `  - group: ${groupName}\n    items:\n`;
        
        group.querySelectorAll('.ingredient-row').forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            const item = inputs[0].value;
            const amount = inputs[1].value;
            const unit = inputs[2].value;
            const note = inputs[3].value;
            
            markdown += `      - item: ${item}\n`;
            if (amount) markdown += `        amount: ${amount}\n`;
            if (unit) markdown += `        unit: ${unit}\n`;
            if (note) markdown += `        note: ${note}\n`;
        });
    });

    // Add instructions
    markdown += '\ninstructions:\n';
    document.querySelectorAll('.step-group').forEach(group => {
        const groupName = group.querySelector('input').value;
        if (groupName) {
            markdown += `  - group: ${groupName}\n    steps:\n`;
        }
        
        group.querySelectorAll('textarea').forEach(step => {
            markdown += `      - step: ${step.value}\n`;
        });
    });

    // Add notes and credit
    const notes = document.getElementById('notes').value;
    const credit = document.getElementById('credit').value;

    if (notes) {
        markdown += `\nnotes: |\n  ${notes.replace(/\n/g, '\n  ')}\n`;
    }
    if (credit) {
        markdown += `\ncredit: ${credit}\n`;
    }

    markdown += '---';

    // Show raw markdown
    document.getElementById('markdownPreview').textContent = markdown;

    // Create rendered preview
    let renderedContent = '';
    
    // Add image if selected
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const imageUrl = URL.createObjectURL(file);
        renderedContent += `![${title}](${imageUrl})\n\n`;
    }

    // Add title and subtitle
    renderedContent += '# ' + title + '\n\n';
    
    if (subtitle) {
        renderedContent += '*' + subtitle + '*\n\n';
    }

    // Add preparation details
    renderedContent += '## Details\n\n';
    if (prepTime) renderedContent += '- Prep Time: ' + prepTime + '\n';
    if (cookTime) renderedContent += '- Cook Time: ' + cookTime + '\n';
    if (servings) renderedContent += '- Servings: ' + servings + '\n\n';

    // Add ingredients
    renderedContent += '## Ingredients\n\n';
    document.querySelectorAll('.ingredient-group').forEach(group => {
        const groupName = group.querySelector('input').value;
        renderedContent += '### ' + groupName + '\n\n';
        
        group.querySelectorAll('.ingredient-row').forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            const item = inputs[0].value;
            const amount = inputs[1].value;
            const unit = inputs[2].value;
            const note = inputs[3].value;
            
            let ingredient = '- ' + item;
            if (amount || unit) {
                ingredient += ': ' + (amount || '') + ' ' + (unit || '');
            }
            if (note) {
                ingredient += ' (' + note + ')';
            }
            renderedContent += ingredient + '\n';
        });
        renderedContent += '\n';
    });

    // Add instructions
    renderedContent += '## Instructions\n\n';
    document.querySelectorAll('.step-group').forEach(group => {
        const groupName = group.querySelector('input').value;
        if (groupName) {
            renderedContent += '### ' + groupName + '\n\n';
        }
        
        let stepNumber = 1;
        group.querySelectorAll('textarea').forEach(step => {
            renderedContent += stepNumber + '. ' + step.value + '\n';
            stepNumber++;
        });
        renderedContent += '\n';
    });

    // Add notes and credit
    if (notes) {
        renderedContent += '## Notes\n\n' + notes + '\n\n';
    }
    if (credit) {
        renderedContent += '## Credit\n\n' + credit + '\n';
    }

    // Render the markdown to HTML
    document.getElementById('renderedPreview').innerHTML = marked.parse(renderedContent);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize marked.js with options
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // Initialize form elements
    const form = document.getElementById('recipeForm');
    const ingredientGroups = document.getElementById('ingredientGroups');
    const stepGroups = document.getElementById('stepGroups');
    const previewBtn = document.getElementById('previewBtn');
    const recipeSearch = document.getElementById('recipeSearch');
    const recipeList = document.getElementById('recipeList');
    const editRecipeBtn = document.getElementById('editRecipeBtn');
    const newRecipeBtn = document.getElementById('newRecipeBtn');
    let currentRecipe = null;

    // Load recipe list when edit button is clicked
    editRecipeBtn.addEventListener('click', loadRecipeList);
    
    // Handle recipe search
    recipeSearch.addEventListener('input', filterRecipes);
    
    // Clear form when creating new recipe
    newRecipeBtn.addEventListener('click', () => {
        currentRecipe = null;
        form.reset();
        clearGroups();
        addIngredientGroup();
        addStepGroup();
    });

    async function loadRecipeList() {
        try {
            const response = await fetch('list-recipes.php');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load recipes');
            }
            
            recipeList.innerHTML = '';
            data.recipes.forEach(recipe => {
                const item = document.createElement('a');
                item.href = '#';
                item.className = 'list-group-item list-group-item-action';
                item.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${recipe.title}</h5>
                        <small>${recipe.category}</small>
                    </div>
                    <small class="text-muted">Last modified: ${new Date(recipe.modified * 1000).toLocaleDateString()}</small>
                `;
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadRecipe(recipe.filename);
                    bootstrap.Modal.getInstance(document.getElementById('recipeSelectModal')).hide();
                });
                recipeList.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading recipes:', error);
            alert('Error loading recipes: ' + error.message);
        }
    }

    function filterRecipes() {
        const searchTerm = recipeSearch.value.toLowerCase();
        const items = recipeList.getElementsByTagName('a');
        
        for (const item of items) {
            const title = item.querySelector('h5').textContent.toLowerCase();
            const category = item.querySelector('small').textContent.toLowerCase();
            const matches = title.includes(searchTerm) || category.includes(searchTerm);
            item.style.display = matches ? '' : 'none';
        }
    }

    async function loadRecipe(filename) {
        try {
            const response = await fetch(`load-recipe.php?filename=${encodeURIComponent(filename)}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load recipe');
            }
            
            currentRecipe = filename;
            
            // Clear existing form
            form.reset();
            clearGroups();
            
            const recipe = data.recipe;
            
            // Set basic fields
            document.getElementById('title').value = recipe.frontMatter.title || '';
            document.getElementById('subtitle').value = recipe.frontMatter.subtitle || '';
            document.getElementById('category').value = recipe.frontMatter.category || '';
            document.getElementById('prepTime').value = recipe.frontMatter.prep_time || '';
            document.getElementById('cookTime').value = recipe.frontMatter.cook_time || '';
            document.getElementById('servings').value = recipe.frontMatter.servings || '';
            document.getElementById('notes').value = recipe.frontMatter.notes || '';
            document.getElementById('credit').value = recipe.frontMatter.credit || '';
            
            // Load ingredients
            if (recipe.frontMatter.ingredients && Array.isArray(recipe.frontMatter.ingredients)) {
                recipe.frontMatter.ingredients.forEach(group => {
                    if (!group.group || !group.items) return;
                    
                    // Create ingredient group
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'ingredient-group mb-3';
                    groupDiv.innerHTML = `
                        <div class="row mb-2">
                            <div class="col">
                                <input type="text" class="form-control" placeholder="Group Name" required value="${group.group}">
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-sm btn-outline-success" onclick="addIngredientRow(this)">Add Ingredient</button>
                                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeGroup(this)">Remove Group</button>
                            </div>
                        </div>
                        <div class="ingredients-container">
                        </div>
                    `;
                    ingredientGroups.appendChild(groupDiv);
                    
                    // Add ingredients
                    const container = groupDiv.querySelector('.ingredients-container');
                    group.items.forEach(item => {
                        const row = document.createElement('div');
                        row.className = 'ingredient-row row';
                        row.innerHTML = `
                            <div class="col-md-3">
                                <input type="text" class="form-control" placeholder="Item" required value="${item.item || ''}">
                            </div>
                            <div class="col-md-2">
                                <input type="text" class="form-control" placeholder="Amount" value="${item.amount || ''}">
                            </div>
                            <div class="col-md-2">
                                <select class="form-select" aria-label="Unit">
                                    <option value="">Select unit</option>
                                    <option value="tsp">teaspoon (tsp)</option>
                                    <option value="tbsp">tablespoon (tbsp)</option>
                                    <option value="cup">cup</option>
                                    <option value="oz">ounce (oz)</option>
                                    <option value="lb">pound (lb)</option>
                                    <option value="g">gram (g)</option>
                                    <option value="ml">milliliter (ml)</option>
                                    <option value="l">liter (l)</option>
                                    <option value="pinch">pinch</option>
                                    <option value="whole">whole</option>
                                    <option value="piece">piece</option>
                                    <option value="to taste">to taste</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <input type="text" class="form-control" placeholder="Note" value="${item.note || ''}">
                            </div>
                            <div class="col-md-1">
                                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeRow(this)">×</button>
                            </div>
                        `;
                        container.appendChild(row);
                        
                        // Set the unit value
                        if (item.unit) {
                            const select = row.querySelector('select');
                            select.value = item.unit;
                        }
                    });
                });
            }
            
            // Load instructions
            if (recipe.frontMatter.instructions && Array.isArray(recipe.frontMatter.instructions)) {
                recipe.frontMatter.instructions.forEach(group => {
                    // Create instruction group
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'step-group mb-3';
                    groupDiv.innerHTML = `
                        <div class="row mb-2">
                            <div class="col">
                                <input type="text" class="form-control" placeholder="Group Name (optional)" value="${group.group || ''}">
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-sm btn-outline-success" onclick="addStepRow(this)">Add Step</button>
                                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeGroup(this)">Remove Group</button>
                            </div>
                        </div>
                        <div class="steps-container">
                        </div>
                    `;
                    stepGroups.appendChild(groupDiv);
                    
                    // Add steps
                    const container = groupDiv.querySelector('.steps-container');
                    if (group.steps && Array.isArray(group.steps)) {
                        group.steps.forEach(step => {
                            const row = document.createElement('div');
                            row.className = 'row mb-2';
                            row.innerHTML = `
                                <div class="col">
                                    <textarea class="form-control" placeholder="Step instruction" required>${step.step || ''}</textarea>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeRow(this)">×</button>
                                </div>
                            `;
                            container.appendChild(row);
                        });
                    }
                });
            }
            
            // Show current image if it exists
            if (recipe.hasImage) {
                const imagePreview = document.createElement('img');
                imagePreview.src = recipe.imagePath;
                imagePreview.className = 'img-fluid mb-3';
                imagePreview.style.maxHeight = '200px';
                document.getElementById('imagePreview').innerHTML = '';
                document.getElementById('imagePreview').appendChild(imagePreview);
            }
            
        } catch (error) {
            console.error('Error loading recipe:', error);
            alert('Error loading recipe: ' + error.message);
        }
    }

    function clearGroups() {
        ingredientGroups.innerHTML = '';
        stepGroups.innerHTML = '';
    }

    function addIngredientGroup() {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'ingredient-group mb-3';
        groupDiv.innerHTML = `
            <div class="row mb-2">
                <div class="col">
                    <input type="text" class="form-control" placeholder="Group Name (e.g., Main Ingredients)" required>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-outline-success" onclick="addIngredientRow(this)">Add Ingredient</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeGroup(this)">Remove Group</button>
                </div>
            </div>
            <div class="ingredients-container">
                <!-- Ingredient rows will be added here -->
            </div>
        `;
        ingredientGroups.appendChild(groupDiv);
        addIngredientRow(groupDiv.querySelector('.btn-outline-success'));
    }

    function addStepGroup() {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'step-group mb-3';
        groupDiv.innerHTML = `
            <div class="row mb-2">
                <div class="col">
                    <input type="text" class="form-control" placeholder="Group Name (optional)">
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-outline-success" onclick="addStepRow(this)">Add Step</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeGroup(this)">Remove Group</button>
                </div>
            </div>
            <div class="steps-container">
                <!-- Step rows will be added here -->
            </div>
        `;
        stepGroups.appendChild(groupDiv);
        addStepRow(groupDiv.querySelector('.btn-outline-success'));
    }

    // Add initial groups
    addIngredientGroup();
    addStepGroup();

    // Event Listeners
    document.getElementById('addIngredientGroup').addEventListener('click', addIngredientGroup);
    document.getElementById('addStepGroup').addEventListener('click', addStepGroup);
    previewBtn.addEventListener('click', generatePreview);
    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();
    
    generatePreview();
    const markdown = document.getElementById('markdownPreview').textContent;
    
    // Use existing filename if editing, otherwise create new one
    const title = document.getElementById('title').value;
    const filename = currentRecipe || (title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '.md');
    
    try {
        const data = {
            markdown: markdown,
            filename: filename,
            isEdit: !!currentRecipe
        };

        // Handle image if present
        const imageInput = document.getElementById('image');
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            
            const imageData = await new Promise((resolve, reject) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            });
            
            data.image = imageData;
        }

        const response = await fetch('save-recipe.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to save recipe');
        }

        // Show success message and PR link
        const message = `Recipe saved successfully!\n\nA new branch '${result.branch}' has been created.\n\nClick OK to open the pull request page.`;
        if (confirm(message)) {
            window.open(result.prUrl, '_blank');
        }
        
        // Optional: Clear form or redirect
        if (confirm('Would you like to create another recipe?')) {
            currentRecipe = null;
            form.reset();
            clearGroups();
            addIngredientGroup();
            addStepGroup();
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Error saving recipe: ' + error.message);
    }
}
