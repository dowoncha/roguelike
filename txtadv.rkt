#lang racket

(define names (make-hash))
(define elements (make-hash))

(define (record-element! name val)
    (hash-set! names name val)
    (hash-set! elements val name))

(define-syntax-rule (define-place id desc [thing] ([verb expr]))
    (begin
        (define id (place desc
            (list thing)
            (list (cons verb (lambda () expr)))))
        (record-element! 'id id)))