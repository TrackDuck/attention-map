javascript:(function () {

    document.body.innerHTML += '<canvas id="canvas"></canvas>';
    var canvas = document.getElementById("canvas");
    canvas.style.zIndex = "9999";
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.position = 'fixed';

    var scrollTopStorage = 0;


//////
    function onTimerEventHandler() {
        if (scrollTopStorage !== document.body.scrollTop) {
            // console.log(document.body.scrollTop );
            scrollTopStorage = document.body.scrollTop;
            drawGrid({
                theContext: ctx
            });
        }

    }

    var ui="";
    ui += "<div style=\"background-color: #fff; \/* width:130px; *\/ height: 41px;z-index: 10001;bottom: 0;position: fixed;\">";
    ui += "<div style=\"background-color: #e8c538; width: 41px; height: 41px;float: left;text-align: center;font-size: 12px;color: #fff;line-height: 40px;\">max<\/div><div style=\"background-color: #389ee8; width: 41px; height: 41px;float: left;text-align: center; font-size: 12px; color: #fff; line-height: 40px;\">min";
    ui += "<\/div>";
    ui += "<div style=\"";
    ui += "    background-color: #fff;";
    ui += "    padding: 10px 21px;";
    ui += "    float: left;";
    ui += "\"> <input type=\"range\" id=\"rangeinput\" name=\"points\" min=\"0\" max=\"10\" style=\"";
    ui += "    width: 80px;";
    ui += "\"><\/div>  ";
    ui += "<\/div>";

    var colors = {}
    colors = {
        minH: 45,
        maxH: 205,
        S: 85,
        L: 90
    };

    var data = {
        rows: [ 9.9,
            11.1,
            15.9,
            13.7,
            11,
            7.9,
            6.1,
            6.4,
            3.1,
            2,
            1.7,
            1.4,
            1.1,
            0.8,
            0.5,
            0.2,
            0.3],

        columns: [
            11,
            13,
            15,
            15.6,
            14,
            9.8,
            7,
            6.8,
            3.8,
            2.3,
            2.1
        ]
    }
    var ctx = canvas.getContext("2d");

    var minInRows = Math.min.apply(null, data.rows);
    var minInCols = Math.min.apply(null, data.columns);


    var maxInRows = Math.max.apply(null, data.rows);
    var maxInCols = Math.max.apply(null, data.columns);

    var maxInRowsCols = maxInRows + maxInCols; //100%
    var minInRowsCols = minInRows + minInCols; //0%

    var diffRowsCols = maxInRowsCols - minInRowsCols;


    var colorDiff = colors.maxH - colors.minH;
    var perc = colorDiff / 100;
    var percData = diffRowsCols / 100;
    var foldLimit = 500;

    // console.log('minInRows' + minInRows + 'minInCols' + minInCols + 'maxInRows' + maxInRows + 'maxInCols' + maxInCols);
    // console.log('diffRowsCols' + diffRowsCols);

// Resize Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


// Define drawGrid function
    function drawGrid(options) {



// Resize Canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        var ctx = options.theContext || false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!ctx) return;

        var bkg = options.background || "rgba(0,0,0,0)";
        var txt = options.colorOfNum || "#FFFFFF";
        var num = options.displayNum || true;


        var W = ctx.canvas.width;

        var H = ctx.canvas.height;

        ctx.font = "10px Verdana";
        ctx.fillStyle = bkg;
        ctx.fillRect(0, 0, W, H);
        ctx.lineWidth = 0;

        //
        var blockHeight = 50 + (canvas.height / data.rows.length / 2);


        var blockWidth = canvas.width / data.columns.length;

        for (var bw = -1; bw < data.columns.length; bw += 1) {

            for (var bh = 0; bh < data.rows.length; bh += 1) {

                var calcPageH = Math.round(scrollTopStorage / blockHeight);

                var attrOpt = data.columns[bw] + data.rows[bh + calcPageH];
                var attrBase = data.columns[bw] + data.rows[bh];
                var attr = (attrOpt + attrBase) / 2;


                if (isNaN(attr)) {
//                    var currentCellData = attrBase / 2;
                    var currentCellData = attrBase / (scrollTopStorage/foldLimit);
                } else {
                    var currentCellData = attr;
                }


                //get it in percents
                var currentCallPercent = (currentCellData - minInRowsCols) / percData;

                //get it in color value
                var colorAttrVal = currentCallPercent * perc

                var rgb = hsvToRgb(colors.maxH - colorAttrVal, 85, 90);

                ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.9)";
                ctx.fillRect(bw * blockWidth, bh * blockHeight, blockWidth, blockHeight);


            }
        }


        for (var x = 0; x < W; x += 10) {
            ctx.beginPath();
            ctx.fillStyle = txt;
            // ctx.strokeStyle = min;
            if (x % 50 == 0) {
                //ctx.strokeStyle = maj;
                num && ctx.fillText(x, x, 10);
            }
        }

        for (var y = 0; y < H; y += 10) {
            ctx.beginPath();
            ctx.fillStyle = txt;
            //ctx.strokeStyle = min;
            if (y % 50 == 0) {
                // ctx.strokeStyle = maj;
                num && y && ctx.fillText(y, 0, y + 8);
            }
        }

    }



    var myVar = setInterval(function () {
        onTimerEventHandler()
    }, 3);


    window.addEventListener('resize', function (event) {
        drawGrid({
            theContext: ctx
        });
    });
    document.write(ui);
    var rangeInput = document.getElementById("rangeinput");
    var mainCanvas = document.getElementById("canvas");


    rangeInput.addEventListener("change", function() {
        mainCanvas.style.opacity=rangeInput.value/10;
    }, false);



    document.onreadystatechange = function () {
        var state = document.readyState
        if (state == 'interactive') {
            //init()


        } else if (state == 'complete') {
            drawGrid({
                theContext: ctx
            });






        }
    }
    /**
     * HSV to RGB color conversion
     *
     * H runs from 0 to 360 degrees
     * S and V run from 0 to 100
     *
     * Ported from the excellent java algorithm by Eugene Vishnevsky at:
     * http://www.cs.rit.edu/~ncs/color/t_convert.html
     */
    function hsvToRgb(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;

        if (s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            default: // case 5:
                r = v;
                g = p;
                b = q;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
})();

