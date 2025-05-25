// Show/Hide Menu Mobile
const buttonMenuMobile = document.querySelector('.header .inner-button-menu')
if (buttonMenuMobile) {
  const sider = document.querySelector('.sider')
  const siderOverlay = document.querySelector('.sider-overlay')

  buttonMenuMobile.addEventListener('click', () => {
    sider.classList.add('active')
    siderOverlay.classList.add('active')
  })

  siderOverlay.addEventListener('click', () => {
    sider.classList.remove('active')
    siderOverlay.classList.remove('active')
  })
}
// End Show/Hide Menu Mobile

// Add New Schedule - Section 8 - Create Tour page
const scheduleSection8 = document.querySelector('.section-8 .inner-schedule')
if (scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector('.inner-schedule-create')
  const listItem = scheduleSection8.querySelector('.inner-schedule-list')

  // Add New Schedule
  buttonCreate.addEventListener('click', () => {
    const firstItem = listItem.querySelector('.inner-schedule-item')
    const cloneItem = firstItem.cloneNode(true)

    cloneItem.querySelector('.inner-schedule-head input').value = ''

    const body = cloneItem.querySelector('.inner-schedule-body')
    const id = `mce_${Date.now()}`
    body.innerHTML = `<textarea id="${id}" textarea-mce></textarea>`

    listItem.appendChild(cloneItem)
    initTinyMCE(`#${id}`)
  })

  // Show/Hide Item
  listItem.addEventListener('click', (event) => {
    // Show/Hide Description of Schedule Item
    if (event.target.closest('.inner-more')) {
      const parentItem = event.target.closest('.inner-schedule-item')
      if (parentItem) {
        parentItem.classList.toggle('hidden')
      }
    }

    // Remove Schedule Item
    if (event.target.closest('.inner-remove')) {
      const parentItem = event.target.closest('.inner-schedule-item')
      const totalItem = listItem.querySelectorAll('.inner-schedule-item').length
      if (parentItem && totalItem > 1) {
        parentItem.remove()
      }
    }
  })

  // Drag and Drop Schedule Item using SortableJS
  new Sortable(listItem, {
    animation: 150,
    handle: '.inner-move',
    onStart: (event) => {
      const textarea = event.item.querySelector('[textarea-mce]')
      const id = textarea.id
      tinymce.get(id).remove()
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector('[textarea-mce]')
      const id = textarea.id
      initTinyMCE(`#${id}`)
    }
  })
}
// End Add New Schedule - Section 8 - Create Tour page

// FilePond - Upload Image
const listFilePondImage = document.querySelectorAll('[filepond-image]')
let filePond = {}
if (listFilePondImage) {
  listFilePondImage.forEach((filePondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview)
    FilePond.registerPlugin(FilePondPluginFileValidateType)

    let files = null
    const elementImageDefault = filePondImage.closest('[image-default]')
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute('image-default')
      if (imageDefault) {
        files = [
          {
            source: imageDefault
          }
        ]
      }
    }

    filePond[filePondImage.name] = FilePond.create(filePondImage, {
      labelIdle: '+',
      files: files
    })
  })
}
// End FilePond - Upload Image

// Revenue Chart - Dashboard page
const revenueChart = document.querySelector('#revenue-chart')
if (revenueChart) {
  new Chart(revenueChart, {
    type: 'line',
    data: {
      labels: ['01', '02', '03', '04', '05', '06', '07'],
      datasets: [
        {
          label: 'Feb 2025',
          data: [280, 120, 320, 240, 500, 370, 460],
          borderColor: '#36a1ea',
          borderWidth: 1.5
        },
        {
          label: 'Jan 2025',
          data: [100, 150, 120, 400, 360, 430, 410],
          borderColor: '#fe6383',
          borderWidth: 1.5
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (AUD)'
          }
        }
      },
      maintainAspectRatio: false
    }
  })
}
// End Revenue Chart - Dashboard page

