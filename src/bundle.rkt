#lang racket

;;; (define (explode s) )

(define (explode s) (string->list s))

; [List-of 1String] N -> [List-of String]
; bundles chunks of s into strings of length n
(define (bundle s n) `(,(take s n) ,(bundle (list-tail s n) n)))

(printf (bundle (explode "abcdefg") 2))

;;; (eq? (bundle (explode "abcdefg") 2) '(ab cd ef g))
;;; (eq? (bundle (explode "abcdefg") 3) '(abc def g))

