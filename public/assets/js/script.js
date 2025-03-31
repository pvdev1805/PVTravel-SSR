// Menu Mobile
const buttonMenuMobile = document.querySelector('.header .inner-menu-mobile')
if (buttonMenuMobile) {
  const menu = document.querySelector('.header .inner-menu')

  //   Display Menu when user click on Menu Mobile button
  buttonMenuMobile.addEventListener('click', () => {
    menu.classList.add('active')
  })

  //   Hide Menu when user click on the Overlay
  const overlay = menu.querySelector('.inner-overlay')
  if (overlay) {
    overlay.addEventListener('click', () => {
      menu.classList.remove('active')
    })
  }

  //   Display SubMenu when user click on the down arrow
  const listButtonSubMenu = menu.querySelectorAll('ul > li > i')
  if (listButtonSubMenu) {
    listButtonSubMenu.forEach((button) => {
      button.addEventListener('click', () => {
        button.parentNode.classList.toggle('active')
      })
    })
  }
}
// End Menu Mobile

// Box Address - Section 1
const boxAddressSection1 = document.querySelector('.section-1 .inner-form .inner-address')
if (boxAddressSection1) {
  // Show/Hide Box Suggest
  const input = boxAddressSection1.querySelector('.inner-input')

  input.addEventListener('focus', () => {
    boxAddressSection1.classList.add('active')
  })

  input.addEventListener('blur', () => {
    boxAddressSection1.classList.remove('active')
  })

  // Choose Address by click on the Suggest Item
  const listItem = boxAddressSection1.querySelectorAll('.inner-suggest-list .inner-item')
  if (listItem.length > 0) {
    listItem.forEach((item) => {
      item.addEventListener('mousedown', () => {
        const title = item.querySelector('.inner-item-title').innerHTML.trim()
        input.value = title
      })
    })
  }
}
// End Box Address - Section 1

// Box User - Section 1
const boxUserSection1 = document.querySelector('.section-1 .inner-form .inner-user')
if (boxUserSection1) {
  const input = boxUserSection1.querySelector('.inner-input')

  // Show Box Quantity Suggest
  input.addEventListener('focus', () => {
    boxUserSection1.classList.add('active')
  })

  // Hide Box Quantity Suggest
  document.addEventListener('click', (event) => {
    if (!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove('active')
    }
  })

  // Increase/Decrease Quantity input value
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll('.inner-count .inner-number')
    const listNumber = []
    listBoxNumber.forEach((boxNumber) => {
      const number = parseInt(boxNumber.innerHTML)
      listNumber.push(number)
    })

    const value = `Adult: ${listNumber[0]} - Child: ${listNumber[1]} - Infant: ${listNumber[2]}`
    input.value = value
  }

  // Resolve onClick event for "+" button
  const listButtonUp = boxUserSection1.querySelectorAll('.inner-count .inner-up')
  listButtonUp.forEach((button) => {
    button.addEventListener('click', () => {
      const parent = button.parentNode
      const boxNumber = parent.querySelector('.inner-number')
      const number = parseInt(boxNumber.innerHTML)
      const numberUpdate = number + 1
      boxNumber.innerHTML = numberUpdate
      updateQuantityInput()
    })
  })

  // Resolve onClick event for "-" button
  const listButtonDown = boxUserSection1.querySelectorAll('.inner-count .inner-down')
  listButtonDown.forEach((button) => {
    button.addEventListener('click', () => {
      const parent = button.parentNode
      const boxNumber = parent.querySelector('.inner-number')
      const number = parseInt(boxNumber.innerHTML)
      if (number > 0) {
        const numberUpdate = number - 1
        boxNumber.innerHTML = numberUpdate
        updateQuantityInput()
      }
    })
  })
}
// End Box User - Section 1

// Clock Expire - Section 2
const clockExpire = document.querySelector('[clock-expire]')

if (clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute('clock-expire')

  // Convert DateTime String to DateTime Object
  const expireDateTime = new Date(expireDateTimeString)

  // Function to update Clock Expire
  const updateClock = () => {
    const now = new Date()
    const remainingTime = expireDateTime - now

    if (remainingTime > 0) {
      // Calculate remaining days
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))

      // Calculate remaining hours
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24)

      // Calculate remaining minutes
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60)

      // Calculate remaining seconds
      const seconds = Math.floor((remainingTime / 1000) % 60)

      const listBoxNumber = clockExpire.querySelectorAll('.inner-number')
      listBoxNumber[0].innerHTML = `${days}`.padStart(2, '0')
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, '0')
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, '0')
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, '0')
    } else {
      clearInterval(intervalClock)
    }
  }

  // Call the updateClock function every 1 second
  const intervalClock = setInterval(updateClock, 1000)
}
// End Clock Expire - Section 2

