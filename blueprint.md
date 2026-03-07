# Project Blueprint

## Overview

This document outlines the plan and progress of the Next.js application. It will be updated with each change request to reflect the current state of the project.

## Implemented Features

### Core Dependencies

* **Database:**
    * `@neondatabase/serverless`: Neon database serverless driver.
    * `drizzle-orm`: TypeScript ORM for SQL databases.
    * `drizzle-kit`: CLI tool for Drizzle ORM.
* **Authentication:**
    * `next-auth@beta`: Authentication for Next.js.
    * `bcryptjs`: Library for hashing passwords.
    * `@types/bcryptjs`: Type definitions for bcryptjs.
* **State Management & Forms:**
    * `@upstash/redis`: Serverless Redis client.
    * `zod`: TypeScript-first schema validation.
    * `react-hook-form`: Performant, flexible and extensible forms with easy-to-use validation.
    * `@hookform/resolvers`: Resolvers for react-hook-form.
* **UI & Styling:**
    * `lucide-react`: Beautiful and consistent icons.
    * `clsx`: A tiny utility for constructing `className` strings conditionally.
    * `tailwind-merge`: Utility function to merge Tailwind CSS classes without style conflicts.
