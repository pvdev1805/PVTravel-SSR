const moment = require('moment')

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

  // Tour List
  const allCategoryChildren = []

  const getCategoryChildren = async (parentId) => {
    const childs = await Category.find({
      parent: parentId,
      deleted: false,
      status: 'active'
    })

    for (const child of childs) {
      allCategoryChildren.push(child)

      await getCategoryChildren(child.id)
    }
  }

  await getCategoryChildren(category.id)

  const tourListSection9 = await Tour.find({
    category: { $in: [category.id, ...allCategoryChildren] },
    deleted: false,
    status: 'active'
  }).sort({
    position: 'desc'
  })

  for (const tour of tourListSection9) {
    tour.departureDateFormat = moment(tour.departureDate).format('DD/MM/YYYY')
  }
  // End - Tour List

  res.render('client/pages/tour-list', {
    pageTitle: 'Tour List',
    breadcrumb: breadcrumb,
    category: category,
    tourListSection9: tourListSection9
  })
}
