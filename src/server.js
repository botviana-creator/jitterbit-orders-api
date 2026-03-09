require('dotenv').config();
const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globais ────────────────────────────────────────────────────
app.use(express.json());

// ─── Rotas ─────────────────────────────────────────────────────────────────
app.use('/order', orderRoutes);

// ─── Rota raiz (health check) ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Jitterbit Orders API está no ar! 🚀' });
});

// ─── Middleware de rota não encontrada ──────────────────────────────────────
app.use(notFound);

// ─── Middleware global de erros ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Inicialização ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
