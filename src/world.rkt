#lang s-exp "txtadv.rkt"

;; Verbs ----------------------------------------

;; This declaration must be first:
(define-verbs all-verbs
  [examine _]
  [render _]
  [swing _]
  [use _]
  [attack _]
  [loot _]
  [north (= n) "go north"]
  [south (= s) "go south"]
  [east (= e) "go east"]
  [west (= w) "go west"]
  [up (=) "go up"]
  [down (=) "go down"]
  [in (= enter) "enter"]
  [out (= leave) "leave"]  
  [get _ (= grab take) "take"]
  [put _ (= drop leave) "drop"]
  [open _ (= unlock) "open"]
  [close _ (= lock) "close"]
  [knock _]
  [quit (= exit) "quit"]
  [look (= show) "look around"]
  [inventory (=) "check inventory"]
  [help]
  [save]
  [load])

;; Global actions ----------------------------------------

;; This declaration must be second:
(define-everywhere everywhere-actions
  ([quit (begin (printf "Bye!\n") (exit))]
   [look (show-current-place)]
   [inventory (show-inventory)]
   [save (save-game)]
   [load (load-game)]
   [help (show-help)]))

;; Objects ----------------------------------------

(define-thing chest
  [examine (cdr (thing-state chest))]
  [loot 
    (if (eq? (car (thing-state chest)) 'open)
      (begin
        (take-thing! (cdr (thing-state chest)))
        "Item looted!")
      "Can't loot closed chest")]
  [open (if (have-thing? key)
            (begin
              (set-thing-state! chest (cons 'open gold))
              "Chest is open."
            ) 
            "key needed"
        )]
)
(define-thing cactus
  ([get "Ouch!"]
  [render "C"]))

(define-thing door
  [open (if (have-thing? key)
            (begin
              (set-thing-state! door 'open)
              "The door is now unlocked and open.")
            "The door is locked.")]
  [close (begin
           (set-thing-state! door #f)
           "The door is now closed.")]
  [knock "No one is home."])

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
  [get (begin
         (take-thing! trophy)
         "You win!")])

(define-thing goblin
  [attack 
    (begin 
      (if 
        (have-thing? sword) 
        (printf "You swing your sword at the goblin\n")
        (printf "You punch the goblin\n")
      )
      (remove-thing! goblin)
      "You kill the goblin!\n"
    )
  ]
  [examine "A dirty goblin"]
  [get "It pushes you!"]
  [render "g"])

(define-thing sword
  [get (begin (take-thing! sword) "You got a sword!")]
  [put (begin (drop-thing! sword) "You dropped sword!")]
  [swing "You swing your sword"])
(define-thing gold)
(define-thing spellbook
  [get (begin (take-thing! spellbook) "You got a spellbook.")])

(define-thing spawner
  [use (begin (make-thing! goblin) "Goblin spawned")])

(define-place meadow
  "You're standing in a meadow. There is a house to the north."
  [sword spawner key chest]
  ([north house-front]
   [south desert]
   [east stadium]))
(define-place house-front
  "You are standing in front of a house."
  [door]
  ([in (if (eq? (thing-state door) 'open)
           room
           "The door is not open.")]
   [south meadow]))

(define-place desert
  "You're in a desert. There is nothing for miles around."
  [cactus key]
  ([north meadow]
   [south desert]
   [east desert]
   [west desert]))

(define-place stadium
  "You're in the stadium. Summon a monster from the menu."
  [goblin]
  ([west meadow]))

(define-place room
  "You're in the house."
  [trophy]
  ([out house-front]))

;; Starting place ----------------------------------

;; The module must end with the starting place name:
meadow
