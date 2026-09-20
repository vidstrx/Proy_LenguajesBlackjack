const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  clientId: { type: String, required: true, trim: true, unique: true },
  mode: { type: String, enum: ['humano', 'simulacion'], default: 'humano' },
  strategy: { type: String, enum: ['fija', 'probabilistica'], required: true },
  result: { type: String, enum: ['victoria', 'derrota', 'empate'], required: true },
  playerScore: { type: Number, required: true, min: 0 },
  dealerScore: { type: Number, required: true, min: 0 },
  bet: { type: Number, default: 0, min: 0 },
  wallet: { type: Number, default: 0, min: 0 },
  aiDecisions: [{ type: String, trim: true }],
  playedAt: { type: Date, default: Date.now },
}, { versionKey: false, timestamps: true });

gameSchema.index({ playedAt: -1 });
gameSchema.index({ strategy: 1, result: 1 });

module.exports = mongoose.model('Game', gameSchema);

