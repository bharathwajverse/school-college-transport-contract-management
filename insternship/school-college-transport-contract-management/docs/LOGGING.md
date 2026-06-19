# Logging Strategy

## Overview
We use a centralized logging approach in the backend to capture API requests, errors, and application events. The logs are structured to be easily parsable in production environments.

## Tools
- **Winston**: Our primary logger for recording application events.
- **Morgan**: Used as an Express middleware to log incoming HTTP requests and their responses.

## Log Levels
- **Production**: `info` level and above (e.g., `info`, `warn`, `error`).
- **Development**: `debug` level and above, providing more granular tracing for local development.

## Formats
- In **development**, logs are output in a human-readable format with colorization.
- In **production**, logs are output in a structured JSON format (which includes timestamps and service metadata) making them easily consumable by log aggregators (e.g., Datadog, ELK stack, or Render's native log streams).

## Using the Logger
To log events within the application, import the logger utility:
```javascript
const logger = require('../utils/logger');
logger.info("Informational message");
logger.error("Error occurred", { errorDetails });
```
