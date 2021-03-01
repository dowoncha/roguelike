#lang racket

(require "txtadv.rkt")

(define north (verb (list 'north 'n) "go north" #f))
(record-element! 'north north)

(define south (verb (list 'south 's) "go south" #f))
(record-element! 'south south)

(define east (verb (list 'east 'e) "go east" #f))
(record-element! 'east east)

(define west (verb (list 'west 'w) "go west" #f))
(record-element! 'west west)

(define up (verb (list 'up) "go up" #f))
(record-element! 'up up)

(define down (verb (list 'down) "go down" #f))
(record-element! 'down down)

(define in (verb (list 'in 'enter) "enter" #f))
(record-element! 'in in)

(define out (verb (list 'out 'leave) "leave" #f))
(record-element! 'out out)

(define get (verb (list 'get 'grab 'take) "take" #t))
(record-element! 'get get)

(define put (verb (list 'put 'drop 'leave) "drop" #t))
(record-element! 'put put)

(define open (verb (list 'open 'unlock) "open" #t))
(record-element! 'open open)

(define close (verb (list 'close 'lock) "close" #t))
(record-element! 'close close)

(define knock (verb (list 'knock) (symbol->string 'knock) #t))
(record-element! 'knock knock)

(define quit (verb (list 'quit 'exit) "quit" #f))
(record-element! 'quit quit)

(define look (verb (list 'look 'show) "look" #f))
(record-element! 'look look)

(define inventory (verb (list 'inventory) "check inventory" #f))
(record-element! 'inventory inventory)

(define help (verb (list 'help) (symbol->string 'help) #f))
(record-element! 'help help)

(define save (verb (list 'save) (symbol->string 'save) #f))
(record-element! 'save save)

(define load (verb (list 'load) (symbol->string 'load) #f))
(record-element! 'load load)

(define all-verbs
  (list north south east west up down in out
        get put open close knock quit
        look inventory help save load))

;; Global actions ----------------------------------------
;; Handle verbs that work anywhere.

(define everywhere-actions
  (list
   (cons quit (lambda () (begin (printf "Bye!\n") (exit))))
   (cons look (lambda () (show-current-place)))
   (cons inventory (lambda () (show-inventory)))
   (cons save (lambda () (save-game)))
   (cons load (lambda () (load-game)))
   (cons help (lambda () (show-help)))))

(define-thing cactus [get "Ouch"])

(define-thing door
    [open 
        (if (have-thing? key)
            (begin
            (set-thing-state! door 'open)
            "The door is now unlocked and open.")
            "The door is locked.")]
    [close 
        (begin
            (set-thing-state! door #f)
            "The door is now closed.")]
    [knock "No one is home."]
)

(define-thing key
    [get (if (have-thing? key)
                      "You already have the key."
                      (begin
                        (take-thing! key)
                        "You now have the key."))]
    [put (if (have-thing? key)
                      (begin
                        (drop-thing! key)
                        "You have dropped the key.")
                      "You don't have the key.")])
(define-thing trophy
    [get (begin (take-thing! trophy) "You win!")])

(define-place meadow 
    "You're standing in a meadow. There is a house to the north."
    []
    ([north house-front] [south desert]))

(define-place house-front
    "You are standing in front of a house."
    [door]
    ([in (if (eq? (thing-state door) 'open)
                room
                "The door is not open.")] [south meadow]))

(define-place desert
    "You're in a desert. There is nothing for miles around."
    [cactus key]
    ([north meadow] [south desert] [east desert] [west desert]))

(define-place room
    "You're in the house."
    [trophy]
    ([out house-front]))


(start-game meadow
    all-verbs
    everywhere-actions)



