# API Consumption Examples with React and Axios

This document provides comprehensive examples of how to consume APIs in React using Axios, including basic usage, advanced patterns, and best practices.

## Table of Contents

1. [React Hooks Fundamentals](#react-hooks-fundamentals)
2. [Basic Setup](#basic-setup)
3. [Simple API Calls](#simple-api-calls)
4. [Advanced Patterns](#advanced-patterns)
5. [Custom Hooks](#custom-hooks)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Best Practices](#best-practices)

## React Hooks Fundamentals

Before diving into API consumption, let's understand the fundamental React hooks that make it possible.

### useState Hook

`useState` is a React Hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.

#### Basic Syntax

```typescript
const [state, setState] = useState(initialValue);
```

#### Simple Examples

**1. String State**

```typescript
import React, { useState } from 'react';

function NameInput() {
  const [name, setName] = useState(''); // Initial value is empty string

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

**2. Number State**

```typescript
function Counter() {
  const [count, setCount] = useState(0); // Initial value is 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**3. Boolean State**

```typescript
function ToggleButton() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      {isVisible && <p>This content is now visible!</p>}
    </div>
  );
}
```

**4. Object State**

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

function UserForm() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    age: 0,
  });

  // Update specific field while keeping others unchanged
  const updateName = (newName: string) => {
    setUser((prevUser) => ({
      ...prevUser, // Spread operator keeps existing values
      name: newName, // Only update the name field
    }));
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
      />
      <input
        type="number"
        value={user.age}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, age: Number(e.target.value) }))
        }
        placeholder="Age"
      />
      <div>
        <h3>User Info:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
    </div>
  );
}
```

**5. Array State**

```typescript
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos((prevTodos) => [...prevTodos, inputValue]); // Add new item
      setInputValue(''); // Clear input
    }
  };

  const removeTodo = (index: number) => {
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Important useState Rules

1. **Always use functional updates for complex state**:

   ```typescript
   // ❌ Wrong - might lose updates in concurrent renders
   setCount(count + 1);

   // ✅ Correct - uses previous state
   setCount((prevCount) => prevCount + 1);
   ```

2. **For objects and arrays, always create new references**:

   ```typescript
   // ❌ Wrong - mutating state directly
   user.name = 'New Name';
   setUser(user);

   // ✅ Correct - creating new object
   setUser((prevUser) => ({ ...prevUser, name: 'New Name' }));
   ```

### useEffect Hook

`useEffect` is a React Hook that lets you perform side effects in functional components. It's like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

#### Basic Syntax

```typescript
useEffect(() => {
  // Side effect code here

  return () => {
    // Cleanup code here (optional)
  };
}, [dependencies]); // Dependencies array (optional)
```

#### Types of useEffect

**1. Effect that runs on every render**

```typescript
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component rendered or re-rendered');
    document.title = `Count: ${count}`;
  }); // No dependencies array

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**2. Effect that runs only once (on mount)**

```typescript
function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Component mounted - this runs only once');

    // Simulate API call
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []); // Empty dependencies array

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

**3. Effect with dependencies**

```typescript
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('userId changed, fetching new user data');

    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      });
  }, [userId]); // Runs when userId changes

  if (loading) return <div>Loading...</div>;
  return <div>{user ? user.name : 'No user'}</div>;
}
```

**4. Effect with cleanup**

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('Setting up timer');

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      console.log('Cleaning up timer');
      clearInterval(interval);
    };
  }, []); // Empty deps - setup once, cleanup on unmount

  return <div>Timer: {seconds} seconds</div>;
}
```

**5. Complex example with multiple effects**

```typescript
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Effect for connecting to chat room
  useEffect(() => {
    console.log(`Connecting to room: ${roomId}`);
    setConnectionStatus('connecting');

    // Simulate connection
    const connection = {
      connect: () => setConnectionStatus('connected'),
      disconnect: () => setConnectionStatus('disconnected'),
      onMessage: (callback: (message: string) => void) => {
        // Simulate receiving messages
        const interval = setInterval(() => {
          callback(
            `Message from room ${roomId} at ${new Date().toLocaleTimeString()}`
          );
        }, 3000);
        return () => clearInterval(interval);
      },
    };

    connection.connect();
    const unsubscribe = connection.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup
    return () => {
      console.log(`Disconnecting from room: ${roomId}`);
      unsubscribe();
      connection.disconnect();
    };
  }, [roomId]); // Re-run when roomId changes

  // Effect for updating document title
  useEffect(() => {
    document.title = `Chat Room: ${roomId} (${messages.length} messages)`;
  }, [roomId, messages.length]); // Run when roomId or message count changes

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <p>Status: {connectionStatus}</p>
      <div>
        <h3>Messages:</h3>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
```

#### Common useEffect Patterns for API Calls

**1. Basic API call on mount**

```typescript
function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**2. API call with dependencies**

