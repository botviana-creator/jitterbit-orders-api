const db = require('../config/database');

/**
 * Mapeia o body recebido (formato PT-BR) para o formato interno (EN) antes de salvar.
 * @param {Object} body - Payload recebido no request
 * @returns {Object} - Objeto mapeado para persistência
 */
function mapearPedido(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao).toISOString(),
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

/**
 * Insere um novo pedido e seus itens no banco de dados.
 * Utiliza transação para garantir consistência.
 */
function criar(body) {
  const pedido = mapearPedido(body);

  const inserirPedido = db.prepare(`
    INSERT INTO "Order" (orderId, value, creationDate)
    VALUES (@orderId, @value, @creationDate)
  `);

  const inserirItem = db.prepare(`
    INSERT INTO Items (orderId, productId, quantity, price)
    VALUES (@orderId, @productId, @quantity, @price)
  `);

  const transacao = db.transaction(() => {
    inserirPedido.run(pedido);
    for (const item of pedido.items) {
      inserirItem.run({ orderId: pedido.orderId, ...item });
    }
  });

  transacao();
  return pedido;
}

/**
 * Busca um pedido pelo seu orderId, incluindo os itens associados.
 */
function buscarPorId(orderId) {
  const pedido = db
    .prepare(`SELECT * FROM "Order" WHERE orderId = ?`)
    .get(orderId);

  if (!pedido) return null;

  const items = db
    .prepare(`SELECT productId, quantity, price FROM Items WHERE orderId = ?`)
    .all(orderId);

  return { ...pedido, items };
}

/**
 * Retorna todos os pedidos com seus respectivos itens.
 */
function listarTodos() {
  const pedidos = db.prepare(`SELECT * FROM "Order"`).all();

  return pedidos.map((pedido) => {
    const items = db
      .prepare(`SELECT productId, quantity, price FROM Items WHERE orderId = ?`)
      .all(pedido.orderId);
    return { ...pedido, items };
  });
}

/**
 * Atualiza um pedido existente e substitui seus itens.
 * Utiliza transação para garantir consistência.
 */
function atualizar(orderId, body) {
  const pedido = mapearPedido(body);

  const atualizarPedido = db.prepare(`
    UPDATE "Order" SET value = @value, creationDate = @creationDate
    WHERE orderId = @orderId
  `);

  const deletarItens = db.prepare(`DELETE FROM Items WHERE orderId = ?`);

  const inserirItem = db.prepare(`
    INSERT INTO Items (orderId, productId, quantity, price)
    VALUES (@orderId, @productId, @quantity, @price)
  `);

  const transacao = db.transaction(() => {
    const resultado = atualizarPedido.run({ ...pedido, orderId });
    if (resultado.changes === 0) throw new Error('Pedido não encontrado.');
    deletarItens.run(orderId);
    for (const item of pedido.items) {
      inserirItem.run({ orderId, ...item });
    }
  });

  transacao();
  return buscarPorId(orderId);
}

/**
 * Remove um pedido e seus itens (CASCADE) pelo orderId.
 */
function deletar(orderId) {
  const resultado = db
    .prepare(`DELETE FROM "Order" WHERE orderId = ?`)
    .run(orderId);

  if (resultado.changes === 0) throw new Error('Pedido não encontrado.');
  return true;
}

module.exports = { criar, buscarPorId, listarTodos, atualizar, deletar };
