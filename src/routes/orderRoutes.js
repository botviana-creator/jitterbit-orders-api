const express = require('express');
const router = express.Router();
const {
  criarPedido,
  buscarPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido,
} = require('../controllers/orderController');

// IMPORTANTE: A rota /list deve vir ANTES de /:orderId
// para evitar que "list" seja interpretado como um parâmetro dinâmico.
router.get('/list', listarPedidos);

router.post('/', criarPedido);
router.get('/:orderId', buscarPedido);
router.put('/:orderId', atualizarPedido);
router.delete('/:orderId', deletarPedido);

module.exports = router;