```typescript
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchData, 500); // Debounce

    return () => clearTimeout(timeoutId); // Cleanup
  }, [query]); // Re-run when query changes

  return (
    <div>
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((result: any) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**3. API call with search parameters and filters**

```typescript
function ProductSearch({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (category) params.append('category', category);

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, category]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## ORM Integration Patterns

When working with an ORM (Object-Relational Mapping) like Prisma, TypeORM, or Sequelize on the backend, your frontend API consumption patterns remain largely the same, but you benefit from better type safety and more structured data handling.

### Backend ORM Setup (Prisma Example)

```typescript
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

### ORM-Generated Types

```typescript
// Generated types from Prisma
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
}
```

### Frontend API Consumption with ORM Types

```typescript
// 1. Using ORM-generated types for better type safety
function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // API endpoint that uses ORM queries
        const response = await axios.get<User[]>('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
          <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
        </li>
      ))}
    </ul>
  );
}

// 2. Complex queries with relations
function UserWithPosts({ userId }: { userId: number }) {
  const [user, setUser] = useState<(User & { posts: Post[] }) | null>(null);

  useEffect(() => {
    const fetchUserWithPosts = async () => {
      try {
        // Backend uses ORM to include relations
        const response = await axios.get<User & { posts: Post[] }>(
          `/api/users/${userId}?include=posts`
        );
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user with posts:', error);
      }
    };

    fetchUserWithPosts();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <h3>Posts ({user.posts?.length || 0})</h3>
      <ul>
        {user.posts?.map((post) => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3. Search with ORM-powered filtering
function PostSearch() {
  const [posts, setPosts] = useState<(Post & { author: User })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  useEffect(() => {
    const searchPosts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (authorFilter) params.append('author', authorFilter);

        // Backend uses ORM with full-text search and joins
        const response = await axios.get<(Post & { author: User })[]>(
          `/api/posts/search?${params}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    const timeoutId = setTimeout(searchPosts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, authorFilter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by author..."
        value={authorFilter}
        onChange={(e) => setAuthorFilter(e.target.value)}
      />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>By: {post.author.name}</p>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Custom Hook for ORM-Powered APIs

```typescript
// Hook that leverages ORM capabilities
function useUserData(userId: number, includeRelations = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const params = includeRelations ? '?include=posts,profile' : '';
        const response = await axios.get<User>(`/api/users/${userId}${params}`);
        setUser(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, includeRelations]);

  return { user, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { user, loading, error } = useUserData(userId, true);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* ORM ensures type safety for nested relations */}
      {user.posts && (
        <div>
          <h2>Posts</h2>
          {user.posts.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Pagination with ORM

```typescript
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function usePaginatedPosts(page = 1, limit = 10) {
  const [result, setResult] = useState<PaginatedResult<Post> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Backend ORM handles pagination efficiently
        const response = await axios.get<PaginatedResult<Post>>(
          `/api/posts?page=${page}&limit=${limit}`
        );
        setResult(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  return { result, loading };
}
```

### Benefits of ORM Integration:

1. **Type Safety**: Auto-generated types ensure consistency between frontend and backend
2. **Relation Handling**: Easy to include/exclude related data based on needs
3. **Query Optimization**: ORM handles efficient SQL generation
4. **Validation**: Built-in validation on both sides
5. **Migration Safety**: Schema changes are tracked and type-safe

The key difference with ORM integration is that your backend API endpoints become more predictable and type-safe, making your frontend code more reliable and easier to maintain.

#### useEffect Best Practices

1. **Always include dependencies**: Every value from component scope used inside useEffect should be in the dependencies array.

2. **Use multiple effects**: Separate different concerns into different useEffect calls.

3. **Clean up properly**: Always clean up subscriptions, timers, and event listeners.

4. **Handle race conditions**: Be careful with async operations that might complete after component unmounts.

```typescript
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false; // Flag to handle race conditions

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();

        if (!cancelled) {
          // Only update state if not cancelled
          setUser(userData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true; // Cancel any pending state updates
    };
  }, [userId]);

  return <div>{user ? user.name : 'Loading...'}</div>;
}
```

### Combining useState and useEffect

Here's a practical example that combines both hooks to create a complete feature:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

function ProductManager() {
  // State for products list
  const [products, setProducts] = useState<Product[]>([]);

  // State for form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: '',
  });

  // State for UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when filter changes
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Add new product
  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const savedProduct = await response.json();
      setProducts((prev) => [...prev, savedProduct]);
      setNewProduct({ name: '', price: 0, category: '' }); // Reset form
    } catch (err) {
      setError('Failed to add product');
    }
  };

  return (
    <div>
      <h1>Product Manager</h1>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter products..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Add Product Form */}
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct((prev) => ({
              ...prev,
              price: Number(e.target.value),
            }))
          }
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct((prev) => ({ ...prev, category: e.target.value }))
          }
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Products List */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} ({product.category})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

This example demonstrates:

- **useState** for managing multiple pieces of state (products, form data, UI state)
- **useEffect** for fetching data when component mounts
- **Derived state** (filteredProducts) calculated from existing state
- **State updates** that maintain immutability
- **Form handling** with controlled components

## Basic Setup

### 1. Install Axios

```bash
npm install axios
# or
pnpm add axios
```

### 2. Basic Axios Configuration

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

## Simple API Calls

### 1. Basic GET Request

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

### 2. POST Request (Create Data)

```typescript
import { useState } from 'react';
import axios from 'axios';

interface CreateUserData {
  name: string;
  email: string;
}

function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/users', formData);
      setSuccess(true);
      setFormData({ name: '', email: '' }); // Reset form
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {success && <p>User created successfully!</p>}
    </form>
  );
}
```

### 3. PUT Request (Update Data)

```typescript
const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    const response = await axios.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
```

### 4. DELETE Request

```typescript
const deleteUser = async (id: number) => {
  try {
    await axios.delete(`/api/users/${id}`);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
```

## Advanced Patterns

### 1. Axios Interceptors

```typescript
// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Cancellable Requests

```typescript
import { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';

function CancellableRequest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelTokenSource: CancelTokenSource;

    const fetchData = async () => {
      setLoading(true);
      cancelTokenSource = axios.CancelToken.source();

      try {
        const response = await axios.get('/api/data', {
          cancelToken: cancelTokenSource.token,
        });
        setData(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Request failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel request
    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Component unmounted');
      }
    };
  }, []);

  return <div>{loading ? 'Loading...' : JSON.stringify(data)}</div>;
}
```

### 3. Parallel Requests

```typescript
const fetchMultipleData = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/posts'),
      axios.get('/api/comments'),
    ]);

    return {
      users: users.data,
      posts: posts.data,
      comments: comments.data,
    };
  } catch (error) {
    console.error('One or more requests failed:', error);
    throw error;
  }
};
```

## Custom Hooks

### 1. Generic Data Fetching Hook

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = () => {
    setError(null);
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useApi<User>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={refetch}>Retry</button>
      </div>
    );
  if (!user) return <div>No user found</div>;

  return (
    <div>
      {user.name} - {user.email}
    </div>
  );
}
```

### 2. CRUD Operations Hook

```typescript
function useCRUD<T>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get<T[]>(endpoint);
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const create = async (item: Omit<T, 'id'>) => {
    try {
      const response = await axios.post<T>(endpoint, item);
      setItems((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
      throw err;
    }
  };

  const update = async (id: number, item: Partial<T>) => {
    try {
      const response = await axios.put<T>(`${endpoint}/${id}`, item);
      setItems((prev) => prev.map((i) => (i.id === id ? response.data : i)));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      await axios.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}
```

## Error Handling

### 1. Global Error Handler

```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data?.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};
```

### 2. Error Boundary for API Errors

```typescript
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('API Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with the API call.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimization

### 1. Debounced Search

```typescript
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(`/api/search?q=${searchQuery}`);
          setResults(response.data);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map((result: any) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. React Query Integration

```typescript
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Fetch data with caching
function useUsers() {
  return useQuery(
    'users',
    () => axios.get('/api/users').then((res) => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

// Mutation with cache invalidation
function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation(
    (userData: CreateUserData) => axios.post('/api/users', userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );
}
```

## Best Practices

### 1. Environment Variables

```typescript
// .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

// api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
```

### 2. TypeScript Interfaces

```typescript
// Always define interfaces for API responses
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### 3. Loading States

```typescript
// Use proper loading states for better UX
const [isLoading, setIsLoading] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// Different states for different operations
const [loadingStates, setLoadingStates] = useState({
  fetching: false,
  creating: false,
  updating: false,
  deleting: false,
});
```

### 4. Error Types

```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string';
};
```

## Real-World Example: Complete Component

Check out the `ServiciosAdvanced.tsx` component and `useServicios` hook in this project for a complete implementation that includes:

- Custom hooks for API operations
- Error handling and retry logic
- Loading states and optimistic updates
- Search with debouncing
- Filtering and sorting
- TypeScript integration
- Responsive design

## Conclusion

This guide covers the essential patterns for API consumption in React with Axios. The key principles are:

1. **Separation of Concerns**: Keep API logic separate from UI components
2. **Error Handling**: Always handle errors gracefully
3. **Loading States**: Provide feedback to users during async operations
4. **TypeScript**: Use proper typing for better developer experience
5. **Performance**: Optimize with debouncing, caching, and request cancellation
6. **Reusability**: Create custom hooks for common patterns

Remember to adapt these patterns to your specific use case and backend API structure.
