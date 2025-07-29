import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  codeBlocks: [{
    language: String,
    code: String,
  }],
});

const componentSchema = new mongoose.Schema({
  id: String,
  name: String,
  jsx: String,
  css: String,
  props: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Session',
  },
  description: String,
  messages: [messageSchema],
  components: [componentSchema],
  currentComponent: componentSchema,
  preview: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

sessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for better query performance
sessionSchema.index({ userId: 1, updatedAt: -1 });
sessionSchema.index({ userId: 1, isActive: 1 });

export const Session = mongoose.model('Session', sessionSchema);
export default Session;