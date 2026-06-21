// Hittie's Gloss & Beauty Studio - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all functionality
    initMobileService();
    initFormValidation();
    initAccordions();
    initTabs();
    initTestimonialSlider();
    initProductFilter();
    initBookingForm();
    initContactMap();
    initQuickViewModal();
    initCharacterCounters();
    setMinDateForForms();
}

// Mobile service Toggle
function initMobileService() {
    const serviceToggle = document.querySelector('.service-toggle');
    const primaryNav = document.querySelector('.primary');
    
    if (serviceToggle && primaryNav) {
        serviceToggle.addEventListener('click', function() {
            primaryNav.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
        
        // Close service when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header')) {
                primaryNav.classList.remove('active');
                serviceToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
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
    const errorElement = document.getElementById(field.id + 'Error');
    
    if (!errorElement) return;
    
    // Clear previous error
    clearError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, errorElement, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
            showError(field, errorElement, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Minimum length validation
    if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
        showError(field, errorElement, `Minimum ${field.getAttribute('minlength')} characters required`);
        return false;
    }
    
    return true;
}

function showError(field, errorElement, message) {
    field.style.borderColor = '#dc3545';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    
    if (errorElement) {
        field.style.borderColor = '#ddd';
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Validate all fields
    fields.forEach(field => {
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement && errorElement.textContent) {
            isValid = false;
        }
    });
    
    if (isValid) {
        submitForm(form);
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');

    if (buttonText && loadingSpinner) {
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    }
    submitButton.disabled = true;

    setTimeout(() => {
        if (form.id === 'bookingForm') {
            showBookingConfirmation(form);
        } else if (form.id === 'contactForm') {
            showContactConfirmation(form);
        } else if (form.id === 'cateringForm') {
            showEnquiryConfirmation(form);
        } else if (form.id === 'bookingForm') {
            showBookingConfirmation(form); // 👈 add this
        }

        if (buttonText && loadingSpinner) {
            buttonText.style.display = 'inline-block';
            loadingSpinner.style.display = 'none';
        }
        submitButton.disabled = false;
    }, 2000);
}
// Booking Form Specific Functionality
// ---------------- Booking Form ----------------
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    const itemSelect = document.getElementById('item');
    const quantityInput = document.getElementById('quantity');
    
    // Update booking summary when items change
    if (itemSelect && quantityInput) {
        [itemSelect, quantityInput].forEach(element => {
            element.addEventListener('change', updateBookingSummary);
        });
        
        // ✅ Fixed typo here
        updateBookingSummary();
    }
}

function updateBookingSummary() {
    const itemSelect = document.getElementById('item');
    const quantityInput = document.getElementById('quantity');
    const summaryContent = document.getElementById('summaryContent');
    const totalAmount = document.getElementById('totalAmount');
    
    if (!itemSelect || !quantityInput || !summaryContent || !totalAmount) return;
    
    const selectedOption = itemSelect.options[itemSelect.selectedIndex];
    const price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price') || 0) : 0;
    const quantity = parseInt(quantityInput.value) || 0;
    const total = price * quantity;
    
    if (selectedOption && selectedOption.value) {
        summaryContent.innerHTML = `
            <p><strong>Item:</strong> ${selectedOption.text.split(' - ')[0]}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Unit Price:</strong> R${price}</p>
        `;
    } else {
        summaryContent.innerHTML = '<p>Select a product to see booking summary</p>';
    }
    
    totalAmount.textContent = total;
}
function showBookingConfirmation(form) {
    const formData = new FormData(form);
    const confirmationModal = document.getElementById('bookingConfirmation');
    const confirmationDetails = document.getElementById('confirmationDetails');
    
    if (!confirmationModal || !confirmationDetails) return;
    
   const bookingDetails = {
    fullname: formData.get('fullname'), // ✅ matches your form field
    phone: formData.get('phone'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
    date: formData.get('date'),
    time: formData.get('time') // add this if your form has a time field
};

confirmationDetails.innerHTML = `
    <p><strong>Thank you, ${bookingDetails.fullname}!</strong></p>
    <p>Your booking for <strong>${bookingDetails.service}</strong> has been received.</p>
    <p>We will contact you at ${bookingDetails.phone} / ${bookingDetails.email} to confirm.</p>
    <p><strong>Pickup:</strong> ${bookingDetails.date} at ${bookingDetails.time}</p>
    <p>Booking Reference: #SD${Date.now().toString().slice(-6)}</p>
`;


confirmationModal.style.display = 'block';


    
    // Reset form
    form.reset();
    updateBookingSummary();
    
    // Setup new order button
    const newBookingBtn = document.getElementById('newBooking');
    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
}

// Contact Form Functionality
function showContactConfirmation(form) {
    const formData = new FormData(form);
    // In a real implementation, this would send an email
    // For now, we'll just show a success message
    
    alert('Thank you for your message! We will get back to you within 24 hours.');
    form.reset();
    updateCharacterCounters();
}

// Enquiry Form Functionality
function showEnquiryConfirmation(form) {
    const formData = new FormData(form);
    const responseModal = document.getElementById('enquiryResponse');
    const responseDetails = document.getElementById('responseDetails');
    
    if (!responseModal || !responseDetails) return;
    
    const enquiryDetails = {
        type: formData.get('enquiryType'),
        name: formData.get('name'),
        email: formData.get('email')
    };
    
    responseDetails.innerHTML = `
        <p><strong>Thank you, ${enquiryDetails.name}!</strong></p>
        <p>We have received your ${enquiryDetails.type} enquiry and will contact you at ${enquiryDetails.email} within 24 hours.</p>
    `;
    
    responseModal.style.display = 'block';
    
    const newEnquiryBtn = document.getElementById('newEnquiry');
    if (newEnquiryBtn) {
        newEnquiryBtn.addEventListener('click', () => {
            responseModal.style.display = 'none';
        });
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
    const searchInput = document.getElementById('serviceSearch');
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
  'Eye Lashes': {
    name: 'Lash Extensions',
    price: 'R150',
    description: 'Enhance your natural beauty with long-lasting lash extensions that add volume and length.',
    details: 'Duration: 90 minutes. Touch-ups recommended every 3 weeks.'
  },
  'MakeUp': {
    name: 'Makeup Session',
    price: 'R350',
    description: 'Professional makeup tailored for any occasion.',
    details: 'Duration: 60 minutes. Custom looks available.'
  }
};
    
    const detail = productDetails[product] || productDetails['chocolate-cake'];
    
    modalContent.innerHTML = `
        <h2>${detail.name}</h2>
        <p class="price">${detail.price}</p>
        <p>${detail.description}</p>
        <p><small>${detail.details}</small></p>
        <a href="booking.html" class="cta">book Now</a>
    `;
    
    modal.style.display = 'block';
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
        // Soweto coordinates (adjust if needed)
        const studioLocation = [-26.267, 27.858];

        // Initialize Leaflet map
        const map = L.map('map').setView(studioLocation, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add studio marker
        L.marker(studioLocation)
            .addTo(map)
            .bindPopup('<b>Hitties Gloss & Beauty Studio</b><br>Soweto, Gauteng')
            .openPopup();

        // Directions button
        const directionsBtn = document.getElementById('getDirections');
        if (directionsBtn) {
            directionsBtn.addEventListener('click', () => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${studioLocation[0]},${studioLocation[1]}`, '_blank');
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
                    counter.style.color = '#dc3545';
                } else if (count > maxLength * 0.75) {
                    counter.style.color = '#ffc107';
                } else {
                    counter.style.color = '#666';
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

// ---------------- Lightbox Gallery ----------------
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgElement.src;
        lightboxImg.alt = imgElement.alt;
        lightbox.style.display = 'flex'; // show lightbox
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        lightbox.style.display = 'none'; // hide lightbox
        lightboxImg.src = '';
        lightboxImg.alt = '';
    }
}

