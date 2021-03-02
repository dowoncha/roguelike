SRCDIR = src
BUILDDIR = build

build: world.rkt
	raco exe world.rkt 

client: client.rkt
	raco exe --gui client.rkt

clean:
	rm -rf build