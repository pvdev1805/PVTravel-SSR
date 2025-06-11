const Category = require('../../models/category.model')
const Tour = require('../../models/tour.model')

module.exports.detail = async (req, res) => {
  const slug = req.params.slug

  const tourDetail = await Tour.findOne({
    slug: slug,
    deleted: false,
    status: 'active'
  })

  if (tourDetail) {
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

    // Find level 1 parent category
    const category = await Category.findOne({
      _id: tourDetail.category,
      deleted: false,
      status: 'active'
    })

    // Find level 2 parent category
    if (category && category.parent) {
      const parentCategory = await Category.findOne({
        _id: category.parent,
        deleted: false,
        status: 'active'
      })

      // Add parent category to breadcrumb
      if (parentCategory) {
        breadcrumb.list.push({
          title: parentCategory.name,
          url: `/category/${parentCategory.slug}`
        })
      }
    }

    // Add current category to breadcrumb
    if (category) {
      breadcrumb.list.push({
        title: category.name,
        url: `/category/${category.slug}`
      })
    }

    // Add current tour to breadcrumb
    breadcrumb.list.push({
      title: tourDetail.name,
      url: `/tour/detail/${slug}`
    })

    breadcrumb.image = tourDetail.avatar
    breadcrumb.title = tourDetail.name
    // End - Breadcrumb

    res.render('client/pages/tour-detail', {
      pageTitle: 'Tour Detail',
      breadcrumb: breadcrumb
    })
  } else {
    res.redirect('/')
  }
}
