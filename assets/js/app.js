$(function () {
    $('[data-confirm]').on('submit', function (event) {
        var message = $(this).data('confirm');
        if (!window.confirm(message)) {
            event.preventDefault();
        }
    });

    $('.js-auto-submit').on('change', function () {
        if (this.form) {
            this.form.submit();
        }
    });

    $('.js-print').on('click', function () {
        window.print();
    });

    $('[data-width]').each(function () {
        this.style.width = this.getAttribute('data-width') + '%';
    });

    window.setTimeout(function () {
        $('.alert-auto').fadeOut(400);
    }, 4000);
});
