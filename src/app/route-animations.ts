// Custom router-animation class which defines the animations between components (LJLG)
import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
    sequence,
    stagger,
    // ...
} from '@angular/animations';

// Fader animation
export const fader =
    trigger('routerAnimations', [
        // Transition will run for: (component) to/from (component)
        transition('* <=> *', [
            // End CSS styles applied when component leaves or enters
            query(':enter, :leave', [
                style({
                    position: 'fixed',
                    /* left: 0, */
                    width: '100%',
                    opacity: 0,
                    transform: 'scale(0) translateY(100%)',
                }),
            ], { optional: true }),
            query(':enter', [
                animate('500ms ease',
                    style({
                        opacity: 1,
                        transform: 'scale(1) translateY(0)',
                    })
                ),
            ], { optional: true }),
        ]),
    ]);

// Modal popup animation
export const modalPopup =
    trigger('modalPopup', [
        transition(':enter', [
            style({
                /* position: 'fixed', */
                top: '50%',
                left: '50%',
                height: '0%',
                width: '0%',
                opacity: 0,
                'overflow-y': 'hidden',
            }),
            animate('500ms ease', style({
                /* position: 'fixed', */
                top: '0',
                left: '0',
                height: '100%',
                width: '100%',
                opacity: 1,
                'overflow-y': 'auto',
            })),
        ]),
        transition(':leave', [
            animate('500ms ease', style({
                /* position: 'fixed', */
                top: '50%',
                left: '50%',
                height: '0%',
                width: '0%',
                opacity: 0,
                'overflow-y': 'hidden',
            }))
        ])
    ]);

// Slider Animation
export const slider =
    trigger('routerAnimations', [
        // To right
        transition(':increment', slideTo('right')),
        // To left
        transition(':decrement', slideTo('left')),
    ]);

export const inOutAnimation =
    trigger('inOutAnimation', [
        transition('* => *', [ // each time the binding value changes
            query(':leave', [
                stagger(50, [
                    style({ transform: 'translateX(0%)', opacity: 1 }),
                    animate('0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                        style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ], { optional: true }),
            query(':enter', [
                style({ opacity: 0 }),
                stagger(50, [
                    style({ transform: 'translateX(-100%)', opacity: 0 }),
                    animate('0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                        style({ transform: 'translateX(0%)', opacity: 1 }))
                ])
            ], { optional: true })
        ])
    ]);

// Function called to apply styles dynamically for (param)
function slideTo(direction) {
    const pageSlideAnimation = '0.75s cubic-bezier(0.76, 0, 0.24, 1)';
    const optional = { optional: true };
    if (direction === 'right') {
        return [
            query(':enter, :leave', [
                style({
                    position: 'fixed',
                    width: '100%',
                })
            ], optional),
            /* query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], optional), */
            group([
                query(':enter', [
                    style({ transform: 'translateX(100%)' }),
                    animate(pageSlideAnimation, style({ transform: 'translateX(0%)' }))
                ], optional),
                query(':leave', [
                    style({ transform: 'translateX(0%)' }),
                    animate(pageSlideAnimation, style({ transform: 'translateX(-100%)' }))
                ], optional),
            ])
        ];
    } else {
        return [
            query(':enter, :leave', [
                style({
                    position: 'fixed',
                    width: '100%',
                })
            ], optional),
            /*
            query(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], optional), */
            group([
                query(':enter', [
                    style({ transform: 'translateX(-100%)' }),
                    animate(pageSlideAnimation, style({ transform: 'translateX(0%)' }))
                ], optional),
                query(':leave', [
                    style({ transform: 'translateX(0%)' }),
                    animate(pageSlideAnimation, style({ transform: 'translateX(100%)' }))
                ], optional),
            ])
        ];
    }
}
