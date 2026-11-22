$(function () {
    $('[data-confirm]').on('submit', function (event) {
        var message = $(this).data('confirm');
        if (!window.confirm(message)) {
            event.preventDefault();
        }
    });

    window.setTimeout(function () {
        $('.alert-auto').fadeOut(400);
    }, 4000);
});
