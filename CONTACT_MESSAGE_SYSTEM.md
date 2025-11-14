# 📧 Contact Message System - Complete Guide

## Overview

I've built a complete contact message system that connects the public contact form to the admin dashboard with full reply functionality. Admins can now view messages, mark them as read, and send replies directly to customers via email.

---

## ✅ What's Built

### **1. Contact Form (Public)**
- ✅ Beautiful contact form on `/contact` page
- ✅ Saves messages to `contact_messages` table
- ✅ Validates all required fields
- ✅ Shows success/error notifications
- ✅ Resets form after submission

### **2. Admin Messages Dashboard**
- ✅ Fetches real messages from database
- ✅ Filter by status (All, Unread, Read, Responded)
- ✅ Status badges (color-coded)
- ✅ Click to view full message details
- ✅ Auto-marks as read when opened
- ✅ Loading states and error handling

### **3. Reply Functionality**
- ✅ Reply modal with message details
- ✅ Text area for composing reply
- ✅ Sends reply via Resend email
- ✅ Updates message status to "responded"
- ✅ Beautiful email template with original message
- ✅ Success/error notifications

### **4. Email Templates**
- ✅ Professional reply email design
- ✅ Includes original message for context
- ✅ Hotel branding and contact info
- ✅ Mobile responsive

---

## How It Works

### **Flow Diagram**

```
Customer submits contact form
    ↓
Message saved to database (status: unread)
    ↓
Admin dashboard shows unread count
    ↓
Admin opens Messages page
    ↓
Sees list of messages with filters
    ↓
Clicks to view message details
    ↓
Message marked as "read"
    ↓
Admin types reply
    ↓
Clicks "Send Reply"
    ↓
Email sent to customer via Resend
    ↓
Message status updated to "responded"
    ↓
Customer receives reply in their inbox
```

---

## Database Schema

### **contact_messages Table**

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster filtering
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
```

---

## Features in Detail

### **1. Contact Form**

**Location:** `/contact`

**Fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Subject (required)
- Message (required)

**Functionality:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    await submitContactMessage(formData);
    toast.success('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  } catch (error: any) {
    toast.error('Failed to send message. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```

---

### **2. Admin Messages Page**

**Location:** `/admin/messages`

**Features:**

#### **Filter Tabs**
```
[All Messages] [Unread] [Read] [Responded]
```

- **All Messages** - Shows all messages
- **Unread** - Only unread messages (blue badge)
- **Read** - Messages that have been viewed (gray badge)
- **Responded** - Messages with replies sent (green badge)

#### **Message List**
- Name and status badge
- Subject line
- Email and phone
- Message preview (2 lines)
- Timestamp
- Eye icon to view details

#### **Status Colors**
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread': return 'bg-blue-100 text-blue-800';
    case 'read': return 'bg-gray-100 text-gray-800';
    case 'responded': return 'bg-green-100 text-green-800';
  }
};
```

---

### **3. Message Details Modal**

**Opens when:** Admin clicks eye icon

**Shows:**
- Subject with status badge
- From (name)
- Email
- Phone
- Date received
- Full message (with line breaks preserved)

**Reply Section:**
- Large text area for reply
- Shows recipient email
- Send Reply button (with loading state)
- Close button

**Auto-mark as Read:**
```typescript
const markAsRead = async (messageId: string) => {
  try {
    await updateMessageStatus(messageId, 'read');
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' as const } : msg
      )
    );
  } catch (error: any) {
    console.error('❌ Error marking as read:', error);
  }
};
```

---

### **4. Reply Email System**

**Send Reply Function:**
```typescript
const handleSendReply = async () => {
  if (!selectedMessage || !replyText.trim()) {
    toast.error('Please enter a reply message');
    return;
  }

  setSendingReply(true);

  try {
    // Send reply email via Resend
    const { data, error } = await supabase.functions.invoke('send-email-resend', {
      body: {
        type: 'contact_form_reply',
        to: selectedMessage.email,
        data: {
          recipientName: selectedMessage.name,
          originalSubject: selectedMessage.subject,
          originalMessage: selectedMessage.message,
          replyMessage: replyText
        }
      }
    });

    if (error) throw error;

    // Update message status to 'responded'
    await updateMessageStatus(selectedMessage.id, 'responded');
    
    // Update local state
    setMessages(prev =>
      prev.map(msg =>
        msg.id === selectedMessage.id ? { ...msg, status: 'responded' as const } : msg
      )
    );

    toast.success('Reply sent successfully!');
    setReplyText('');
    setSelectedMessage(null);
  } catch (error: any) {
    console.error('❌ Failed to send reply:', error);
    toast.error('Failed to send reply. Please try again.');
  } finally {
    setSendingReply(false);
  }
};
```

---

## Email Template

### **Reply Email Design**

```
┌─────────────────────────────────────────┐
│   🏨 Eyah's Hotel & Suites             │
│   Thank you for contacting us          │
└─────────────────────────────────────────┘

