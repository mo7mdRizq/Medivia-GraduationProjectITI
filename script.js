document.addEventListener('DOMContentLoaded', () => {
    console.log('Doctor Portal Initialized');

    // Accordion Logic for Visits Page
    const visitHeaders = document.querySelectorAll('.visit-header');
    visitHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const chevron = header.querySelector('.chevron');

            // Toggle hidden class on content
            content.classList.toggle('hidden');

            // Rotate chevron
            chevron.classList.toggle('rotate-180');

            // Toggle background color of header to indicate active state
            header.classList.toggle('bg-gray-50');
        });
    });

    // Add interaction to buttons for demonstration
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Visual feedback
            const originalText = this.innerText;
            if (originalText === 'Approve') {
                this.innerText = 'Approved!';
                this.classList.remove('bg-blue-600', 'text-white');
                this.classList.add('bg-green-600', 'text-white');
                setTimeout(() => {
                    this.innerText = originalText;
                    this.classList.add('bg-blue-600', 'text-white');
                    this.classList.remove('bg-green-600');
                }, 2000);
            } else if (originalText === 'Review') {
                alert('Review modal would open here.');
            }
        });
    });

    // Sidebar navigation highlighting is handled by HTML on each page
    // No JS needed for this anymore since we have real pages

    // Reschedule Modal Logic
    const modal = document.getElementById('rescheduleModal');
    const openModalBtns = document.querySelectorAll('.reschedule-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    if (modal) {
        // Open Modal
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent accordion from toggling
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            });
        });

        // Close Modal Helper
        const closeModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        };

        // Close on X button
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

        // Close on Cancel button
        if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

        // Close on clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
