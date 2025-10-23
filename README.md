# SV - Full Stack Application

A full-stack web application with a React frontend and Python FastAPI backend.

## Project Overview

This repository contains:
- **Frontend**: React-based web application built with Create React App, Tailwind CSS, and Radix UI components
- **Backend**: Python FastAPI server with MongoDB integration
- **Testing**: Automated testing for both frontend and backend
- **CI/CD**: GitHub Actions workflow for continuous integration

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - for frontend development
- **npm** or **yarn** - package manager for JavaScript dependencies
- **Python** (3.10 or 3.11) - for backend development
- **pip** - package manager for Python dependencies
- **Git** - version control

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend will be available at `http://localhost:3000`

4. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

### Backend Setup

1. Navigate to the backend directory (or repository root if requirements.txt is at root):
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python server.py
   # or use uvicorn directly
   uvicorn server:app --reload
   ```

   The backend API will be available at `http://localhost:8000`

## Running Tests

### Frontend Tests

To run frontend tests:
```bash
cd frontend
npm test
# or
yarn test
```

Tests use React Testing Library and Jest. The test runner will watch for changes and re-run tests automatically.

### Backend Tests

To run backend tests:
```bash
# From repository root
pytest backend_test.py

# Or if in backend directory
cd backend
pytest
```

You can also run tests with coverage:
```bash
pytest --cov=backend backend_test.py
```

## Code Quality

### Linting and Formatting

#### JavaScript/React (Frontend)

This project uses **ESLint** for linting and **Prettier** for code formatting.

- **Run ESLint**:
  ```bash
  cd frontend
  npx eslint src/
  ```

- **Auto-fix ESLint issues**:
  ```bash
  npx eslint src/ --fix
  ```

- **Run Prettier**:
  ```bash
  npx prettier --check src/
  ```

- **Auto-format with Prettier**:
  ```bash
  npx prettier --write src/
  ```

#### Python (Backend)

This project uses **Black** for code formatting and **isort** for import sorting.

- **Run Black**:
  ```bash
  black backend/ --check
  ```

- **Auto-format with Black**:
  ```bash
  black backend/
  ```

- **Run isort**:
  ```bash
  isort backend/ --check-only
  ```

- **Auto-format with isort**:
  ```bash
  isort backend/
  ```

- **Run Flake8** (linting):
  ```bash
  flake8 backend/
  ```

## Continuous Integration (CI)

This project uses **GitHub Actions** for continuous integration. The CI workflow automatically runs on:
- Push to any branch
- Pull requests to any branch

### What the CI does:

1. **Checkout code** - Retrieves the latest code from the repository
2. **Set up Python** - Installs Python 3.10 and 3.11 (matrix strategy)
3. **Set up Node.js** - Installs Node.js v18
4. **Frontend tests** (if `frontend/package.json` exists):
   - Installs dependencies with `npm ci`
   - Runs tests with `npm test`
5. **Backend tests** (if `backend/requirements.txt` or root `requirements.txt` exists):
   - Installs Python dependencies
   - Runs tests with `pytest`

The workflow is defined in `.github/workflows/ci.yml` and will fail if any tests fail, ensuring code quality before merging.

### Viewing CI Results

- Navigate to the **Actions** tab in the GitHub repository
- Click on a specific workflow run to see detailed logs
- Green checkmarks indicate passing tests
- Red X marks indicate failing tests

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI workflow
├── frontend/                # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   ├── package.json        # Node dependencies and scripts
│   └── ...config files     # ESLint, Prettier, Tailwind, etc.
├── backend/                # Python FastAPI backend
│   ├── server.py           # Main FastAPI application
│   └── requirements.txt    # Python dependencies
├── tests/                  # Additional test files
├── backend_test.py         # Backend test suite
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── pyproject.toml          # Python formatting config (Black, isort)
└── README.md               # This file
```

## Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Run linters and formatters locally
4. Run tests locally to ensure they pass
5. Commit your changes with descriptive commit messages
6. Push your branch and create a pull request
7. Wait for CI checks to pass
8. Request a code review

## License

[Add your license information here]

## Support

For issues or questions, please open an issue in the GitHub repository.
