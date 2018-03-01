const DELAY = 100;
const THRESHOLD = 0.1;

function JobScrollService ($q, $timeout) {
    this.init = (el, hooks) => {
        this.el = el;
        this.timer = null;
        this.position = 0;

        this.hooks = {
            isAtRest: hooks.isAtRest,
            next: hooks.next,
            previous: hooks.previous
        };

        this.state = {
            locked: false,
            paused: false,
            top: true
        };

        this.el.scroll(this.listen);
    };

    this.listen = () => {
        if (this.isPaused()) {
            return;
        }

        if (this.timer) {
            $timeout.cancel(this.timer);
        }

        this.timer = $timeout(this.register, DELAY);
    };

    this.register = () => {
        this.pause();

        const height = this.getScrollHeight();
        const position = this.getScrollPosition();
        const downward = position > this.position;

        let promise;
        let scrollDirection;

        if (downward && this.isBeyondThreshold(downward, position)) {
            promise = this.hooks.next;
        } else if (!downward && this.isBeyondThreshold(downward, position)) {
            promise = this.hooks.previous;
        }

        if (!promise) {
            this.position = position;
            this.isAtRest(this.position);
            this.resume();

            return $q.resolve();
        }

        return promise()
            .then(() => {
                this.position = this.getScrollPosition();
                this.isAtRest(this.position);

                this.resume();
            });
    };

    this.isBeyondThreshold = (downward, current) => {
         const previous = this.position;
         const height = this.getScrollHeight();

         if (downward) {
            current += this.getViewableHeight();

            if (current >= height || ((height - current) / height) < THRESHOLD) {
                return true;
            }
        } else {
            if (current <= 0 || (current / height) < THRESHOLD) {
                return true;
            }
        }

        return false;
    };

    this.pageUp = () => {
        const top = this.getScrollPosition();
        const height = this.getViewableHeight();

        this.setScrollPosition(top - height);
    };

    this.pageDown = () => {
        const top = this.getScrollPosition();
        const height = this.getViewableHeight();

        this.setScrollPosition(top + height);
    };

    this.getScrollHeight = () => {
        return this.el[0].scrollHeight;
    };

    this.getViewableHeight = () => {
        return this.el[0].offsetHeight;
    };

    this.getScrollPosition = (includeScrollBarHeight) => {
        return this.el[0].scrollTop;
    };

    this.setScrollPosition = position => {
        this.position = position;
        this.el[0].scrollTop = position;
        this.isAtRest(this.position);
    };

    this.isAtRest = position => {
        if (position === undefined) {
            return this.state.top;
        }

        if (position === 0 && !this.state.top) {
            this.state.top = true;
            this.hooks.isAtRest(true);
        } else if (position > 0 && this.state.top) {
            this.state.top = false;
            this.hooks.isAtRest(false);
        }
    };

    this.resume = () => {
        this.state.paused = false;
    };

    this.pause = () => {
        this.state.paused = true;
    };

    this.isPaused = () => {
        return this.state.paused;
    };

    this.lock = () => {
        this.state.locked = true;
        this.state.paused = true;
    };

    this.unlock = () => {
        this.state.locked = false;
        this.state.paused = false;
    };

    this.isLocked = () => {
        return this.state.locked;
    };
}

JobScrollService.$inject = ['$q', '$timeout'];

export default JobScrollService;
