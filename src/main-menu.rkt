#lang racket

(require "screen.rkt")

(define main-menu-screen%
    (class screen%
        (define/override (update key-event)
            this)
        (define/override (draw canvas)
            (send canvas clear)
            (send canvas write-center "Rougelike" 10)
            (send canvas write-center "Press any key to continue" 12))
        (super-new)
    )
)
