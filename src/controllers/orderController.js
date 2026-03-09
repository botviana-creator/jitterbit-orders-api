const Order = require('../models/orderModel');

/**
 * POST /order
 * Cria um novo pedido no banco de dados.
 */
async function criarPedido(req, res) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação dos campos obrigatórios
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items?.length) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes: numeroPedido, valorTotal, dataCriacao, items.',
      });
    }

    const pedido = Order.criar(req.body);

    return res.status(201).json({
      message: 'Pedido criado com sucesso.',
      data: pedido,
    });
  } catch (error) {
    // Erro de chave duplicada (UNIQUE constraint)
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Já existe um pedido com este número.' });
    }
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}

/**
 * GET /order/:orderId
 * Busca um pedido pelo número do pedido passado na URL.
 */
async function buscarPedido(req, res) {
  try {
    const pedido = Order.buscarPorId(req.params.orderId);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    return res.status(200).json({ data: pedido });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}

/**
 * GET /order/list
 * Lista todos os pedidos cadastrados.
 */
async function listarPedidos(req, res) {
  try {
    const pedidos = Order.listarTodos();
    return res.status(200).json({ total: pedidos.length, data: pedidos });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}

/**
 * PUT /order/:orderId
 * Atualiza os dados de um pedido existente.
 */
async function atualizarPedido(req, res) {
  try {
    const pedidoAtualizado = Order.atualizar(req.params.orderId, req.body);
    return res.status(200).json({
      message: 'Pedido atualizado com sucesso.',
      data: pedidoAtualizado,
    });
  } catch (error) {
    if (error.message === 'Pedido não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}

/**
 * DELETE /order/:orderId
 * Remove um pedido pelo número do pedido.
 */
async function deletarPedido(req, res) {
  try {
    Order.deletar(req.params.orderId);
    return res.status(200).json({ message: 'Pedido deletado com sucesso.' });
  } catch (error) {
    if (error.message === 'Pedido não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}

module.exports = { criarPedido, buscarPedido, listarPedidos, atualizarPedido, deletarPedido };
