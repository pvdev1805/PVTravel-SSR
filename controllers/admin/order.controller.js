module.exports.list = async (req, res) => {
  res.render('admin/pages/order-list', {
    pageTitle: 'Order List'
  })
}
