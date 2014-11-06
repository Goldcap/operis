// JavaScript Document
jQuery(document).ajaxSend(function(event, xhr, settings) {
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
        var token = $('meta[name="csrf-token"]').attr('content');
        xhr.setRequestHeader("X-CSRFToken", token);
    }
});