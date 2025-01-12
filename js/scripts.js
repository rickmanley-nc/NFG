/*!
* Start Bootstrap - Agency v7.0.11 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Function to open modals for recipe cards
    const recipeLinks = document.querySelectorAll('.portfolio-link');
    recipeLinks.forEach(link => {
        link.addEventListener('click', async function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            const modalTitle = modal.querySelector('.modal-title');
            const modalBody = modal.querySelector('.modal-body');

            // Set the title of the modal
            modalTitle.textContent = this.querySelector('.portfolio-caption-heading').textContent;

            // Removed the fetchAndRenderRecipe function as it is redundant with the dynamic modal generation in index.html
            try {
            } catch (error) {
                console.error(error);
                modalBody.innerHTML = '<p>Sorry, we could not load the recipe.</p>';
            }

            // Show the modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();

            // Add event listeners for modal shown and hidden
            $(modalId).on('shown.bs.modal', function () {
                alert('Modal opened');
            });

            $(modalId).on('hidden.bs.modal', function () {
                alert('Modal closed');
            });
        });
    });

    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Close button clicked');
        });
    });

    // Add event listeners to log when the modal is shown and hidden for debugging purposes
    document.querySelectorAll('.portfolio-link').forEach(link => {
        const modalId = link.getAttribute('href');
        $(modalId).on('shown.bs.modal', function () {
            alert('Modal opened');
        });

        $(modalId).on('hidden.bs.modal', function () {
            alert('Modal closed');
        });
    });

});
