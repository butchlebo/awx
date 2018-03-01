const SCROLL_DELAY = 250;

function JobScrollService ($q, $timeout) {
    this.init = (el, hooks) => {
        this.el = el;
        this.timer = null;
        this.position = 0;
        this.isLocked = false;
        this.isPaused = false;
        this.isAtTop = true;

        this.hooks = {
            isAtTop: hooks.isAtTop,
            next: hooks.next,
            previous: hooks.previous,

        };

        this.el.scroll(this.listen);
    };

    this.listen = () => {
        if (this.isPaused) {
            return;
        }

        if (this.timer) {
            $timeout.cancel(this.timer);
        }

        this.timer = $timeout(this.register, SCROLL_DELAY);
    };

    this.toggleAtTopFlag = (position) => {
        if (position === 0 && !this.isAtTop) {
            this.isAtTop = true;
            this.hooks.isAtTop(true);
        } else if (position > 0 && this.isAtTop) {
            this.isAtTop = false;
            this.hooks.isAtTop(false);
        }

        this.isAtTop = !this.isAtTop;
    };

    this.register = () => {
        this.pause();

        const position = this.el[0].scrollTop;
        const height = this.el[0].offsetHeight;

        const downward = position > this.position;

        let promise;
        let scrollDirection;

        // Use hook to report backtotop
        /*
         *if (position !== 0 ) {
         *    vm.scroll.showBackToTop = true;
         *} else {
         *    vm.scroll.showBackToTop = false;
         *}
         */

        console.log('downward', downward, position, vm.scroll.position);
        if (downward) {
            if (((height - position) / height) < SCROLL_THRESHOLD) {
                promise = next;
            }
        } else {
            if ((position / height) < SCROLL_THRESHOLD) {
                promise = previous;
            }
        }

        this.position = position;

        if (!promise) {
            this.resume();

            return $q.resolve();
        }

        return promise()
            .then(() => {
                this.pause();
            });
    };

    this.home = () => {

    };

    this.end = () => {

    };

    this.pageUp = () => {

    };

    this.pageDown = () => {

    };

    this.resume = () => {
        this.isPaused = false;
    };

    this.pause = () => {
        this.isPaused = true;
    };

    this.lock = () => {

    };

    this.unlock = () => {

    };
}

JobScrollService.$inject = ['$q', '$timeout'];
