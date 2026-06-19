// Hittie's Gloss & Beauty Studio - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all functionality
    initFormValidation();
    initAccordions();
    initTabs();
    initTestimonialSlider();
    initProductFilter();
    initbookingForm();
    initContactMap();
    initQuickViewModal();
    initCharacterCounters();
    setMinDateForForms();
}

// REMOVED Problematic Image Gallery Code that was causing images to disappear
// function initImageGallery() {
// // This function was causing issues - removed
// }

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.name + 'Error'); 
    // use field.name instead of id since your HTML uses name attributes

    if (!errorElement) return true;

    clearError(e);

    let valid = true;

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, errorElement, 'This field is required');
        valid = false;
    }

    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, errorElement, 'Please enter a valid email address');
            valid = false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
            showError(field, errorElement, 'Please enter a valid phone number');
            valid = false;
        }
    }

    // Apply CSS classes
    if (valid) {
        field.classList.remove('error');
        field.classList.add('success');
    } else {
        field.classList.remove('success');
        field.classList.add('error');
    }

    return valid;
}

function showError(field, errorElement, message) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });

    if (isValid) {
        alert('Thank you! Your booking has been received.');
        form.reset();
    } else {
        alert('Please fix the errors before submitting.');
    }
}


// Accordion Functionality
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const headers = accordion.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isActive = content.classList.contains('active');
                
                // Close all accordion items in this group
                accordion.querySelectorAll('.accordion-content').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open current item if it was closed
                if (!isActive) {
                    content.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    this.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });
}

// Tab Functionality
function initTabs() {
    const tabContainers = document.querySelectorAll('.enquiry-tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update panes
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetTab) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const testimonials = slider.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (!testimonials.length) return;
    
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
        currentIndex = index;
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            showTestimonial(newIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showTestimonial(newIndex);
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    }, 5000);
}

// SIMPLIFIED Product Filter - Fixed version
function initProductFilter() {
    const searchInput = document.getElementById('menuSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', filterProducts);
        }
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        });
    });
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        const sortValue = sortSelect ? sortSelect.value : 'name';
        
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const category = product.getAttribute('data-category');
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDesc = product.querySelector('p').textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = !searchTerm || 
                productName.includes(searchTerm) || 
                productDesc.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        // Simple sort implementation
        sortProducts(sortValue);
    }
    
    function sortProducts(sortValue) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        
        const products = Array.from(productGrid.querySelectorAll('.product-card[style*="display: block"]'));
        
        products.sort((a, b) => {
            const aPrice = parseFloat(a.getAttribute('data-price'));
            const bPrice = parseFloat(b.getAttribute('data-price'));
            const aName = a.querySelector('h3').textContent;
            const bName = b.querySelector('h3').textContent;
            
            switch (sortValue) {
                case 'price-low':
                    return aPrice - bPrice;
                case 'price-high':
                    return bPrice - aPrice;
                case 'name':
                default:
                    return aName.localeCompare(bName);
            }
        });
        
        // Reorder products in DOM
        products.forEach(product => productGrid.appendChild(product));
    }
}

// Quick View Modal - SIMPLIFIED
function initQuickViewModal() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    
    if (!modal) return;
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            showQuickView(product);
        });
    });
    
    // Close modal
    const closeModal = modal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showQuickView(product) {
    const modal = document.getElementById('quickViewModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    // Simple product details
    const productDetails = {
        'Manicure & Pedicure': {
    name: 'Manicure & Pedicure',
    price: 'R320',
    description: 'A relaxing treatment that combines nail shaping, cuticle care, and polish for both hands and feet.',
    details: 'Duration: 90 minutes. Advance booking required.'
        },
        'Lashes': {
           name: 'Lash Extensions',
          price: 'R150',
          description: 'Enhance your natural beauty with long-lasting lash extensions that add volume and length.',
          details: 'Duration: 90 minutes. Touch-ups recommended every 3 weeks.'
  
        },
        'Makeup': {
            name: 'Makeup Session',
            price: 'R350',
            description: 'Professional makeup tailored for any occasion.',
            details: 'Duration: 60 minutes. Custom looks available.'
        }
    };
    
    const detail = productDetails[product] || productDetails['Manicure & Pedicure'];
    
    modalContent.innerHTML = `
        <h2>${detail.name}</h2>
        <p class="price">${detail.price}</p>
        <p>${detail.description}</p>
        <p><small>${detail.details}</small></p>
        <a href="https://www.whatsapp.com/catalog/27788168676/?app_absent=0" class="cta">Book Now</a>
    `;
    
    modal.style.display = 'block';
}

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate all fields
        bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        if (isValid) {
            // Show success feedback
            alert('Thank you! Your booking has been received.');
            bookingForm.reset();
        } else {
            alert('Please fix the errors before submitting.');
        }
    });
}


// Contact Map
function initContactMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Check if Leaflet is available
    if (typeof L === 'undefined') {
        console.log('Leaflet not loaded');
        return;
    }
    
     try {
        // Initialize Leaflet map
        const map = L.map('map').setView([-26.1361, 28.0423], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add bakery marker
        L.marker([-26.1361, 28.0423])
            .addTo(map)
            .bindPopup('<b>Sweet Delights Bakery</b><br>123 Main Street, Rosebank')
            .openPopup();
        
        // Directions button
        const directionsBtn = document.getElementById('getDirections');
        if (directionsBtn) {
            directionsBtn.addEventListener('click', () => {
                window.open('https://maps.google.com?q=-26.1361,28.0423', '_blank');
            });
        }
    } catch (error) {
        console.log('Map initialization failed:', error);
    }
}

// Character Counters
function initCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const counterId = textarea.id + 'Count';
        const counter = document.getElementById(counterId);
        
        if (counter) {
            textarea.addEventListener('input', function() {
                const count = this.value.length;
                const maxLength = parseInt(this.getAttribute('maxlength'));
                counter.textContent = count;
                
                if (count > maxLength * 0.9) {
                    counter.style.color = '#dc35ad';
                } else if (count > maxLength * 0.75) {
                    counter.style.color = '#ff07f7';
                } else {
                    counter.style.color = '#666666';
                }
            });
            
            // Initialize count
            const event = new Event('input');
            textarea.dispatchEvent(event);
        }
    });
}

function updateCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        const counterId = textarea.id + 'Count';
        const counter = document.getElementById(counterId);
        if (counter) {
            counter.textContent = textarea.value.length;
        }
    });
}

// Set minimum date for forms
function setMinDateForForms() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

// Export functions for global access if needed
window.BeautyStudio = {
    init: initializeApp,
    validateForm: handleFormSubmit
};
