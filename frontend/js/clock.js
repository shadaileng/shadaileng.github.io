(function () {
    this.Clock = function () {
        let defaults = {
            pDom: null,
            w: 400,
            h: 400,
            canvas: document.createElement('canvas'),
        }
        if (arguments[0] && arguments[0] instanceof Object) {
            copyProperty(defaults, arguments[0]);
        }
        if (defaults.pDom === 1) {
            let div = document.createElement('div');
            div.style.height = '100%';
            div.style.width = window.innerHeight + "px";
            div.style.margin = "0 auto";
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.right = '0';
            div.style.bottom = '0';
            div.style.left = '0';
            document.body.appendChild(div);
            defaults.pDom = div;
        }
        let ctx = defaults.canvas.getContext('2d');
        defaults.pDom ? (defaults.w = defaults.pDom.offsetWidth, defaults.h = defaults.pDom.offsetHeight) : (defaults.w = window.innerWidth, defaults.h = window.innerHeight);
        let w = defaults.canvas.width = defaults.w;
        let h = defaults.canvas.height = defaults.h;
        defaults.canvas.style.width ? "" : defaults.canvas.style.width = defaults.w + "px";
        defaults.canvas.style.height ? "" : defaults.canvas.style.height = defaults.h + "px";
        window.onresize = function () {
            w = defaults.canvas.width = defaults.pDom ? defaults.pDom.offsetWidth : window.innerWidth;
            h = defaults.canvas.height = defaults.pDom ? defaults.pDom.offsetHeight : window.innerHeight;
            defaults.canvas.style.width = w + "px";
            defaults.canvas.style.height = h + "px";
        }
        defaults.pDom ? defaults.pDom.appendChild(defaults.canvas) : (defaults.canvas.style.position = 'absolute', defaults.canvas.style.top = '0', document.body.appendChild(defaults.canvas));
        flush();

        function flush() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, w, h);
            let rw = 3 * w / 8;
            let rh = 3 * h / 8;
            let deg = Math.PI * 2 / 12;
            //表盘
            ctx.beginPath();
            for (let i = 0; i < 13; i++) {
                let x = Math.sin(i * deg) * rw + w / 2;
                let y = Math.cos(i * deg) * rh + h / 2;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            let color = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w > h ? w / 2 : h / 2);
            color.addColorStop(0, "#368");
            color.addColorStop(1, "#0ff");
            ctx.fillStyle = color;
            ctx.fill();
            //刻度
            ctx.strokeStyle = '#FFF';
            for (let i = 0; i < 60; i++) {
                let x = Math.sin(i * deg / 5);
                let y = Math.cos(i * deg / 5);
                ctx.beginPath();
                if (i % 5 == 0) {
                    ctx.lineWidth = 2;
                    ctx.moveTo(x * rw * .95 + w / 2, y * rh * .95 + h / 2);
                    ctx.lineTo(x * rw + w / 2, y * rh + h / 2);
                } else {
                    ctx.lineWidth = 1;
                    ctx.moveTo(x * rw * .97 + w / 2, y * rh * .97 + h / 2);
                    ctx.lineTo(x * rw * .95 + w / 2, y * rh * .95 + h / 2);
                }
                ctx.closePath();
                ctx.stroke();
            }
            //数字
            for (let i = 1; i < 13; i++) {
                let x = Math.sin(i * deg);
                let y = -Math.cos(i * deg);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 20px 华文彩云';
                ctx.textBaseline = 'middle';
                ctx.fillText(i, x * rw * .85 + w / 2 - 9, y * rh * .8 + h / 2);
            }
            let now = new Date();
            let h_ = now.getHours() % 12 * Math.PI * 2 / 12;
            let m_ = now.getMinutes() * Math.PI * 2 / 60;
            let s_ = now.getSeconds() * Math.PI * 2 / 60;
            //秒针
            hand({
                rad: s_,
                length: { rw: rw * .75, rh: rh * .75 },
                color: '#F44',
                width: 1,
            });
            //分针
            hand({
                rad: m_ + s_ / 60,
                length: { rw: rw * .7, rh: rh * .7 },
                color: '#F88',
                width: 2,
            });
            //时针
            hand({
                rad: h_ + m_ / 60,
                length: { rw: rw * .6, rh: rh * .6 },
                color: '#F44',
                width: 3,
            });

            requestAnimationFrame(flush);
        }
        function hand(param) {
            let p = {
                rad: 0,
                center: { x: w / 2, y: h / 2 },
                length: { rw: .4 * w, rh: 04 * h },
                width: 1,
                color: '#F00',
            }
            copyProperty(p, param);
            ctx.beginPath();
            let x = Math.sin(p.rad);
            let y = -Math.cos(p.rad);
            ctx.moveTo(p.center.x, p.center.y);
            ctx.lineTo(x * p.length.rw + p.center.x, y * p.length.rh * .7 + p.center.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.width;
            ctx.stroke();
            ctx.closePath();
        }


        function copyProperty(dist, src) {
            for (let p in src) {
                dist[p] = src[p] || dist[p];
            }
        }
    }
}());