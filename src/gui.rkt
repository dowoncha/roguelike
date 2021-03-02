#lang racket

(provide make-gui)

(require racket/gui racket/draw)

;; ============================================================
;; UI
; Make a static text message in the frame
;;; (define msg (new message% [parent frame]
;;;                           [label "No events so far..."]))

                          ; Make a button in the frame
;;; (new button% [parent frame]
;;;              [label "Click Me"]
;;;              ; Callback procedure for a button click:
;;;              [callback (lambda (button event)
;;;                          (send msg set-label "Button click"))])

; Derive a new canvas (a drawing window) class to handle events
(define gui%
  (class object% ; The base class is canvas%
    (init-field width height)
    (define frame 
        (new frame% 
            [label "Roguelike"] 
            [min-width width]
            [min-height height]
            ;;; [style '(no-resize-border)]
        ))
    (define canvas
        (new canvas%
            [parent frame]
            ;;; [width-in-characters width-in-chars]
            ;;; [height-in-characters height-in-chars]
        )
    )
    ; Define overriding method to handle mouse events
    ;;; (define/override (on-event event)
    ;;;   (send msg set-label "Canvas mouse"))
    ; Define overriding method to handle keyboard events
    ;;; (define/override (on-char event)
    ;;;   (send msg set-label "Canvas keyboard"))
    (send frame show #t)
    ; Call the superclass init, passing on all init args
    (super-new)))
 
; Make a canvas that handles events in the frame
(define (make-gui) (new gui% 
    [width 800]
    [height 600]
    ;;; [paint-callback
    ;;;   (lambda (canvas dc)
    ;;;     (send dc set-scale 3 3)
    ;;;     (send dc set-text-foreground "blue")
    ;;;     (send dc draw-text "Don't Panic!" 0 0))]
))

;;; (define active-screen (new main-menu-screen%))