// JustValidate - Category Create Form Validation
const categoryCreateForm = document.querySelector('#category-create-form')
if (categoryCreateForm) {
  const validator = new JustValidate('#category-create-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: ' Please enter category name!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value
      const parent = event.target.parent.value
      const position = event.target.position.value
      const status = event.target.status.value
      const avatars = filePond.avatar.getFiles()

      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
      }

      const description = tinymce.get('description').getContent()

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('name', name)
      formData.append('parent', parent)
      formData.append('position', position)
      formData.append('status', status)
      formData.append('avatar', avatar)
      formData.append('description', description)

      fetch(`/${pathAdmin}/category/create`, {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/category/list`
          }
        })
    })
}
// End JustValidate - Category Create Form Validation

// JustValidate - Category Edit Form Validation
const categoryEditForm = document.querySelector('#category-edit-form')
if (categoryEditForm) {
  const validator = new JustValidate('#category-edit-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Please enter category name!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value
      const name = event.target.name.value
      const parent = event.target.parent.value
      const position = event.target.position.value
      const status = event.target.status.value
      const avatars = filePond.avatar.getFiles()

      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
        const elementImageDefault = event.target.avatar.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(avatar.name)) {
            avatar = null
          }
        }
      }

      const description = tinymce.get('description').getContent()

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('name', name)
      formData.append('parent', parent)
      formData.append('position', position)
      formData.append('status', status)
      formData.append('avatar', avatar)
      formData.append('description', description)

      fetch(`/${pathAdmin}/category/edit/${id}`, {
        method: 'PATCH',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/category/edit/${id}`
          }
        })
    })
}
// End JustValidate - Category Edit Form Validation

// JustValidate - Tour Create Form Validation
const tourCreateForm = document.querySelector('#tour-create-form')
if (tourCreateForm) {
  const validator = new JustValidate('#tour-create-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Please enter tour name!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value
      const category = event.target.category.value
      const position = event.target.position.value
      const status = event.target.status.value
      const avatars = filePond.avatar.getFiles()

      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
      }

      const priceAdult = event.target.priceAdult.value
      const priceChildren = event.target.priceChildren.value
      const priceBaby = event.target.priceBaby.value

      const priceNewAdult = event.target.priceNewAdult.value
      const priceNewChildren = event.target.priceNewChildren.value
      const priceNewBaby = event.target.priceNewBaby.value

      const stockAdult = event.target.stockAdult.value
      const stockChildren = event.target.stockChildren.value
      const stockBaby = event.target.stockBaby.value

      const locations = []

      const time = event.target.time.value
      const vehicle = event.target.vehicle.value
      const departureDate = event.target.departureDate.value

      const information = tinymce.get('information').getContent()

      const schedules = []

      // Locations
      const listElementLocation = tourCreateForm.querySelectorAll(`input[name="locations"]:checked`)
      listElementLocation.forEach((input) => {
        locations.push(input.value)
      })
      // End Locations

      // Schedules
      const listElementSchedule = tourCreateForm.querySelectorAll('.inner-schedule-item')
      listElementSchedule.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector(`input`)
        const title = input.value

        const textarea = scheduleItem.querySelector(`textarea`)
        const idTextarea = textarea.id
        const description = tinymce.get(idTextarea).getContent()

        schedules.push({
          title: title,
          description: description
        })
      })
      // End Schedules

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('name', name)
      formData.append('category', category)
      formData.append('position', position)
      formData.append('status', status)
      formData.append('avatar', avatar)
      formData.append('priceAdult', priceAdult)
      formData.append('priceChildren', priceChildren)
      formData.append('priceBaby', priceBaby)
      formData.append('priceNewAdult', priceNewAdult)
      formData.append('priceNewChildren', priceNewChildren)
      formData.append('priceNewBaby', priceNewBaby)
      formData.append('stockAdult', stockAdult)
      formData.append('stockChildren', stockChildren)
      formData.append('stockBaby', stockBaby)
      formData.append('locations', JSON.stringify(locations))
      formData.append('time', time)
      formData.append('vehicle', vehicle)
      formData.append('departureDate', departureDate)
      formData.append('information', information)
      formData.append('schedules', JSON.stringify(schedules))

      fetch(`/${pathAdmin}/tour/create`, {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/tour/list`
          }
        })
    })
}
// End JustValidate - Tour Create Form Validation

// JustValidate - Tour Edit Form Validation
const tourEditForm = document.querySelector('#tour-edit-form')
if (tourEditForm) {
  const validator = new JustValidate('#tour-edit-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Please enter tour name!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value
      const name = event.target.name.value
      const category = event.target.category.value
      const position = event.target.position.value
      const status = event.target.status.value
      const avatars = filePond.avatar.getFiles()

      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
        const elementImageDefault = event.target.avatar.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(avatar.name)) {
            avatar = null
          }
        }
      }

      const priceAdult = event.target.priceAdult.value
      const priceChildren = event.target.priceChildren.value
      const priceBaby = event.target.priceBaby.value
      const priceNewAdult = event.target.priceNewAdult.value
      const priceNewChildren = event.target.priceNewChildren.value
      const priceNewBaby = event.target.priceNewBaby.value
      const stockAdult = event.target.stockAdult.value
      const stockChildren = event.target.stockChildren.value
      const stockBaby = event.target.stockBaby.value
      const locations = []
      const time = event.target.time.value
      const vehicle = event.target.vehicle.value
      const departureDate = event.target.departureDate.value
      const information = tinymce.get('information').getContent()
      const schedules = []

      // locations
      const listElementLocation = tourEditForm.querySelectorAll('input[name="locations"]:checked')
      listElementLocation.forEach((input) => {
        locations.push(input.value)
      })
      // End locations

      // schedules
      const listElementSchedule = tourEditForm.querySelectorAll('.inner-schedule-item')
      listElementSchedule.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector('input')
        const title = input.value

        const textarea = scheduleItem.querySelector('textarea')
        const idTextarea = textarea.id
        const description = tinymce.get(idTextarea).getContent()

        schedules.push({
          title: title,
          description: description
        })
      })
      // End schedules

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('name', name)
      formData.append('category', category)
      formData.append('position', position)
      formData.append('status', status)
      formData.append('avatar', avatar)
      formData.append('priceAdult', priceAdult)
      formData.append('priceChildren', priceChildren)
      formData.append('priceBaby', priceBaby)
      formData.append('priceNewAdult', priceNewAdult)
      formData.append('priceNewChildren', priceNewChildren)
      formData.append('priceNewBaby', priceNewBaby)
      formData.append('stockAdult', stockAdult)
      formData.append('stockChildren', stockChildren)
      formData.append('stockBaby', stockBaby)
      formData.append('locations', JSON.stringify(locations))
      formData.append('time', time)
      formData.append('vehicle', vehicle)
      formData.append('departureDate', departureDate)
      formData.append('information', information)
      formData.append('schedules', JSON.stringify(schedules))

      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: 'PATCH',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/tour/edit/${id}`
          }
        })
    })
}
// End JustValidate - Tour Edit Form Validation

