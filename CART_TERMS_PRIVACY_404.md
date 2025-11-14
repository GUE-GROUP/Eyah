# 🛒 Cart System + Terms, Privacy & 404 Pages - Complete Guide

## Overview

This document explains how the cart system works for users and documents the newly created Terms, Privacy, and 404 pages.

---

## 🛒 How the Cart System Works

### **User Flow:**

```
1. User browses rooms (/rooms)
   ↓
2. User clicks on a room to view details (/room/:id)
   ↓
3. User selects check-in and check-out dates
   ↓
4. User clicks "Book Now"
   ↓
5. Redirected to booking page with room pre-selected
   ↓
6. User fills in booking form
   ↓
7. User submits booking
   ↓
8. Booking created in database
   ↓
9. Confirmation email sent with verification code
```

### **Cart Features:**

#### **1. Add to Cart (Context-Based)**
- Uses React Context API (`CartContext`)
- Stores cart items in `localStorage`
- Persists across page refreshes

#### **2. Cart Item Structure:**
```typescript
interface CartItem {
  room: Room;          // Full room details
  checkIn: string;     // Check-in date
  checkOut: string;    // Check-out date
  guests: number;      // Number of guests
}
```

#### **3. Cart Operations:**

**Add to Cart:**
```typescript
addToCart(room, checkIn, checkOut, guests)
```
- If room already in cart → Update dates and guests
- If new room → Add to cart

**Remove from Cart:**
```typescript
removeFromCart(roomId)
```
- Removes specific room from cart

**Clear Cart:**
```typescript
clearCart()
```
- Empties entire cart

**Get Total:**
```typescript
getCartTotal()
```
- Calculates total price based on:
  - Room price per night
  - Number of nights (check-out - check-in)
  - Returns total in Naira (₦)

---

### **Cart Page Features:**

#### **Empty Cart State:**
```
┌─────────────────────────────────────┐
│         🛍️                         │
│   Your Cart is Empty                │
│                                     │
│   Start adding rooms to your cart   │
│   to plan your perfect stay.        │
│                                     │
│   [Browse Rooms →]                  │
└─────────────────────────────────────┘
```

