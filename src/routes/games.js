import { Router } from 'express';
import PDFDocument from 'pdfkit';

const pdfColumns = [
  { label: 'Código', width: 72 },
  { label: 'Título', width: 205 },
  { label: 'Preço', width: 105 },
  { label: 'Gênero', width: 133 },
];

const pdfTableWidth = pdfColumns.reduce((sum, column) => sum + column.width, 0);

function drawPdfHeading(document) {
  document
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor('#172554')
    .text('Catálogo de Jogos');
  document.moveDown(0.8);
}

function drawPdfTableHeader(document) {
  const x = document.page.margins.left;
  const y = document.y;

  document.save();
  document.rect(x, y, pdfTableWidth, 24).fill('#e2e8f0');
  document.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');

  let columnX = x;
  for (const column of pdfColumns) {
    document.text(column.label, columnX + 6, y + 7, {
      width: column.width - 12,
      lineBreak: false,
    });
    columnX += column.width;
  }

  document.restore();
  document.y = y + 24;
}

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function drawPdfGameRow(document, game) {
  const values = [game.code, game.title, formatPrice(game.price), game.genre];
  const x = document.page.margins.left;
  const rowY = document.y;

  document.font('Helvetica').fontSize(9).fillColor('#0f172a');
  const rowHeight = Math.max(
    ...values.map((value, index) => document.heightOfString(value, {
      width: pdfColumns[index].width - 12,
    })),
  ) + 10;

  if (rowY + rowHeight > document.page.height - document.page.margins.bottom) {
    document.addPage();
    drawPdfHeading(document);
    drawPdfTableHeader(document);
  }

  const visibleRowY = document.y;
  let columnX = x;

  document.save();
  document.rect(x, visibleRowY, pdfTableWidth, rowHeight).strokeColor('#cbd5e1').stroke();

  values.forEach((value, index) => {
    document.text(value, columnX + 6, visibleRowY + 5, {
      width: pdfColumns[index].width - 12,
    });
    columnX += pdfColumns[index].width;
  });

  document.restore();
  document.y = visibleRowY + rowHeight;
}

function sendGamesPdf(res, next, games) {
  const document = new PDFDocument({ size: 'A4', margin: 40 });

  document.on('error', (error) => {
    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    next(error);
  });

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="jogos.pdf"',
  });
  document.pipe(res);

  drawPdfHeading(document);

  if (games.length === 0) {
    document
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#334155')
      .text('Nenhum jogo cadastrado.');
    document.end();
    return;
  }

  drawPdfTableHeader(document);
  for (const game of games) {
    drawPdfGameRow(document, game);
  }

  document.end();
}

export function createGamesRouter(store) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(store.list());
  });

  router.post('/', (req, res) => {
    const result = store.create(req.body);

    if (!result.valid) {
      return res.status(400).json({ erro: result.message });
    }

    return res.status(201).json(result.game);
  });

  router.get('/pdf', (req, res, next) => {
    sendGamesPdf(res, next, store.list());
  });

  router.get('/:codigo', (req, res) => {
    const game = store.findByCode(req.params.codigo);

    if (!game) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    return res.json(game);
  });

  router.delete('/:codigo', (req, res) => {
    if (!store.deleteByCode(req.params.codigo)) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    return res.status(204).end();
  });

  return router;
}