// JustValidate - Order Edit Form Validation
const orderEditForm = document.querySelector('#order-edit-form')
if (orderEditForm) {
  const phoneInput = orderEditForm.querySelector('#phone')
  phoneInput.addEventListener('keydown', (event) => {
    // Allow Backspace, Delete, Arrow keys, and Tab keys
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Tab'
    ) {
      return
    }

    // Allow numeric characters (0-9) only
    if (/[^0-9]/.test(event.key)) {
      event.preventDefault()
    }
  })

  const validator = new JustValidate('#order-edit-form')

  validator
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Full name is required!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Full name must be at least 5 characters!'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full name must not exceed 50 characters!'
      }
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Phone is required!'
      },
      {
        rule: 'customRegexp',
        value: /^(61|0)[2-578]\d{8}$/g,
        errorMessage: 'Phone number is invalid!'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value
      const phone = event.target.phone.value
      const note = event.target.note.value
      const paymentMethod = event.target.paymentMethod.value
      const paymentStatus = event.target.paymentStatus.value
      const status = event.target.status.value

      console.log('Full Name:', fullName)
      console.log('Phone:', phone)
      console.log('Note:', note)
      console.log('Payment Method:', paymentMethod)
      console.log('Payment Status:', paymentStatus)
      console.log('Status:', status)
    })
}
// End JustValidate - Order Edit Form Validation

