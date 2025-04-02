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

    filePond[filePondImage.name] = FilePond.create(filePondImage, {
      labelIdle: '+'
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

      console.log('Category Name:', name)
      console.log('Parent Category:', parent)
      console.log('Position:', position)
      console.log('Status:', status)
      console.log('Avatar:', avatar)
      console.log('Description:', description)
    })
}
// End JustValidate - Category Create Form Validation

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

      console.log('Tour Name:', name)
      console.log('Category:', category)
      console.log('Position:', position)
      console.log('Status:', status)
      console.log('Avatar:', avatar)
      console.log('Price Old Adult:', priceAdult)
      console.log('Price Old Children:', priceChildren)
      console.log('Price Old Baby:', priceBaby)
      console.log('Price New Adult:', priceNewAdult)
      console.log('Price New Children:', priceNewChildren)
      console.log('Price New Baby:', priceNewBaby)
      console.log('Stock Adult:', stockAdult)
      console.log('Stock Children:', stockChildren)
      console.log('Stock Baby:', stockBaby)
      console.log('Locations:', locations)
      console.log('Time:', time)
      console.log('Vehicle:', vehicle)
      console.log('Departure Date:', departureDate)
      console.log('Information:', information)
      console.log('Schedules:', schedules)
    })
}
// End JustValidate - Tour Create Form Validation

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
      }

      const favicons = filePond.favicon.getFiles()
      let favicon = null
      if (favicons.length > 0) {
        favicon = favicons[0].file
      }

      console.log('Website Name:', websiteName)
      console.log('Phone:', phone)
      console.log('Email:', email)
      console.log('Address:', address)
      console.log('Logo:', logo)
      console.log('Favicon:', favicon)
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

      console.log('Full Name:', fullName)
      console.log('Email:', email)
      console.log('Phone:', phone)
      console.log('Role:', role)
      console.log('Position in Company:', positionCompany)
      console.log('Status:', status)
      console.log('Password:', password)
      console.log('Avatar:', avatar)
    })
}
// End JustValidate - Setting Account AdminCreate Form Validation

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

      console.log('Role Name:', name)
      console.log('Description:', description)
      console.log('Permissions:', permissions)
    })
}
// End JustValidate - Setting Role Create Form Validation

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
      const positionCompany = event.target.positionCompany.value
      const role = event.target.role.value

      const avatars = filePond.avatar.getFiles()
      let avatar = null
      if (avatars.length > 0) {
        avatar = avatars[0].file
      }

      console.log('Full Name:', fullName)
      console.log('Email:', email)
      console.log('Phone:', phone)
      console.log('Position in Company:', positionCompany)
      console.log('Role:', role)
      console.log('Avatar:', avatar)
    })
}
// JustValidate - Profile Edit Form Validation

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

      console.log('New Password:', password)
    })
}
// End JustValidate - Profile Change Password Form Validation
