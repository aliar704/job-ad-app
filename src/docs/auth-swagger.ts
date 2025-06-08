
export const authSwagger = {
  '/api/auth/signup': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'full_name', 'role', 'phone', 'birth_date'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', minLength: 6, example: 'securePassword123' },
                full_name: { type: 'string', minLength: 3, maxLength: 30, example: 'Jane Doe' },
                role: {
                  type: 'string',
                  enum: ['jobseeker', 'employer'],
                  example: 'jobseeker',
                },
                phone: { type: 'string', example: '+1234567890' },
                birth_date: { type: 'string', format: 'date', example: '1995-05-20' },
                city: { type: 'string', nullable: true, example: 'New York' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
        },
        409: {
          description: 'Email already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 2341 },
                  message: { type: 'string', example: 'Email already registered' },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error',
        },
      },
    },
  },

  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login and get access token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', example: 'securePassword123' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful. Returns access token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4001 },
                  message: { type: 'string', example: 'Invalid email or password' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get currently authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Authenticated user information',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  email: { type: 'string', example: 'user@example.com' },
                  full_name: { type: 'string', example: 'Jane Doe' },
                  role: { type: 'string', enum: ['admin', 'jobseeker', 'employer'], example: 'jobseeker' },
                  phone: { type: 'string', example: '+1234567890' },
                  birth_date: { type: 'string', format: 'date', example: '1995-05-20' },
                  city: { type: 'string', example: 'New York' },
                  created_at: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized. Missing or invalid token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4001 },
                  message: { type: 'string', example: 'Authentication required' },
                },
              },
            },
          },
        },
      },
    },
  },
};
