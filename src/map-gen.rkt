#lang racket

(require 2htdp/image)

(define out 
    (overlay
        (text "#" 32 "black")
        (empty-scene 1024 1024)
    )
)

(image? out)

(save-image out "map1.png")