// Box Filter - Section 9
const buttonFilterMobile = document.querySelector('.section-9 .inner-filter-mobile')

if (buttonFilterMobile) {
  const boxLeft = document.querySelector('.section-9 .inner-left')

  buttonFilterMobile.addEventListener('click', () => {
    boxLeft.classList.add('active')
  })

  const overlay = document.querySelector('.section-9 .inner-left .inner-overlay')
  overlay.addEventListener('click', () => {
    boxLeft.classList.remove('active')
  })
}
// End Box Filter - Section 9

// Box Tour Info - Section 10
const boxTourInfo = document.querySelector('.section-10 .box-tour-info')
if (boxTourInfo) {
  const buttonViewMore = boxTourInfo.querySelector('.inner-read-more button')

  buttonViewMore.addEventListener('click', () => {
    if (boxTourInfo.classList.contains('active')) {
      boxTourInfo.classList.remove('active')
      buttonViewMore.innerHTML = 'View More'
    } else {
      boxTourInfo.classList.add('active')
      buttonViewMore.innerHTML = 'View Less'
    }
  })

  new Viewer(boxTourInfo)
}
// End Box Tour Info - Section 10

// Initialize AOS
AOS.init()
// End Initialize AOS

// Swiper Section 2
const swiperSection2 = document.querySelector('.swiper-section-2')
if (swiperSection2) {
  new Swiper('.swiper-section-2', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  })
}

// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector('.swiper-section-3')
if (swiperSection3) {
  new Swiper('.swiper-section-3', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    loop: true,
    breakpoints: {
      576: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      }
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  })
}
// End Swiper Section 3

// Swiper Box Images - Section 10
const boxImages = document.querySelector('.box-images')
if (boxImages) {
  const swiperBoxImagesThumb = new Swiper('.swiper-box-images-thumb', {
    spaceBetween: 5,
    slidesPerView: 4,
    breakpoints: {
      576: {
        spaceBetween: 10
      }
    }
  })

  const swiperBoxImagesMain = new Swiper('.swiper-box-images-main', {
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    thumbs: {
      swiper: swiperBoxImagesThumb
    }
  })
}
// End Swiper Box Images - Section 10

// ViewerJS - Zoom Box Images Main
const boxImageMain = document.querySelector('.box-images .inner-images-main')
if (boxImageMain) {
  new Viewer(boxImageMain)
}
// End ViewerJS - Zoom Box Images Main

// ViewerJS - Zoom Box Tour Schedule
const boxTourSchedule = document.querySelector('.box-tour-schedule')
if (boxTourSchedule) {
  new Viewer(boxTourSchedule)
}
// End ViewerJS - Zoom Box Tour Schedule

// JustValidate - Email Form
const emailForm = document.querySelector('#email-form')
if (emailForm) {
  const validator = new JustValidate('#email-form')

  validator
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Email is required'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid'
      }
    ])
    .onSuccess((event) => {
      const email = event.target.email.value
      console.log(email)
    })
}
// End JustValidate - Email Form

// JustValidate - Coupon Form
const couponForm = document.querySelector('#coupon-form')
if (couponForm) {
  const validator = new JustValidate('#coupon-form')

  validator
    .addField('#coupon-input', [
      {
        rule: 'required',
        errorMessage: 'Coupon is required'
      }
    ])
    .onSuccess((event) => {
      const coupon = event.target.coupon.value
      console.log(coupon)
    })
}
// End JustValidate - Coupon Form

// JustValidate - Order Form
const orderForm = document.querySelector('#order-form')
if (orderForm) {
  // Prevent user from entering non-numeric characters in the phone input field
  const phoneInput = orderForm.querySelector('#phone-input')
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

  const validator = new JustValidate('#order-form')

  validator
    .addField('#full-name-input', [
      {
        rule: 'required',
        errorMessage: 'Full Name is required'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Full Name must be at least 5 characters'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full Name must not exceed 50 characters'
      }
    ])
    .addField('#phone-input', [
      {
        rule: 'required',
        errorMessage: 'Phone is required'
      },
      {
        rule: 'customRegexp',
        value: /^(61|0)[2-578]\d{8}$/g,
        errorMessage: 'Phone number is invalid'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value
      const phone = event.target.phone.value
      const note = event.target.note.value
      const method = event.target.method.value

      console.log(fullName)
      console.log(phone)
      console.log(note)
      console.log(method)
    })

  // List Input Method
  const listInputMethod = orderForm.querySelectorAll(`input[name="method"]`)
  const elementInfoBank = orderForm.querySelector('.inner-info-bank')

  listInputMethod.forEach((inputMethod) => {
    inputMethod.addEventListener('change', () => {
      if (inputMethod.value === 'bank') {
        elementInfoBank.classList.add('active')
      } else {
        elementInfoBank.classList.remove('active')
      }
    })
  })
}
// End JustValidate - Order Form
