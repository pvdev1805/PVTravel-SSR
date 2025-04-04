module.exports.list = async (req, res) => {
  res.render('admin/pages/order-list', {
    pageTitle: 'Order List'
  })
}

module.exports.edit = async (req, res) => {
  res.render('admin/pages/order-edit', {
    pageTitle: 'Order: PVGST001'
  })
}