Dear John Doe,

Thank you for reaching out to Eyah's Hotel & Suites.
We appreciate your inquiry and are happy to assist you.

┌─────────────────────────────────────────┐
│ Our Response:                           │
│                                         │
│ Thank you for your inquiry about our   │
│ banquet hall. We would be delighted to │
│ host your wedding reception...         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Your Original Message:                  │
│ Subject: Banquet Hall Inquiry           │
│                                         │
│ I would like to inquire about booking  │
│ the banquet hall for a wedding...      │
└─────────────────────────────────────────┘

If you have any additional questions, please
don't hesitate to contact us.

📞 +234 912 855 5191, +234 816 333 2977
📧 info@eyahshotel.com
📍 10 Keffi Road, Makurdi, Benue State

Warm regards,
The Eyah's Hotel & Suites Team
```

---

## API Functions

### **Frontend (supabase.ts)**

#### **Submit Contact Message**
```typescript
export async function submitContactMessage(messageData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

#### **Get Contact Messages**
```typescript
export async function getContactMessages(status?: string) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

#### **Update Message Status**
```typescript
export async function updateMessageStatus(
  messageId: string,
  status: 'unread' | 'read' | 'responded'
) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### **Backend (Edge Function)**

#### **Email Type: contact_form_reply**

**Request:**
```json
{
  "type": "contact_form_reply",
  "to": "customer@example.com",
  "data": {
    "recipientName": "John Doe",
    "originalSubject": "Banquet Hall Inquiry",
    "originalMessage": "I would like to inquire...",
    "replyMessage": "Thank you for your inquiry..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "emailId": "abc123..."
}
```

---

## Testing

### **Test 1: Submit Contact Form**

1. **Go to contact page:**
   ```
   http://localhost:5173/contact
   ```

2. **Fill in form:**
   - Name: John Doe
   - Email: your-email@example.com
   - Phone: +234 912 855 5191
   - Subject: Test Message
   - Message: This is a test message

3. **Click "Send Message"**

4. **Should see:** Success toast notification

5. **Check database:**
   ```sql
   SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;
   ```

---

### **Test 2: View Messages in Admin**

1. **Login as admin:**
   ```
   http://localhost:5173/admin/login
   ```

2. **Go to Messages:**
   ```
   http://localhost:5173/admin/messages
   ```

3. **Should see:** Your test message with "UNREAD" badge

4. **Click eye icon** to view details

5. **Should see:** Message marked as "READ"

---

### **Test 3: Send Reply**

1. **Open message** (from Test 2)

2. **Type reply** in text area:
   ```
   Thank you for your message! We will get back to you soon.
   ```

3. **Click "Send Reply"**

4. **Should see:** 
   - Success toast
   - Modal closes
   - Message status changes to "RESPONDED"

5. **Check email inbox** (the email you used in contact form)

6. **Should receive:** Professional reply email with your message included

---

### **Test 4: Filter Messages**

1. **Go to Messages page**

2. **Click "Unread" tab**
   - Should show only unread messages

3. **Click "Read" tab**
   - Should show only read messages

4. **Click "Responded" tab**
   - Should show only responded messages

5. **Click "All Messages" tab**
   - Should show all messages

---

## Dashboard Integration

### **Unread Messages Count**

The admin dashboard shows unread message count:

```typescript
// In AdminDashboard.tsx
const { count: unreadMessages } = await supabase
  .from('contact_messages')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'unread');

setStats({
  ...stats,
  unreadMessages: unreadMessages || 0
});
```

**Displays as:**
```
┌─────────────────────────┐
│ 📨 Unread Messages      │
│                         │
│        8                │
│                         │
│ Customer inquiries      │
└─────────────────────────┘
```

---

## Files Created/Modified

### **Modified Files:**

1. ✅ **Frontend/src/pages/admin/AdminMessages.tsx**
   - Removed mock data
   - Added real database fetching
   - Added filter tabs
   - Added reply functionality
   - Added loading states
   - Added error handling

2. ✅ **Backend/supabase/functions/send-email-resend/index.ts**
   - Added `contact_form_reply` email type
   - Added `generateContactFormReplyEmail()` function
   - Added beautiful reply email template

3. ✅ **Frontend/src/lib/supabase.ts**
   - Already had `submitContactMessage()`
   - Already had `getContactMessages()`
   - Already had `updateMessageStatus()`

---

## Deployment

### **Step 1: Update Edge Function**

1. **Go to Supabase Functions:**
   ```
   https://app.supabase.com/project/YOUR_PROJECT/functions
   ```

2. **Find `send-email-resend` function**

3. **Click "Edit"**

4. **Replace code** with updated version from:
   ```
   Backend/supabase/functions/send-email-resend/index.ts
   ```

5. **Click "Deploy function"**

---

### **Step 2: Test Reply Functionality**

1. **Submit a test message** from contact form

2. **Login to admin** and go to Messages

3. **Open the message** and send a reply

4. **Check your email** for the reply

---

## Troubleshooting

### **Issue: Messages Not Showing**

**Check:**
1. Database has messages:
   ```sql
   SELECT COUNT(*) FROM contact_messages;
   ```

2. RLS policies allow admin to read:
   ```sql
   SELECT * FROM contact_messages LIMIT 1;
   ```

3. Console for errors in AdminMessages component

---

### **Issue: Reply Not Sending**

**Check:**
1. **Resend API key** is set in Supabase
2. **Edge function** is deployed
3. **Console logs** for error messages
4. **Resend dashboard** for delivery status

---

### **Issue: Status Not Updating**

**Check:**
1. **RLS policies** allow updates:
   ```sql
   UPDATE contact_messages 
   SET status = 'read' 
   WHERE id = 'message-id';
   ```

2. **Console logs** for update errors

3. **Refresh page** to see if it persists

---

## Best Practices

### **For Admins:**

1. ✅ **Check messages daily** - Don't leave customers waiting
2. ✅ **Mark as read** - Keep track of what you've reviewed
3. ✅ **Reply promptly** - Respond within 24 hours
4. ✅ **Be professional** - Use proper grammar and tone
5. ✅ **Include details** - Answer all questions thoroughly
6. ✅ **Use filters** - Stay organized with status filters

### **For Developers:**

1. ✅ **Monitor errors** - Check console logs regularly
2. ✅ **Test emails** - Verify delivery before going live
3. ✅ **Backup messages** - Export important conversations
4. ✅ **Update templates** - Keep email designs fresh
5. ✅ **Track metrics** - Monitor response times

---

## Future Enhancements

### **Potential Features:**

1. **Email Templates** - Pre-written responses for common questions
2. **Attachments** - Allow admins to attach files in replies
3. **Rich Text Editor** - Format replies with bold, links, etc.
4. **Auto-Responses** - Automatic acknowledgment emails
5. **Message Threading** - Group conversations together
6. **Search** - Find messages by keyword
7. **Export** - Download messages as CSV/PDF
8. **Notifications** - Desktop/mobile alerts for new messages
9. **Assignment** - Assign messages to specific staff
10. **Tags** - Categorize messages (inquiry, complaint, feedback)

---

## Summary

### ✅ What's Complete

1. **Contact Form** - Public form saves to database
2. **Admin Dashboard** - Shows unread message count
3. **Messages Page** - View all messages with filters
4. **Status Management** - Unread → Read → Responded
5. **Reply System** - Send emails directly to customers
6. **Email Templates** - Professional branded emails
7. **Real-time Updates** - Status changes reflect immediately
8. **Error Handling** - Graceful failures with notifications

### 🎯 Result

**Your hotel now has a complete contact message system that:**
- Captures customer inquiries via contact form
- Displays messages in admin dashboard
- Allows filtering by status
- Enables direct email replies to customers
- Tracks message status (unread/read/responded)
- Sends beautiful branded reply emails
- Updates dashboard statistics in real-time

---

**The contact message system is fully functional and ready to use!** 📧✨

**Deploy the updated Edge Function and start responding to customer inquiries!**