// JustValidate - Setting Website Info Form Validation
const settingWebsiteInfoForm = document.querySelector('#setting-website-info-form')
if (settingWebsiteInfoForm) {
  const validator = new JustValidate('#setting-website-info-form')

  validator
    .addField('#websiteName', [
      {
        rule: 'required',
        errorMessage: 'Website name is required!'
      }
    ])
    .addField('#email', [
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value
      const phone = event.target.phone.value
      const email = event.target.email.value
      const address = event.target.address.value

      const logos = filePond.logo.getFiles()
      let logo = null
      if (logos.length > 0) {
        logo = logos[0].file
        const elementImageDefault = event.target.logo.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(logo.name)) {
            logo = null
          }
        }
      }

      const favicons = filePond.favicon.getFiles()
      let favicon = null
      if (favicons.length > 0) {
        favicon = favicons[0].file
        const elementImageDefault = event.target.favicon.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(favicon.name)) {
            favicon = null
          }
        }
      }

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('websiteName', websiteName)
      formData.append('phone', phone)
      formData.append('email', email)
      formData.append('address', address)
      formData.append('logo', logo)
      formData.append('favicon', favicon)

      fetch(`/${pathAdmin}/setting/website-info`, {
        method: 'PATCH',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
}
// End JustValidate - Setting Website Info Form Validation

// JustValidate - Setting Account Admin Create Form Validation
const settingAccountAdminCreateForm = document.querySelector('#setting-account-admin-create-form')
if (settingAccountAdminCreateForm) {
  const phoneInput = settingAccountAdminCreateForm.querySelector('#phone')
  phoneInput.addEventListener('keydown', (event) => {
    // Allow Backspace, Delete, Arrow keys, and Tab keys
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Tab'
    ) {
      return
    }

    // Allow numeric characters (0-9) only
    if (/[^0-9]/.test(event.key)) {
      event.preventDefault()
    }
  })

  const validator = new JustValidate('#setting-account-admin-create-form')

  validator
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Full name is required!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Full name must be at least 5 characters!'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full name must not exceed 50 characters!'
      }
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Email is required!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Phone is required!'
      },
      {
        rule: 'customRegexp',
        value: /^(61|0)[2-578]\d{8}$/g,
        errorMessage: 'Phone number is invalid!'
      }
    ])
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Position in company is required!'
      }
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Password is required!'
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Password must be at least 8 characters!'
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Password must contain at least one uppercase letter!'
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Password must contain at least one lowercase letter!'
      },
      {
        validator: (value) => /[0-9]/.test(value),
        errorMessage: 'Password must contain at least one number!'
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Password must contain at least one special character!'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value
      const email = event.target.email.value
      const phone = event.target.phone.value
      const role = event.target.role.value
      const positionCompany = event.target.positionCompany.value
      const status = event.target.status.value
      const password = event.target.password.value

      const avatars = filePond.avatar.getFiles()
      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
      }

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('role', role)
      formData.append('positionCompany', positionCompany)
      formData.append('status', status)
      formData.append('password', password)
      formData.append('avatar', avatar)

      fetch(`/${pathAdmin}/setting/account-admin/create`, {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/setting/account-admin/list`
          }
        })
    })
}
// End JustValidate - Setting Account Admin Create Form Validation

// JustValidate - Setting Account Admin Edit Form Validation
const settingAccountAdminEditForm = document.querySelector('#setting-account-admin-edit-form')
if (settingAccountAdminEditForm) {
  const validator = new JustValidate('#setting-account-admin-edit-form')

  validator
    .addField(`#fullName`, [
      {
        rule: 'required',
        errorMessage: 'Full name is required!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Full name must be at least 5 characters!'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full name must not exceed 50 characters!'
      }
    ])
    .addField(`#email`, [
      {
        rule: 'required',
        errorMessage: 'Email is required!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .addField(`#phone`, [
      {
        rule: 'required',
        errorMessage: 'Phone is required!'
      },
      {
        rule: 'customRegexp',
        value: /^(61|0)[2-578]\d{8}$/g,
        errorMessage: 'Phone number is invalid!'
      }
    ])
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Position in company is required!'
      }
    ])
    .addField('#password', [
      {
        validator: (value) => (value ? value.length >= 8 : true),
        errorMessage: 'Password must be at least 8 characters!'
      },
      {
        validator: (value) => (value ? /[A-Z]/.test(value) : true),
        errorMessage: 'Password must contain at least one uppercase letter!'
      },
      {
        validator: (value) => (value ? /[a-z]/.test(value) : true),
        errorMessage: 'Password must contain at least one lowercase letter!'
      },
      {
        validator: (value) => (value ? /[0-9]/.test(value) : true),
        errorMessage: 'Password must contain at least one number!'
      },
      {
        validator: (value) => (value ? /[@$!%*?&]/.test(value) : true),
        errorMessage: 'Password must contain at least one special character!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value
      const fullName = event.target.fullName.value
      const email = event.target.email.value
      const phone = event.target.phone.value
      const role = event.target.role.value
      const positionCompany = event.target.positionCompany.value
      const status = event.target.status.value
      const password = event.target.password.value

      const avatars = filePond.avatar.getFiles()
      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
        const elementImageDefault = event.target.avatar.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(avatar.name)) {
            avatar = null
          }
        }
      }

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('role', role)
      formData.append('positionCompany', positionCompany)
      formData.append('status', status)
      formData.append('password', password)
      formData.append('avatar', avatar)

      fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
        method: 'PATCH',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
}
// End JustValidate - Setting Account Admin Edit Form Validation

