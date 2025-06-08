export const usersSwagger = {
  '/api/users/': {
    get: {
      tags: ['Users'],
      summary: 'Get list of users as admin',
      description: 'Returns an array of users with their details. Only accessible by admin users.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Shows all users list successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password_hash: { type: 'string', example: '$2b$10$somehashedpassword...' },
                    full_name: { type: 'string', example: 'Jane Doe' },
                    role: {
                      type: 'string',
                      enum: ['admin', 'jobseeker', 'employer'],
                      example: 'jobseeker',
                    },
                    phone: { type: 'string', example: '+1234567890' },
                    birth_date: { type: 'string', format: 'date', example: '1995-05-20' },
                    city: { type: 'string', example: 'New York' },
                    created_at: { type: 'string', format: 'date-time', example: '2023-04-20T15:30:00Z' },
                    deleted_at: { type: ['string', 'null'], format: 'date-time', nullable: true, example: null },
                  },
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
                  errorCode: { type: 'number', example: 4011 },
                  message: { type: 'string', example: 'Authentication required' },
                  errors: { type: ['array', 'null'], items: { type: 'string' }, nullable: true, example: null },
                },
              },
            },
          },
        },

        403: {
          description: 'Forbidden. You do not have permission to access this resource.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4031 },
                  message: { type: 'string', example: 'Only admins can access this route.' },
                  errors: { type: ['array', 'null'], items: { type: 'string' }, nullable: true, example: null },
                },
              },
            },
          },
        },

        500: {
          description: 'Internal server error. Something went wrong on the server.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 5000 },
                  message: { type: 'string', example: 'Internal server error' },
                  errors: {
                    type: ['array', 'null'],
                    items: { type: 'string' },
                    nullable: true,
                    example: ['Database connection failed', 'Unhandled exception'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user by ID (admin only)',
      description: 'Returns a single user by their ID. Only accessible by admin users.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to retrieve',
          schema: {
            type: 'integer',
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: 'User found successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password_hash: { type: 'string', example: '$2b$10$somehashedpassword...' },
                  full_name: { type: 'string', example: 'Jane Doe' },
                  role: {
                    type: 'string',
                    enum: ['admin', 'jobseeker', 'employer'],
                    example: 'jobseeker',
                  },
                  phone: { type: 'string', example: '+1234567890' },
                  birth_date: { type: 'string', format: 'date', example: '1995-05-20' },
                  city: { type: 'string', example: 'New York' },
                  created_at: { type: 'string', format: 'date-time', example: '2023-04-20T15:30:00Z' },
                  deleted_at: { type: ['string', 'null'], format: 'date-time', nullable: true, example: null },
                },
              },
            },
          },
        },
        422: {
          description: 'Invalid ID or request format',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4220 },
                  message: { type: 'string', example: 'Invalid user ID provided' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
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
                  errorCode: { type: 'number', example: 4011 },
                  message: { type: 'string', example: 'Authentication required' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        403: {
          description: 'Access denied. You are not an admin.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4031 },
                  message: { type: 'string', example: 'Only admin users can perform this action' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4041 },
                  message: { type: 'string', example: 'User with the given ID was not found' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 5001 },
                  message: { type: 'string', example: 'Unexpected error occurred' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/users/update': {
    put: {
      tags: ['Users'],
      summary: 'Update your user profile',
      description: 'Allows a logged-in user to update their own personal information.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['full_name', 'phone', 'birth_date', 'city'],
              properties: {
                full_name: { type: 'string', example: 'Jane Doe' },
                phone: { type: 'string', example: '+1234567890' },
                birth_date: { type: 'string', format: 'date', example: '1990-01-15' },
                city: { type: 'string', example: 'New York' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password_hash: { type: 'string', example: '$2b$10$somehashedpassword...' },
                  full_name: { type: 'string', example: 'Jane Doe' },
                  role: {
                    type: 'string',
                    enum: ['admin', 'jobseeker', 'employer'],
                    example: 'jobseeker',
                  },
                  phone: { type: 'string', example: '+1234567890' },
                  birth_date: { type: 'string', format: 'date', example: '1990-01-15' },
                  city: { type: 'string', example: 'New York' },
                  created_at: { type: 'string', format: 'date-time', example: '2023-04-20T15:30:00Z' },
                  deleted_at: { type: ['string', 'null'], format: 'date-time', nullable: true, example: null },
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
                  errorCode: { type: 'number', example: 4011 },
                  message: { type: 'string', example: 'Authentication required' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4041 },
                  message: { type: 'string', example: 'User not found' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        422: {
          description: 'Validation error on input fields.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4220 },
                  message: { type: 'string', example: 'Validation error' },
                  errors: {
                    type: 'array',
                    nullable: true,
                    example: [
                      { message: '"full_name" is required', path: ['full_name'] },
                      { message: '"birth_date" must be a valid date', path: ['birth_date'] },
                    ],
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 5000 },
                  message: { type: 'string', example: 'Unexpected error occurred' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/delete': {
    put: {
      tags: ['Users'],
      summary: 'Soft delete own account',
      description: 'Allows a logged-in user to soft delete their own account. Sets the deleted_at timestamp instead of permanently removing the user.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User account soft-deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password_hash: { type: 'string', example: '$2b$10$somehashedpassword...' },
                  full_name: { type: 'string', example: 'Jane Doe' },
                  role: {
                    type: 'string',
                    enum: ['admin', 'jobseeker', 'employer'],
                    example: 'jobseeker',
                  },
                  phone: { type: 'string', example: '+1234567890' },
                  birth_date: { type: 'string', format: 'date', example: '1990-01-15' },
                  city: { type: 'string', example: 'New York' },
                  created_at: { type: 'string', format: 'date-time', example: '2023-04-20T15:30:00Z' },
                  deleted_at: { type: 'string', format: 'date-time', example: '2025-06-01T10:00:00Z' },
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
                  errorCode: { type: 'number', example: 4011 },
                  message: { type: 'string', example: 'Authentication required' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found or already deleted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4041 },
                  message: { type: 'string', example: 'User not found' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 5000 },
                  message: { type: 'string', example: 'Unexpected error occurred' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/users/delete/{id}': {
    put: {
      tags: ['Users'],
      summary: 'Soft delete user by ID (admin only)',
      description: 'Allows an admin to soft delete a user by their ID. The user will not be permanently removed; only marked as deleted by setting the deleted_at field.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to be soft deleted',
          schema: {
            type: 'integer',
            example: 2,
          },
        },
      ],
      responses: {
        200: {
          description: 'User soft-deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 2 },
                  email: { type: 'string', format: 'email', example: 'user2@example.com' },
                  password_hash: { type: 'string', example: '$2b$10$somehashedpassword...' },
                  full_name: { type: 'string', example: 'John Smith' },
                  role: {
                    type: 'string',
                    enum: ['admin', 'jobseeker', 'employer'],
                    example: 'employer',
                  },
                  phone: { type: 'string', example: '+1987654321' },
                  birth_date: { type: 'string', format: 'date', example: '1985-07-12' },
                  city: { type: 'string', example: 'Chicago' },
                  created_at: { type: 'string', format: 'date-time', example: '2023-05-10T09:00:00Z' },
                  deleted_at: { type: 'string', format: 'date-time', example: '2025-06-01T12:00:00Z' },
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
                  errorCode: { type: 'number', example: 4011 },
                  message: { type: 'string', example: 'Authentication required' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        403: {
          description: 'Access denied. You are not an admin.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4031 },
                  message: { type: 'string', example: 'Only admin users can perform this action' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4041 },
                  message: { type: 'string', example: 'User with the given ID was not found' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
        422: {
          description: 'Invalid user ID or path parameter',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 4220 },
                  message: { type: 'string', example: 'Validation error' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: '"id" must be a number' },
                        path: { type: 'array', items: { type: 'string' }, example: ['id'] },
                        type: { type: 'string', example: 'number.base' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errorCode: { type: 'number', example: 5000 },
                  message: { type: 'string', example: 'Unexpected error occurred' },
                  errors: { type: ['string', 'null'], nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    },
  },
};
