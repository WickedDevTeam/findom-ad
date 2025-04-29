
# Findom Directory Project Documentation

Welcome to the Findom Directory project documentation. This documentation provides a comprehensive overview of the project's architecture, technology stack, setup instructions, and key components.

## Table of Contents

- [Overview](#overview) - Project overview and purpose
- [Getting Started](#getting-started) - Setup and installation instructions
- [Tech Stack](#tech-stack) - Technologies used in the project
- [Architecture](#architecture) - Project structure and architecture
- [Key Features](#key-features) - Main features and functionality
- [Authentication](#authentication) - User authentication and authorization
- [Data Model](#data-model) - Database schema and relationships
- [Routes](#routes) - Application routes and navigation
- [Components](#components) - Key UI components and their usage
- [State Management](#state-management) - How application state is managed
- [API Integration](#api-integration) - External APIs and data fetching
- [Error Handling](#error-handling) - Error handling strategies
- [Security](#security) - Security measures and best practices
- [Deployment](#deployment) - Deployment process and configuration
- [Performance](#performance) - Performance optimization strategies
- [Troubleshooting](#troubleshooting) - Common issues and solutions

## Overview

Findom Directory is a web application for discovering and connecting with financial domination content creators. The platform allows users to browse listings, create accounts, manage profiles, and submit their own listings.

## Getting Started

To get started with the project:

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment:**
   - Connect to Supabase using the project configuration
   - Ensure storage buckets are properly configured
   
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
5. **Visit the application:**
   The application will be available at `http://localhost:8080`

## Key Features

- User authentication (sign up, sign in, sign out)
- Creator listings and profiles
- Category-based browsing
- User profile management
- Submission system for new listings
- Admin dashboard for content moderation
- Favorites system for authenticated users
- Responsive design for all device sizes

## Error Handling

The application implements robust error handling:

- Form validation with user feedback
- API error handling with clear error messages
- Authentication error management
- Graceful fallbacks for failed data loading
- Structured toast notifications for user feedback

## Troubleshooting

Common issues and solutions:

### Authentication Issues

- **Unable to sign in:** Verify email/password combination and check for account existence
- **Session persistence problems:** Clear browser cache or check Supabase configuration
- **Authorization errors:** Verify user permissions and role assignments

### Data Loading Issues

- **Content not displaying:** Check network tab for API errors and verify RLS policies
- **Profile data missing:** Ensure profile creation trigger is working correctly
- **Images not loading:** Verify storage bucket configuration and permissions

### Performance Issues

- **Slow initial load:** Check component lazy loading and bundle splitting
- **Unresponsive UI:** Look for unnecessary re-renders or heavy computations
- **API latency:** Optimize database queries and implement caching strategies

For detailed documentation on specific aspects of the application, refer to the dedicated documentation files in this directory.
