#lang racket

(define screen%
    (class object%
        (define/public (update key-event)
            (error 'screen% "override this method"))
        (define/public (draw canvas)
            (error 'screen% "override this method"))
        (super-new)))