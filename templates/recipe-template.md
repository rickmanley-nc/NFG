---
layout: recipe
title: Recipe Title
subtitle: Short Descriptive Subtitle
category: mains
prep_time: X minutes
cook_time: X minutes
servings: X
images:
  - path: assets/img/portfolio/recipe-name.jpg
    alt: Recipe Title
ingredients:
  - group: Group Name
    items:
      - item: ingredient name
        amount: 1
        unit: cup
      - item: another ingredient
        amount: 2
        unit: tablespoons
        note: optional note about the ingredient
instructions:
  - group: Group Name
    steps:
      - step: "First instruction step"
      - step: "Second instruction step"
      - step: "Third instruction step"
  - group: Another Group
    steps:
      - step: "More instructions here"
notes: "Personal notes about the recipe."
equipment:
  - Equipment item 1
  - Equipment item 2
---

<!--
TEMPLATE USAGE:
1. Copy this file to _recipes/<recipe-name>.md
2. Replace all placeholder values
3. Category must be one of: mains, sides, smoked, cocktails, desserts, miscellaneous
4. Image path: assets/img/portfolio/<recipe-name>.jpg
5. Instructions use "step:" key (NOT bare strings)
6. Ingredient groups: use "group:" + "items:" with "item:", "amount:", "unit:", optional "note:"
7. Keep formatting consistent with existing recipes
-->
