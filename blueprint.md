# Project Blueprint

## Overview

This document outlines the plan and progress of the Next.js application. It will be updated with each change request to reflect the current state of the project.

## Completed Tasks

### Fix 404 Error in Profile Details
- Updated `src/app/admin/perfiles/[id]/page.tsx` to handle `params` as a Promise (Next.js 15+).

### Fix 404 Error in Provider Activity Details
- Updated `src/app/admin/proveedores/actividad/[id]/page.tsx` to handle `params` as a Promise (Next.js 15+).

### Fix Missing Prisma Import in Product Actions
- Added `import prisma from "@/lib/prisma"` to `src/app/admin/productos/actions.ts`.

### Fix Server Action Build Error
- Added `"use server"` to `src/app/admin/productos/actions.ts`.

### Fix Product Buttons
- Updated dynamic route params handling in product pages.

### Custom Deletion Modal
- Replaced `confirm()` with a custom modal in `ProductosClient`.

## Current Task: Fix Decimal Serialization Error

### Problem
Prisma returns `Decimal` objects for monetary fields. These objects cannot be passed directly from Server Components to Client Components in Next.js.

### Action Plan
1. [ ] Update `src/app/admin/productos/[id]/editar/page.tsx` to serialize the `producto` object, converting all `Decimal` fields to `number`.
2. [ ] (Optional) Ensure `Date` objects are handled if necessary, although usually supported.
3. [ ] Verify that the form loads correctly without the "Decimal objects are not supported" error.
