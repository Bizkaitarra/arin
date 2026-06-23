# Serve the application
up:
	ionic serve

# Build the Android application
build:
	ionic build && npx cap sync android

# Run tests once and exit
test:
	npx vitest run

# Run tests in watch mode
test-development:
	npx vitest
