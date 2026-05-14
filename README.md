# Nelson Farm and Grill

A family recipe collection published as a [Jekyll](https://jekyllrb.com/) site on [GitHub Pages](https://rickmanley-nc.github.io/NFG/).

## Site

**Live site:** https://rickmanley-nc.github.io/NFG/

## Recipe Collection

32 recipes across 6 categories:

| Category | Count |
|---|---|
| Mains | 7 |
| Starters | 6 |
| Smoked | 6 |
| Miscellaneous | 5 |
| Desserts | 4 |
| Cocktails | 4 |

### Recent Additions

- Red Chile Rub Steak
- BB's Spaghetti Sauce
- Swiss Chocolate Cake
- Smoked Prime Rib

## How It Works

Recipes are stored as Markdown files in `_recipes/` with YAML front matter. Jekyll builds them into a browsable site using the `recipe` layout.

### Front Matter Fields

```yaml
layout: recipe
title: Recipe Title
subtitle: Short descriptive subtitle
category: mains       # mains | starters | smoked | cocktails | desserts | miscellaneous
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
instructions:
  - group: Group Name
    steps:
      - step: "Instruction step"
notes: "Optional notes."
equipment:
  - Equipment item
```

## Adding a Recipe

1. Copy `templates/recipe-template.md` to `_recipes/<recipe-name>.md`
2. Fill in all front matter fields
3. Add a recipe image to `assets/img/portfolio/`
4. Open a pull request — the swarm pipeline will review and merge

## Development

```bash
bundle install
bundle exec jekyll serve
```

Site runs at `http://localhost:4000/NFG/`.

## Pipeline

This repository is managed by the [swarm-repo](https://github.com/rickmanley-nc/swarm-repo) AI agent pipeline. Issues are triaged, implemented, tested, and merged automatically. To request a new recipe or change, open a GitHub issue.
