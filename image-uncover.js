/**
 * Created by The Yur on 16.01.14.
 */

(function ($) {
    var o, o_, f, timer, $lastCell;

    $.fn.coverImage = function (settings) {
        if ($.type(settings) !== 'object') settings = {};

        var $this = $(this);

        var cellWidth = Math.round($this.width() / settings.ic_param_pieces_x);
        var cellHeight = Math.round($this.height() / settings.ic_param_pieces_y);

        $(
            '<style type="text/css"> .ic-cell {' +
                'position: absolute;' +
                'width: ' + cellWidth + 'px;' +
                'height: ' + cellHeight + 'px;' +
                'background: url("' + settings.ic_param_cover_image + '") no-repeat;' +
                '}' +
                '</style>'
        ).appendTo('head');

        $this.css({
            'position': 'relative',
            'display': 'block',
            'margin': 'auto'
        });

        $this.mouseleave(function () {
            var o = $lastCell.data('opacity');
            typeof o === 'undefined' ? $lastCell.css('opacity', '0') : $lastCell.css('opacity', o);
        });

        $this.append('<div></div><div></div>');

        $this.children().first().css({
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'background': 'url("' + settings.ic_param_bkg_image + '") no-repeat',
            'z-index': '0',
            'float': 'left'
        });

        var $cellsHolder = $this.children().last();
        $cellsHolder.css({
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'z-index': '1',
            'float': 'left'
        });

        for (var i = 0; i < settings.ic_param_pieces_x; i++) {
            for (var j = 0; j < settings.ic_param_pieces_y; j++) {
                var _h, _w;
                $cellsHolder.append(
                    '<div id="ic-' + i + '_' + j + '" ' +
                        'class="ic-cell"' +
                        'style="opacity: 0.0; top: ' + (_h = i * cellHeight) + 'px; left: ' + (_w = j * cellWidth) + 'px; background-position: -' + _w + 'px -' + _h + 'px;"' +
                        '></div>'
                );
            }
        }

        $cellsHolder.children().each(function () {
            $(this)
                .mouseenter(function () {
                    $(this).showSpot({
                            circles: [1.0, 0.7, 0.4, 0.2, 0.1],
                            bias: 0.1}
                    );
                })
                .mouseleave(function () {
                    $(this).showSpot({
                            circles: [0, 0, 0, 0, 0],
                            bias: 0},
                        false,
                        true
                    ).css('opacity', '0');
                })
                .click(function () {
                    $(this).setSpot({
                            circles: [1.0, 0.7, 0.4, 0.2, 0.1],
                            bias: 0.1}
                    );
                });
        });
    };

    /**
     * Returns collection of neighbour of the cell from the _circle_ around
     *
     * @param circle around the cell
     */
    $.fn.neighbours = function (circle) {
        var $this = $(this);

        var curIdx = $this.attr('id').substr(3).split('_');
        var X = +curIdx[0], Y = +curIdx[1];

        var s = '', firstTime = true;

        // Start from upper-left corner
        for (var i = X - circle; i <= X + circle; i++) {

            if (i < 0) continue;

            for (var j = Y - circle; j <= Y + circle; j++) {

                if (j < 0) continue;
                if (i == X && j == Y) continue;
                if (i > X - circle && i < X + circle && j > Y - circle && j < Y + circle) continue;

                if (!firstTime) s += ', ';
                s += '#ic-' + i + '_' + j;
                firstTime = false;
            }
        }
        return $(s);
    };

    $.fn.showSpot = function (p, stored, clear) {
        stored = typeof stored !== 'undefined' ? stored : false;
        clear = typeof clear !== 'undefined' ? clear : false;
        var $this = $lastCell = $(this);

        $this.css('opacity', clear ? '0' : '1.0');
        if (stored == 'store') $this.data('opacity', '1.0');

        var drawSpot = function (i, v) {
            $this.neighbours(i + 1).each(function () {
                var $t = $(this);
                switch (stored) {
                    case 'store' :
                        o = $t.data('opacity');
                        if (typeof o === 'undefined')
                            $t
                                .css('opacity', o = useBias(p.bias, v))
                                .data('opacity', o);
                        else
                            $t
                                .css('opacity', o_ = '' + (+o + +useBias(p.bias, v)))
                                .data('opacity', o_);
                        break;

                    default :
                        o = $t.data('opacity');

                        if (typeof o === 'undefined')
                            $t.css('opacity', clear ? '0' : useBias(p.bias, v));
                        else
                            $t.css('opacity', '' + (+o + +(clear ? '0' : useBias(p.bias, v))));
                }
            });
        };

        $.each(p.circles, function (i, v) {
            drawSpot(i, v);
        });
        return $this;
    };

    $.fn.setSpot = function (p) {
        $(this).showSpot(p, 'store');
    };

    function useBias(bias, v) {
        var r = Math.random();
        v = +v;
        return '' + ((r < 0.3) ? v - bias : (r > 0.6) ? v + bias : v);
    }

})(jQuery);