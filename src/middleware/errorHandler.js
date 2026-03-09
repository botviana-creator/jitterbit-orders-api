/**
 * Middleware global de tratamento de erros.
 * Captura erros não tratados pelos controllers e retorna resposta padronizada.
 */
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor.',
  });
}

/**
 * Middleware para rotas não encontradas (404).
 */
function notFound(req, res) {
  res.status(404).json({ error: `Rota '${req.originalUrl}' não encontrada.` });
}

module.exports = { errorHandler, notFound };
