# NFG
Meatballs
Shrimp Scampi
Beef Wellington


## Create new recipe
1. Add recipe to relevant `recipes/` directory based on category
2. Follow template below:
```
<div class="modal-content">
    <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="modal-body">
                    <!-- Project details-->
                    <h2 class="text-uppercase">Gold Rush</h2>
                    <p class="item-intro text-muted">Four Roses, Knob Creek, Bulleit</p>
                    <img class="img-fluid d-block mx-auto" src="assets/img/portfolio/goldrush.jpg" alt="..." />
                    <h3 style="text-align:left">Honey Syrup</h3>
                    <ul style="text-align:left">
                        <li>1/4 cup honey</li>
                        <li>1/4 cup water</li>
                    </ul>
                    <h3 style="text-align:left">Cocktail</h3>
                    <ul style="text-align:left">
                        <li>2 ounces bourbon</li>
                        <li>3/4 ounce lemon juice</li>
                        <li>1/2 ounce honey syrup</li>
                        <li>Lemon peel/slice for garnish</li>
                    </ul>
                    <h3 style="text-align:left">Steps</h3>
                    <ol style="text-align:left">
                        <li>Make honey syrup</li>
                        <li>Fill a cocktail shaker with ice. Add bourbon, lemon juice, and honey syrup. Cover and shake vigorously, about 15 seconds.</li>
                        <li>Strain into an ice-filled rocks glass and garnish with a lemon twist.</li>
                        </ol>
                    <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                        <i class="fas fa-xmark me-1"></i>
                        Back
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```

3. Modify Grid section and Modal section in `index.html`
Grid template (currently 3 items per row):
```
                    <div class="col-lg-4 col-sm-6 mb-4">
                        <!-- Cocktails 1-->
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#cocktailsModal1">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid" src="assets/img/portfolio/goldrush.jpg" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading text-black">Gold Rush</div>
                                <div class="portfolio-caption-subheading text-muted">Bourbon, honey syrup, and lemon juice</div>
                            </div>
                        </div>
                    </div>
```
Modal template:
```
        <div class="portfolio-modal modal fade bg-secondary bg-gradient" id="cocktailsModal1" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <!-- the include file -->
                <div w3-include-html="recipes/1_cocktails_and_mocktails/goldrush.html"></div>
            </div>
        </div>
```
