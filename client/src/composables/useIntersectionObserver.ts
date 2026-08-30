type IntersectionHandler = {
    (el: HTMLElement, entry: IntersectionObserverEntry): void;
};

interface Props {
    isIntersecting?: {
        handler: IntersectionHandler;
        unobserve?: boolean;
    };
    isHidden?: {
        handler: IntersectionHandler;
        unobserve?: boolean;
    };
}

export function useIntersectionObserver() {
    let observer: IntersectionObserver | null = null;

    function createObserver(
        el: HTMLElement,
        props: Props,
        obOptions?: IntersectionObserverInit
    ) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
            ...(obOptions ?? {})
        };

        observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (props.hasOwnProperty('isIntersecting')) {
                        props.isIntersecting?.handler(el, entry);

                        if (props.isIntersecting?.unobserve) {
                            obs.unobserve(el);
                        }
                    }
                } else {
                    if (props.hasOwnProperty('isHidden')) {
                        props.isHidden?.handler(el, entry);

                        if (props.isHidden?.unobserve) {
                            obs.unobserve(el);
                        }
                    }
                }
            });
        }, options);

        observer.observe(el);
    }

    function removeObserver() {
        if (!observer) {
            return;
        }

        observer.disconnect();
        observer = null;
    }

    return { createObserver, removeObserver };
}
