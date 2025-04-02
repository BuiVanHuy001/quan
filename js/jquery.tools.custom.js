(function ($) {
    $.tools = $.tools || {version: '1.2.6'};
    $.tools.tabs = {
        conf: {
            tabs: 'a',
            current: 'current',
            onBeforeClick: null,
            onClick: null,
            effect: 'default',
            initialIndex: 0,
            event: 'click',
            rotate: !1,
            history: !1,
            currentClose: !1,
            anotherClose: !0
        }, addEffect: function (name, fn) {
            effects[name] = fn
        }
    };
    var effects = {
        'default': function (i, done) {
            var conf = this.getConf(), panes = this.getPanes();
            if (conf.anotherClose) panes.hide();
            panes.eq(i).show()
        }, fade: function (i, done) {
            var conf = this.getConf(), speed = conf.fadeOutSpeed, panes = this.getPanes();
            if (conf.anotherClose) {
                if (speed) {
                    panes.fadeOut(speed)
                } else {
                    panes.hide()
                }
            }
            panes.eq(i).fadeIn(conf.fadeInSpeed, done)
        }, slide: function (i, clickOnCurrent, done) {
            var conf = this.getConf(), panes = this.getPanes();
            if (!conf.anotherClose) {
                panes.eq(i).slideToggle(conf.slideDownSpeed, done)
            } else {
                if (clickOnCurrent && conf.currentClose) {
                    panes.eq(i).slideToggle(conf.slideDownSpeed, done)
                } else {
                    panes.slideUp(conf.slideUpSpeed);
                    panes.eq(i).slideDown(conf.slideDownSpeed, done)
                }
            }
        }, ajax: function (i, done) {
            this.getPanes().eq(0).load(this.getTabs().eq(i).attr("href"), done)
        }
    };

    function Tabs(root, paneSelector, conf) {
        var self = this, trigger = root.add(this), tabs = root.find(conf.tabs),
            panes = paneSelector.jquery ? paneSelector : root.find(paneSelector), current;
        if (!tabs.length) {
            tabs = root.children()
        }
        if (!panes.length) {
            panes = root.parent().find(paneSelector)
        }
        if (!panes.length) {
            panes = $(paneSelector)
        }
        $.extend(this, {
            click: function (i, e) {
                var tab = tabs.eq(i);
                var clickOnCurrent = !1;
                if (typeof i == 'string' && i.replace("#", "")) {
                    tab = tabs.filter("[href*=" + i.replace("#", "") + "]");
                    i = Math.max(tabs.index(tab), 0)
                }
                if (conf.rotate) {
                    var last = tabs.length - 1;
                    if (i < 0) {
                        return self.click(last, e)
                    }
                    if (i > last) {
                        return self.click(0, e)
                    }
                }
                if (!tab.length) {
                    if (current >= 0) return self;
                    if (conf.initialIndex < 0) return self;
                    i = conf.initialIndex;
                    tab = tabs.eq(i)
                }
                if (i === current) clickOnCurrent = !0;
                if (clickOnCurrent && !conf.currentClose) {
                    return self
                }
                e = e || $.Event();
                e.type = "onBeforeClick";
                if ($.isFunction(conf.onBeforeClick)) {
                    conf.onBeforeClick(e, i)
                }
                if (e.isDefaultPrevented()) {
                    return
                }
                effects[conf.effect].call(self, i, clickOnCurrent, function () {
                    current = i;
                    e.type = "onClick";
                    if ($.isFunction(conf.onClick)) {
                        conf.onClick(e, i)
                    }
                });
                if (clickOnCurrent && conf.currentClose) {
                    tab.toggleClass(conf.current)
                } else {
                    if (conf.anotherClose) tabs.removeClass(conf.current);
                    tab.toggleClass(conf.current)
                }
                return self
            }, getConf: function () {
                return conf
            }, getTabs: function () {
                return tabs
            }, getPanes: function () {
                return panes
            }, getCurrentPane: function () {
                return panes.eq(current)
            }, getCurrentTab: function () {
                return tabs.eq(current)
            }, getIndex: function () {
                return current
            }, next: function () {
                return self.click(current + 1)
            }, prev: function () {
                return self.click(current - 1)
            }, destroy: function () {
                tabs.unbind(conf.event).removeClass(conf.current);
                panes.find("a[href^=#]").unbind("click.T");
                return self
            }
        });
        tabs.each(function (i) {
            $(this).bind(conf.event, function (e) {
                self.click(i, e);
                return e.preventDefault()
            })
        })
    }

    $.fn.tabs = function (paneSelector, conf) {
        var el = this.data("tabs");
        if (el) {
            el.destroy();
            this.removeData("tabs")
        }
        if ($.isFunction(conf)) {
            conf = {onBeforeClick: conf}
        }
        conf = $.extend({}, $.tools.tabs.conf, conf);
        this.each(function () {
            el = new Tabs($(this), paneSelector, conf);
            $(this).data("tabs", el)
        });
        return conf.api ? el : this
    }
})(jQuery)