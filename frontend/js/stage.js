function Stage() {
    let defaults = {
        dom: null,
        w: null,
        h: null
    }
    this.t = 0;
    this.contain = [];
    let canvas = document.createElement('canvas');
    if (arguments[0] && arguments instanceof Object) {
        copyProperty(defaults, arguments[0]);
    }
    if (defaults.dom && defaults.dom.tagName === 'DIV') {
        defaults.dom.appendChild(canvas);
    } else if (defaults.dom && defaults.dom.tagName === 'CANVAS') {
        canvas = defaults.dom;
    } else {
        document.body.appendChild(canvas);
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.right = '0';
        canvas.style.bottom = '0';
        canvas.style.left = '0';
        canvas.style.margin = ' 0 auto';
        canvas.style.zIndex = '-1';
    }
    let self = this;
    let ctx = canvas.getContext('2d');
    let w = canvas.width = defaults.w || canvas.parentNode.offsetWidth;
    let h = canvas.height = defaults.h || canvas.parentNode.offsetHeight;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    window.addEventListener('resize', function() {
        w = canvas.width = defaults.w || canvas.parentNode.offsetWidth;
        h = canvas.height = defaults.h || canvas.parentNode.offsetHeight;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
    });
    for (let i = 0; i < 10; i++) {
        let obj;
        obj = new Ball();
        obj.init(ctx);
        this.contain.push(obj);
    }
    for (let i = 0; i < this.contain.length; i++) {
        for (let j = 0; j < this.contain.length; j++) {
            if (this.contain[i].l + this.contain[i].r < this.contain[j].l + this.contain[j].r) {
                let t = this.contain[i];
                this.contain[i] = this.contain[j];
                this.contain[j] = t;
            }
        }
    }
    for (let i = 0; i < this.contain.length; i++) {
        this.contain[i].index = i;
        console.log(this.contain[i].l, this.contain[i].index);
    }

    window.addEventListener('mousedown', function(e) {
        e = e || window.event;
        let x = e.clientX;
        let y = e.clientY;
        let clicks = []
        for (let i = 0; i < self.contain.length; i++) {
            let o = self.contain[i];
            if (Math.pow(o.x - x, 2) + Math.pow(o.y - y, 2) < Math.pow(o.r, 2)) {
                clicks.push(o);
            }
        }
        for (let i = 1; i < clicks.length; i++) {
            if (clicks[0].index < clicks[i].index) {
                clicks[0] = clicks[i];
            }
        }
        if (clicks[0]) {
            clicks[0].speedX = [-1, 1][~~(Math.random() * 2)];
            clicks[0].speedY = -10;
            console.log(clicks[0].l, clicks[0].index);
        }
    });

    flush();

    function flush() {
        ctx.fillStyle = "rgba(0, 0, 0, .51)";
        ctx.fillRect(0, 0, w, h);

        self.animation && self.animation(w, h, ctx)
        requestAnimationFrame(flush);
    };

    function copyProperty(dist, src) {
        for (let p in src) {
            dist[p] = src[p] || dist[p];
        }
    }


}
Stage.prototype = {
    animation: function(w, h, ctx) {
        let fps = 1000 / (new Date().getTime() - this.t);
        this.t = new Date().getTime();
        ctx.fillStyle = 'red';
        ctx.fillRect(100, 100, 100, 100);
        for (let i = 0; i < this.contain.length; i++) {
            this.contain[i].update();
        }
    }
}

function Ball() {


}
Ball.prototype = {
    init: function(ctx) {
        this.ctx = ctx;
        this.r = randomCustom(10, 50);
        this.x = randomCustom(this.r, window.innerWidth);
        this.y = 0;
        this.l = randomCustom((window.innerHeight) - this.r * 3, (window.innerHeight) - this.r);
        this.speedY = 0;
        this.speedX = randomCustom(1, 10);
        this.a = 9.8 / 60;
        this.rote = 0;
    },
    update: function() {
        // if(this.y >= this.l)
        if (this.speedY < 0) {
            this.a = 15 / 60;
        } else {
            this.a = 9.8 / 60;
        }
        this.speedY += this.a;
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x >= window.innerWidth - this.r) {
            this.x = window.innerWidth - this.r;
            this.speedX *= -1;
        }
        if (this.x <= this.r) {
            this.x = this.r;
            this.speedX *= -1;
        }
        if (this.y >= this.l) {
            this.y = this.l;
            this.speedY *= -1;
            this.speedX *= 0.99;
        }

        this.draw();
    },
    draw: function() {
        let ctx = this.ctx;
        let color = ctx.createRadialGradient(this.x + this.r * .1, this.y - this.r * .1, this.r * .1, this.x, this.y, this.r);
        color.addColorStop(0, '#0ff');
        color.addColorStop(1, '#308');
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();

        let deg = Math.PI * 2 / 12;

        this.rote += this.speedX * (.1);
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(deg * this.rote);
        ctx.beginPath();
        ctx.moveTo(-this.r, 0);
        ctx.lineTo(this.r, 0);
        ctx.strokeStyle = 'red'
        ctx.stroke();
        // for (let i = 1; i < 13; i++) {
        //     let x = Math.sin(deg * i) * this.r;
        //     let y = -Math.cos(deg * i) * this.r;
        //     ctx.fillStyle = '#fff';
        //     ctx.font = 'bold ' + this.r * .1 + 'px 华文彩云';
        //     ctx.textBaseline = 'middle';
        //     ctx.textAlign = 'center';
        //     ctx.fillText(i, x, y);
        // }

        ctx.restore();
    },
}

function randomCustom(min, max) {
    return ~~(Math.random() * (max - min) + min);
}