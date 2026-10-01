const QRCode = require("qrcode");

const generateTableQR = async (tableId) => {
  const qrData = `http://localhost:5173/menu?table=${tableId}`;

  return await QRCode.toDataURL(qrData);
};

module.exports = {
  generateTableQR,
};