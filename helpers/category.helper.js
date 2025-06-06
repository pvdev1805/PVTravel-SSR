const buildCategoryTree = (categories, parentId = '') => {
  // Create an array to hold the tree structure
  const tree = []

  categories.forEach((item) => {
    if (item.parent === parentId) {
      const children = buildCategoryTree(categories, item.id)

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  })

  return tree
}

module.exports.buildCategoryTree = buildCategoryTree
