var isAllowRequestList = true;

// Function to show recent list for the provided parent element from /sidebar.json
function ShowAjaxRecentList(parent) {
    function temp() {
        jQuery.ajax({
            url: "/sidebar.json", // URL to fetch recent changes
            dataType: 'json'
        }).done(function(res) {
            var html = "";
            for (var i = 0; i < res.length && i < 10; i++) {
                var item = res[i];
                html += '<li><a class="recent-item" href="/w/' + encodeURIComponent(item.document) + '" title="' + item.document + '">';
                var time = new Date(item.date * 1000);
                if (Math.floor((new Date()).getTime() / 1000) - 86400 > item.date) {
                    var year = time.getFullYear();
                    var month = time.getMonth() + 1;
                    var day = time.getDate();
                    if (month < 10) {
                        month = "0" + month;
                    }
                    if (day < 10) {
                        day = "0" + day;
                    }
                    time = year + "/" + month + "/" + day;
                } else {
                    var hour = time.getHours();
                    var minute = time.getMinutes();
                    var second = time.getSeconds();
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    if (minute < 10) {
                        minute = "0" + minute;
                    }
                    if (second < 10) {
                        second = "0" + second;
                    }
                    time = hour + ":" + minute + ":" + second;
                }
                html += "[" + time + "] " + item.document + "</a></li>";
            }
            if (parent != null) {
                jQuery(parent).html(html);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data from /sidebar.json:', textStatus, errorThrown);
        });
    }
    temp();
}

// Function to show recent list for the provided parent element from namgall API
function ShowAjaxRecentList2(parent) {
    function temp() {
        jQuery.ajax({
            url: "https://namgall.wikiing.in/api/open_recent_changes?channel=2", // Modified API URL
            dataType: 'json'
        }).done(function(res) {
            var html = "";
            for (var i = 0; i < res.length && i < 10; i++) {
                var item = res[i];
                html += '<li><a class="recent-item" href="'+ item[8] + encodeURIComponent(item[1]) + '" title="' + mashiro_do_func_xss_encode(item[1]) + '">';
                html += "[" + mashiro_do_func_xss_encode(item[2].replace(/^([^ ]+) /, '')) + "] " + "[" + mashiro_do_func_xss_encode(item[7]) + "] ";
                var text = item[1];
                if (text.length > 18) {
                    text = text.substr(0, 18) + "...";
                }
                html += text;
                html += "</a></li>";
            }
            if (parent != null) {
                jQuery(parent).html(html);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data from namgall API:', textStatus, errorThrown);
        });
    }
    temp();
}

function mashiro_do_func_xss_encode(data) {
    data = data.replace(/'/g, '&#x27;');
    data = data.replace(/"/g, '&quot;');
    data = data.replace(/</g, '&lt;');
    data = data.replace(/>/g, '&gt;'); // Corrected the repeated '<' replacement
    return data;
}

// Vector-specific scripts
var recentIntervalHandle = null;
jQuery(function (jQuery) {
    var width = jQuery(window).width();
    if (width > 1023) {
        isAllowRequestList = true;
        ShowAjaxRecentList(jQuery("#live-recent-list"));
        ShowAjaxRecentList2(jQuery("#live-recent-list-2"));
    } else {
        isAllowRequestList = false;
    }

    // If the screen size is small and recent changes are not visible, do not refresh.
    jQuery(window).resize(recentIntervalCheck);
});

var recentIntervalCheck = function () {
    var width = jQuery(window).width();
    if (width <= 1023) {
        if (recentIntervalHandle != null) {
            clearInterval(recentIntervalHandle);
            recentIntervalHandle = null;
        }
        isAllowRequestList = false;
    } else {
        if (recentIntervalHandle == null) {
            recentIntervalHandle = setInterval(function () {
                ShowAjaxRecentList(jQuery("#live-recent-list"));
                ShowAjaxRecentList2(jQuery("#live-recent-list-2"));
            }, 60 * 1000);
        }
        isAllowRequestList = true;
    }
}

jQuery(document).ready(function (jQuery) {
    recentIntervalCheck();
});
