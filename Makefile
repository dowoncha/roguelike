SRCDIR = src
BUILDDIR = build

rogue: main.rkt
	raco exe -o rogue --gui main.rkt

clean:
	rm rogue