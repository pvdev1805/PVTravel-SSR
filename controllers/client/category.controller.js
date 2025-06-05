const Category = require('../../models/category.model')

module.exports.list = async (req, res) => {
  // Get Category by slug
  const slug = req.params.slug

  // Find Category by slug
  const category = await Category.findOne({
    slug: slug,
    deleted: false,
    status: 'active'
  })

  // Breadcrumb
  const breadcrumb = {
    image: '',
    title: '',
    list: [
      {
        title: 'Home',
        url: '/'
      }
    ]
  }

  // Find parent category
  if (category && category.parent) {
    const parentCategory = await Category.findOne({
      _id: category.parent,
      deleted: false,
      status: 'active'
    })

    if (parentCategory) {
      breadcrumb.list.push({
        title: parentCategory.name,
        url: `/category/${parentCategory.slug}`
      })
    }
  }
  // End - Find parent category

  // Add current category
  if (category) {
    breadcrumb.list.push({
      title: category.name,
      url: `/category/${category.slug}`
    })

    breadcrumb.image = category.avatar
    breadcrumb.title = category.name
  }
  // End - Add current category

  // End - Breadcrumb

  res.render('client/pages/tour-list', {
    pageTitle: 'Tour List',
    breadcrumb: breadcrumb
  })
}
