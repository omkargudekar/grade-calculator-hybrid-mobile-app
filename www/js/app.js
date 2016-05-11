/**
 * Created by omkargudekar on 5/7/16.
 */
$(document).on("pagecreate", function () {
    $(".fullscreen-popup").popup({
        beforeposition: function () {
            $(this).css({
                width: window.innerWidth,
                height: window.innerHeight - 14
            });
        },
        x: 0,
        y: 0
    });
});