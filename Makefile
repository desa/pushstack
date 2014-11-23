# usage:
# `make` or `make test` runs all the tests
# `make google` runs just the test/google.coffee test
.PHONY: test clean test-cov

TESTS = \
  sign-in \
  q-and-a \

all: test

test: $(TESTS)

$(TESTS):
	DEBUG=pushstack* NODE_ENV=test node_modules/mocha/bin/mocha --reporter spec --bail --timeout 60000 pages/$@/test.coffee
