/**
 * Contact Model
 * Mongoose schema for storing contact form submissions
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for efficient queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });

// Pre-save middleware for data sanitization
contactSchema.pre('save', function(next) {
  // Basic XSS prevention - strip HTML tags
  this.name = this.name.replace(/<[^>]*>/g, '');
  this.subject = this.subject.replace(/<[^>]*>/g, '');
  this.message = this.message.replace(/<[^>]*>/g, '');
  next();
});

// Instance method to mark as read
contactSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Static method to get unread count
contactSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ status: 'unread' });
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
