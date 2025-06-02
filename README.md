# JSON API Runner

A web application that allows you to execute backend services using structured JSON input.

## Overview

The JSON API Executor provides a user-friendly interface for testing and executing API calls to various backend services. It features a form-based configuration system that generates JSON payloads, which can then be executed to simulate real API responses.

## Available Services

### User Service
- `getUserProfile(id)` - Retrieve user  information
- `getUserEmail(id)` - Retrieve user email

### Image Service
- `getImageByName(imageName)` - Fetch image by name

### Math Service
- `getFibonacci(n)` - Calculate Fibonacci sequence
- `multiplyMatrices(matrixA, matrixB)` - Multiply two matrices

## Usage

1. **Select API Service**: Choose from the dropdown menu (User, Image, or Math Service)
2. **Choose Method**: Select an available method for the chosen service
3. **Configure Parameters**: Fill in the required parameters in the form
4. **Review JSON**: The JSON payload is automatically generated and can be manually edited
5. **Execute**: Click "Run APIs" to execute the API calls and view results

### Example JSON Input

```json
[
  {
    "service": "userService",
    "method": "getUserProfile",
    "params": { "userId": 123 }
  },
  {
    "service": "mathService",
    "method": "getFibonacci",
    "params": { "n": 10 }
  }
]
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash

# Navigate to project directory
cd backend

# Install dependencies
npm install

# Start development server
npm run start
```