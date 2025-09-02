# Project Overview

This is a Node.js application written in TypeScript. Its primary purpose is to periodically fetch the latest order histories, process them according to specific business rules, and then send them to Toutbox. The application is designed to be executed as a script, which can be run manually or scheduled as a cron job.

## Directory Structure

The project follows a clean and organized folder structure, separating different parts of the application based on their function.

```
/
├─── .gitignore
├─── drizzle.config.ts
├─── package.json
├─── tsconfig.json
├─── src/
│    ├─── index.ts
│    ├─── @constants/
│    ├─── @external/
│    ├─── @shared/
│    └─── features/
└─── ...
```

- **`src/`**: This is the main folder containing all the application's source code.
- **`src/index.ts`**: The entry point of the application. This file is responsible for initializing and running the main use case.
- **`src/@constants/`**: Contains constant values used throughout the application, such as environment variables.
- **`src/@external/`**: Manages connections to external services. In this project, it's used for the database connection with Drizzle ORM.
- **`src/@shared/`**: Includes code that can be reused across different features, such as services, interfaces, and utility functions.
- **`src/features/`**: This is the core of the application, where the main business logic resides. It's organized by domain or feature (e.g., `orderHistory`, `historyLogs`).

## Architecture Style

The project is built using a **Clean Architecture** approach. This means the code is divided into layers, with the most important business logic at the center and the external dependencies (like the database) on the outer layers. This makes the application easier to maintain, test, and scale.

The main layers are:

- **Domain Layer (`features/*/domain`)**: Contains the core business logic, including models (e.g., `OrderHistory`), use cases, and repository interfaces. This layer is independent of any external framework or library.
- **Infrastructure Layer (`features/*/infra`)**: Implements the interfaces defined in the domain layer. For example, it contains the database repositories that interact with Drizzle ORM.
- **Application Layer (`src/index.ts`)**: The entry point that orchestrates the execution of the use cases.

## Key Technologies

- **Node.js**: The JavaScript runtime used to execute the application.
- **TypeScript**: A superset of JavaScript that adds static typing, improving code quality and maintainability.
- **Drizzle ORM**: A modern TypeScript ORM used to interact with the MySQL database. It provides a type-safe way to query the database.
- **esbuild**: A fast JavaScript bundler used to compile the TypeScript code into a single file for production.
- **Axios**: A promise-based HTTP client for making requests to external services (used by the `ToutboxService`).

## How to Run the Project

To run the project, you can use the following scripts defined in `package.json`:

- **`npm run build`**: Compiles the TypeScript code and creates a production-ready bundle in the `dist/` folder.
- **`npm start`**: Executes the compiled code from the `dist/` folder.
- **`npm run dev`**: Runs the application in development mode with hot-reloading, automatically restarting when a file is changed.

This architecture provides a solid foundation for building a robust and maintainable application. By understanding these core concepts, you should be well-equipped to contribute to the project.