#### **Cart with Items:**
```
┌─────────────────────────────────────┐
│  Your Cart                          │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ [Room Image]  Deluxe Suite    │ │
│  │               ₦150,000/night  │ │
│  │                               │ │
│  │ Check-in: Nov 20, 2025        │ │
│  │ Check-out: Nov 23, 2025       │ │
│  │ Guests: 2 | Nights: 3         │ │
│  │                               │ │
│  │ Total: ₦450,000    [🗑️ Delete]│ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Booking Summary               │ │
│  │                               │ │
│  │ Deluxe Suite × 3 nights       │ │
│  │                    ₦450,000   │ │
│  │                               │ │
│  │ Total          ₦450,000       │ │
│  │                               │ │
│  │ [Proceed to Checkout]         │ │
│  │ [Continue Shopping]           │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### **Cart in Header:**

```
┌─────────────────────────────────────┐
│  EYAH'S HOTEL & SUITES              │
│  [Home] [Gallery] [About] [Rooms]   │
│  [Contact]          🛒(2) [Book]    │
└─────────────────────────────────────┘
```

- Shopping cart icon in header
- Badge shows number of items
- Click to view cart page

---

### **Booking Process:**

1. **From Cart:**
   - Click "Proceed to Checkout"
   - Redirected to `/book`

2. **Direct Booking:**
   - Click "Book Now" on room details
   - Redirected to `/book?room=id&checkIn=date&checkOut=date`

3. **Booking Form (3 Steps):**

**Step 1: Guest Information**
- First Name
- Last Name
- Email
- Phone

**Step 2: Booking Details**
- Room Selection (dropdown)
- Check-in Date
- Check-out Date
- Number of Adults
- Number of Children
- Number of Rooms

**Step 3: Review & Confirm**
- Review all details
- Total price calculation
- Special requests (optional)
- Submit booking

4. **After Submission:**
   - Booking saved to database
   - Verification code generated
   - Confirmation email sent
   - Redirect to home page
   - Success notification

---

## 📄 Terms & Conditions Page

### **URL:** `/terms`

### **Sections:**

1. **Booking and Reservations**
   - Booking confirmation process
   - Payment requirements
   - Pricing policy
   - Verification code usage

2. **Check-In and Check-Out**
   - Check-in time: 2:00 PM
   - Check-out time: 12:00 PM
   - ID requirements
   - Age restrictions

3. **Cancellation and Refund Policy**
   - 48+ hours: Full refund (minus 10% fee)
   - <48 hours: 50% forfeit
   - No-show: 100% forfeit
   - Refund processing: 7-14 days

4. **Guest Responsibilities**
   - Property care
   - Conduct expectations
   - Smoking policy
   - Pet policy
   - Quiet hours: 10 PM - 7 AM

5. **Liability and Insurance**
   - Personal property disclaimer
   - Limitation of liability
   - Force majeure clause

6. **Privacy and Data Protection**
   - Links to Privacy Policy
   - Data security measures
   - Marketing opt-out

7. **Modifications to Terms**
   - Right to modify
   - Effective immediately

8. **Contact Information**
   - Hotel address
   - Phone numbers
   - Email addresses

---

## 🔒 Privacy Policy Page

### **URL:** `/privacy`

### **Sections:**

1. **Information We Collect**
   - Personal information (name, email, phone)
   - Booking information (dates, preferences)
   - Automatically collected (IP, browser, device)

2. **How We Use Your Information**
   - Process bookings
   - Communication
   - Customer service
   - Payment processing
   - Service improvement
   - Marketing (with consent)
   - Legal compliance

3. **Information Sharing and Disclosure**
   - Service providers
   - Legal requirements
   - Business transfers
   - No selling of data

4. **Data Security**
   - SSL/TLS encryption
   - Secure storage
   - Access controls
   - Employee training

5. **Cookies and Tracking**
   - Session management
   - Shopping cart
   - Analytics
   - Browser control

6. **Your Rights and Choices**
   - Access data
   - Correct information
   - Delete data
   - Opt-out of marketing
   - Data portability
   - Object to processing

7. **Data Retention**
   - Retention periods
   - Legal requirements
   - 7-year record keeping

8. **Children's Privacy**
   - Not directed to under 18
   - No knowing collection from children

9. **Changes to Privacy Policy**
   - Notification process
   - Acceptance by continued use

10. **Contact Information**
    - Data Protection Officer
    - Contact details

---

## 🚫 404 Not Found Page

### **URL:** Any invalid URL (e.g., `/invalid-page`)

### **Features:**

```
┌─────────────────────────────────────┐
│                                     │
│            404                      │
│                                     │
│            📍                       │
│                                     │
│    Oops! Page Not Found             │
│                                     │
│    The page you're looking for      │
│    seems to have checked out.       │
│    Let's get you back to            │
│    somewhere comfortable.           │
│                                     │
│    [🏠 Go to Homepage]              │
│    [🔍 Browse Rooms]                │
│                                     │
│    Looking for something specific?  │
│    [About] [Contact] [Gallery]      │
│    [Book a Room]                    │
│                                     │
│    [← Go Back]                      │
└─────────────────────────────────────┘
```

### **Actions:**
- **Go to Homepage** - Returns to `/`
- **Browse Rooms** - Goes to `/rooms`
- **Quick Links** - About, Contact, Gallery, Book
- **Go Back** - Browser back button

---

## 🔗 Navigation Links

### **Footer Links:**

```
┌─────────────────────────────────────┐
│  EYAH'S HOTEL & SUITES              │
│                                     │
│  Quick Links    Services            │
│  • Home         • Accommodation     │
│  • About        • Restaurant        │
│  • Rooms        • Event Hall        │
│  • Gallery      • Gym               │
│  • Contact      • Conference        │
│                                     │
│  ─────────────────────────────────  │
│  © 2025 Eyah's Hotel & Suites       │
│  [Privacy Policy] [Terms & Cond.]   │
└─────────────────────────────────────┘
```

### **Link Locations:**

1. **Footer (Bottom of every page)**
   - Privacy Policy → `/privacy`
   - Terms & Conditions → `/terms`

2. **Terms Page**
   - Links to Privacy Policy

3. **Privacy Policy Page**
   - Links to Terms & Conditions

4. **404 Page**
   - Links to all major pages

---

## 📁 Files Created

### **New Pages:**

1. ✅ `Frontend/src/pages/Terms.tsx`
   - Complete terms and conditions
   - 8 major sections
   - Professional layout
   - Back to home link

2. ✅ `Frontend/src/pages/Privacy.tsx`
   - Comprehensive privacy policy
   - 10 detailed sections
   - GDPR-compliant
   - Contact information

3. ✅ `Frontend/src/pages/NotFound.tsx`
   - 404 error page
   - Helpful navigation
   - Quick links
   - Go back button

### **Modified Files:**

1. ✅ `Frontend/src/App.tsx`
   - Added `/terms` route
   - Added `/privacy` route
   - Added `*` catch-all route for 404

2. ✅ `Frontend/src/components/layout/Footer.tsx`
   - Updated Privacy Policy link
   - Updated Terms & Conditions link
   - Changed from `<a>` to `<Link>`

---

## 🎨 Design Features

### **Consistent Styling:**
- Hero sections with gradient overlays
- Icon-based headers
- Fade-in animations
- Responsive design
- Professional typography
- Cream background
- Accent color highlights

### **Accessibility:**
- Clear headings hierarchy
- Readable font sizes
- Sufficient color contrast
- Keyboard navigation
- Screen reader friendly

### **Mobile Responsive:**
- Stacks on small screens
- Touch-friendly buttons
- Readable text sizes
- Proper spacing

---

## 🧪 Testing

### **Test Cart System:**

1. **Add to Cart:**
   ```
   1. Go to /rooms
   2. Click on any room
   3. Select dates
   4. Click "Book Now"
   5. Verify redirect to /book with pre-filled data
   ```

2. **View Cart:**
   ```
   1. Click cart icon in header
   2. Verify items displayed
   3. Check total calculation
   4. Test remove button
   ```

3. **Proceed to Checkout:**
   ```
   1. Click "Proceed to Checkout"
   2. Verify redirect to /book
   3. Fill in form
   4. Submit booking
   5. Check confirmation email
   ```

---

### **Test Terms Page:**

```
1. Go to /terms
2. Verify all sections load
3. Test "Back to Home" link
4. Test Privacy Policy link
5. Scroll through content
6. Check mobile responsiveness
```

---

### **Test Privacy Page:**

```
1. Go to /privacy
2. Verify all sections load
3. Test "Back to Home" link
4. Test Terms & Conditions link
5. Check contact information
6. Verify mobile layout
```

---

### **Test 404 Page:**

```
1. Go to /invalid-url
2. Verify 404 page displays
3. Test "Go to Homepage" button
4. Test "Browse Rooms" button
5. Test quick links
6. Test "Go Back" button
7. Try various invalid URLs
```

---

### **Test Footer Links:**

```
1. Scroll to footer on any page
2. Click "Privacy Policy"
3. Verify redirect to /privacy
4. Go back
5. Click "Terms & Conditions"
6. Verify redirect to /terms
```

---

## 📊 Cart System Summary

### **How It Works:**

1. **Context Provider** wraps entire app
2. **localStorage** persists cart data
3. **Header** shows cart count
4. **Cart Page** displays items
5. **Book Page** processes checkout
6. **Database** stores final booking

### **Key Functions:**

```typescript
// Add room to cart
addToCart(room, checkIn, checkOut, guests)

// Remove room from cart
removeFromCart(roomId)

// Clear entire cart
clearCart()

// Calculate total price
getCartTotal() // Returns number
```

### **Data Flow:**

```
User Action → Context Update → localStorage Save
                ↓
         UI Re-render → Display Updated Cart
```

---

## 🎯 Summary

### ✅ **What's Complete:**

1. **Cart System**
   - Context-based state management
   - localStorage persistence
   - Add/remove/clear operations
   - Total price calculation
   - Header cart icon with badge
   - Empty and filled states

2. **Terms & Conditions Page**
   - 8 comprehensive sections
   - Booking policies
   - Cancellation rules
   - Guest responsibilities
   - Contact information

3. **Privacy Policy Page**
   - 10 detailed sections
   - Data collection disclosure
   - Usage explanation
   - Security measures
   - User rights
   - GDPR compliance

4. **404 Not Found Page**
   - Friendly error message
   - Navigation options
   - Quick links
   - Go back functionality

5. **Footer Integration**
   - Links to Terms
   - Links to Privacy
   - Consistent across all pages

---

**Your hotel website now has a complete cart system, legal pages, and proper error handling!** 🛒📄✨