// JustValidate - Setting Role Create Form Validation
const settingRoleCreateForm = document.querySelector('#setting-role-create-form')
if (settingRoleCreateForm) {
  const validator = new JustValidate('#setting-role-create-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Role name is required!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value
      const description = event.target.description.value

      const permissions = []

      // Permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll(`input[name="permissions"]:checked`)
      listElementPermission.forEach((input) => {
        permissions.push(input.value)
      })
      // End Permissions

      const dataFinal = {
        name: name,
        description: description,
        permissions: permissions
      }

      fetch(`/${pathAdmin}/setting/role/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.href = `/${pathAdmin}/setting/role/list`
          }
        })
    })
}
// End JustValidate - Setting Role Create Form Validation

// JustValidate - Setting Role Edit Form Validation
const settingRoleEditForm = document.querySelector('#setting-role-edit-form')
if (settingRoleEditForm) {
  const validator = new JustValidate('#setting-role-edit-form')

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Role name is required!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value
      const name = event.target.name.value
      const description = event.target.description.value

      const permissions = []

      // Permissions
      const listElementPermission = settingRoleEditForm.querySelectorAll(`input[name="permissions"]:checked`)
      listElementPermission.forEach((input) => {
        permissions.push(input.value)
      })
      // End Permissions

      const dataFinal = {
        name: name,
        description: description,
        permissions: permissions
      }

      fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
}
// End JustValidate - Setting Role Edit Form Validation

// JustValidate - Profile Edit Form Validation
const profileEditForm = document.querySelector('#profile-edit-form')
if (profileEditForm) {
  const phoneInput = profileEditForm.querySelector('#phone')
  phoneInput.addEventListener('keydown', (event) => {
    // Allow Backspace, Delete, Arrow keys, and Tab keys
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Tab'
    ) {
      return
    }

    // Allow numeric characters (0-9) only
    if (/[^0-9]/.test(event.key)) {
      event.preventDefault()
    }
  })

  const validator = new JustValidate('#profile-edit-form')

  validator
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Full name is required!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Full name must be at least 5 characters!'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full name must not exceed 50 characters!'
      }
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Email is required!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Phone is required!'
      },
      {
        rule: 'customRegexp',
        value: /^(61|0)[2-578]\d{8}$/g,
        errorMessage: 'Phone number is invalid!'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value
      const email = event.target.email.value
      const phone = event.target.phone.value

      const avatars = filePond.avatar.getFiles()
      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
        const elementImageDefault = event.target.avatar.closest('[image-default]')
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute('image-default')
          if (imageDefault.includes(avatar.name)) {
            avatar = null
          }
        }
      }

      // Create FormData object to send data to server
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('avatar', avatar)

      fetch(`/${pathAdmin}/profile/edit`, {
        method: 'PATCH',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
}
// End JustValidate - Profile Edit Form Validation

// JustValidate - Profile Change Password Form Validation
const profileChangePasswordForm = document.querySelector('#profile-change-password-form')
if (profileChangePasswordForm) {
  const validator = new JustValidate('#profile-change-password-form')

  validator
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Please enter new password!'
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Password must be at least 8 characters!'
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Password must contain at least one uppercase letter!'
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Password must contain at least one lowercase letter!'
      },
      {
        validator: (value) => /[0-9]/.test(value),
        errorMessage: 'Password must contain at least one number!'
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Password must contain at least one special character!'
      }
    ])
    .addField('#confirmPassword', [
      {
        rule: 'required',
        errorMessage: 'Please confirm your new password!'
      },
      {
        validator: (value, fields) => {
          const password = fields['#password'].elem.value
          return value === password
        },
        errorMessage: 'Confirm password does not match!'
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value
      const confirmPassword = event.target.confirmPassword.value

      const dataFinal = {
        password: password,
        confirmPassword: confirmPassword
      }

      fetch(`/${pathAdmin}/profile/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
}
// End JustValidate - Profile Change Password Form Validation

// Sider
const sider = document.querySelector('.sider')
if (sider) {
  const pathNameCurrent = window.location.pathname
  const splitPathNameCurrent = pathNameCurrent.split('/')
  const menuList = sider.querySelectorAll('a')
  menuList.forEach((item) => {
    const href = item.href
    const pathName = new URL(href).pathname
    const splitPathName = pathName.split('/')
    if (splitPathNameCurrent[1] === splitPathName[1] && splitPathNameCurrent[2] === splitPathName[2]) {
      item.classList.add('active')
    }
  })
}
// End Sider

// Logout
const buttonLogout = document.querySelector('.sider .inner-logout')
if (buttonLogout) {
  buttonLogout.addEventListener('click', () => {
    fetch(`/${pathAdmin}/account/logout`, {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 'success') {
          window.location.href = `/${pathAdmin}/account/login`
        }
      })
  })
}
// End Logout

// Alert
const alertTime = document.querySelector('[alert-time]')
if (alertTime) {
  let time = alertTime.getAttribute('alert-time')
  time = time ? parseInt(time) : 4000
  setTimeout(() => {
    alertTime.classList.add('alert-slide-out')
    setTimeout(() => {
      alertTime.remove()
    }, 500)
  }, time)
}
// End Alert

// Delete Button
const listButtonDelete = document.querySelectorAll('[button-delete]')
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach((button) => {
    button.addEventListener('click', () => {
      const dataApi = button.getAttribute('data-api')

      fetch(dataApi, {
        method: 'PATCH'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
  })
}
// End Delete Button

// Undo Button
const listButtonUndo = document.querySelectorAll('[button-undo]')
if (listButtonUndo.length > 0) {
  listButtonUndo.forEach((button) => {
    button.addEventListener('click', () => {
      const dataApi = button.getAttribute('data-api')

      fetch(dataApi, {
        method: 'PATCH'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    })
  })
}
// End - Undo Button

// Filter Status
const filterStatus = document.querySelector('[filter-status]')
if (filterStatus) {
  const url = new URL(window.location.href)

  filterStatus.addEventListener('change', () => {
    const value = filterStatus.value
    if (value) {
      url.searchParams.set('status', value)
    } else {
      url.searchParams.delete('status')
    }

    window.location.href = url.href
  })

  // Display default value of filter status
  const currentValue = url.searchParams.get('status')
  if (currentValue) {
    filterStatus.value = currentValue
  }
}
// End - Filter Status

// Filter Created By
const filterCreatedBy = document.querySelector('[filter-created-by]')
if (filterCreatedBy) {
  const url = new URL(window.location.href)

  filterCreatedBy.addEventListener('change', () => {
    const value = filterCreatedBy.value
    if (value) {
      url.searchParams.set('createdBy', value)
    } else {
      url.searchParams.delete('createdBy')
    }

    window.location.href = url.href
  })

  // Display default value of filter created by
  const currentValue = url.searchParams.get('createdBy')
  if (currentValue) {
    filterCreatedBy.value = currentValue
  }
}
// End Filter Created By

// Filter Start Date
const filterStartDate = document.querySelector('[filter-start-date]')
if (filterStartDate) {
  const url = new URL(window.location.href)

  filterStartDate.addEventListener('change', () => {
    const value = filterStartDate.value
    if (value) {
      url.searchParams.set('startDate', value)
    } else {
      url.searchParams.delete('startDate')
    }

    window.location.href = url.href
  })

  // Display default value of filter start date
  const currentValue = url.searchParams.get('startDate')
  if (currentValue) {
    filterStartDate.value = currentValue
  }
}
// End - Filter Start Date

// Filter End Date
const filterEndDate = document.querySelector('[filter-end-date]')
if (filterEndDate) {
  const url = new URL(window.location.href)

  filterEndDate.addEventListener('change', () => {
    const value = filterEndDate.value
    if (value) {
      url.searchParams.set('endDate', value)
    } else {
      url.searchParams.delete('endDate')
    }

    window.location.href = url.href
  })

  // Display default value of filter end date
  const currentValue = url.searchParams.get('endDate')
  if (currentValue) {
    filterEndDate.value = currentValue
  }
}
// End - Filter End Date

// Filter Role
const filterRole = document.querySelector('[filter-role]')
if (filterRole) {
  const url = new URL(window.location.href)

  filterRole.addEventListener('change', () => {
    const value = filterRole.value
    if (value) {
      url.searchParams.set('role', value)
    } else {
      url.searchParams.delete('role')
    }
    window.location.href = url.href
  })

  // Display default value of filter role
  const currentValue = url.searchParams.get('role')
  if (currentValue) {
    filterRole.value = currentValue
  }
}
// End - Filter Role

// Filter Reset
const filterReset = document.querySelector('[filter-reset]')
if (filterReset) {
  const url = new URL(window.location.href)

  filterReset.addEventListener('click', () => {
    url.search = ''
    window.location.href = url.href
  })
}
// End - Filter Reset

// Check All Checkbox
const checkAll = document.querySelector('[check-all]')
if (checkAll) {
  checkAll.addEventListener('click', () => {
    const listCheckItem = document.querySelectorAll('[check-item]')

    listCheckItem.forEach((item) => {
      item.checked = checkAll.checked
    })
  })
}
// End - Check All Checkbox

// Check Item Checkbox
const listCheckItem = document.querySelectorAll('[check-item]')
if (listCheckItem.length > 0) {
  listCheckItem.forEach((item) => {
    item.addEventListener('click', () => {
      const listCheckItemChecked = document.querySelectorAll('[check-item]:checked')
      const checkAll = document.querySelector('[check-all]')

      if (listCheckItemChecked.length === listCheckItem.length) {
        checkAll.checked = true
      } else {
        checkAll.checked = false
      }
    })
  })
}
// End - Check Item Checkbox

// Change Multi
const changeMulti = document.querySelector('[change-multi]')
if (changeMulti) {
  const select = changeMulti.querySelector('select')
  const button = changeMulti.querySelector('button')

  button.addEventListener('click', () => {
    const option = select.value

    const listCheckedInput = document.querySelectorAll('[check-item]:checked')

    if (option && listCheckedInput.length > 0) {
      const ids = []
      listCheckedInput.forEach((item) => {
        const id = item.getAttribute('check-item')
        ids.push(id)
      })

      const dataFinal = {
        option: option,
        ids: ids
      }

      const dataApi = changeMulti.getAttribute('data-api')

      fetch(dataApi, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 'error') {
            alert(data.message)
          }

          if (data.code == 'success') {
            window.location.reload()
          }
        })
    }
  })
}
// End - Change Multi

// Search
const inputSearch = document.querySelector('[search]')
if (inputSearch) {
  const url = new URL(window.location.href)

  inputSearch.addEventListener('keyup', (event) => {
    if (event.code == 'Enter') {
      const value = inputSearch.value
      if (value) {
        url.searchParams.set('keyword', value)
      } else {
        url.searchParams.delete('keyword')
      }

      window.location.href = url.href
    }
  })

  // Display default value of search
  const currentValue = url.searchParams.get('keyword')
  if (currentValue) {
    inputSearch.value = currentValue
  }
}
// End - Search

// Pagination
const pagination = document.querySelector('[pagination]')
if (pagination) {
  const url = new URL(window.location.href)

  pagination.addEventListener('change', () => {
    const value = pagination.value

    if (value) {
      url.searchParams.set('page', value)
    } else {
      url.searchParams.delete('page')
    }

    window.location.href = url.href
  })

  // Display default value of pagination
  const currentValue = url.searchParams.get('page')
  if (currentValue) {
    pagination.value = currentValue
  }
}
// End - Pagination
