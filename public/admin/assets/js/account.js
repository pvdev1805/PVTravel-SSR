// JustValidate - Login Form Validation
const loginForm = document.querySelector('#login-form')
if (loginForm) {
  const validator = new JustValidate('#login-form')

  validator
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Please enter your email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Please enter your password!'
      }
    ])
    .onSuccess((event) => {
      const email = event.target.email.value
      const password = event.target.password.value
      const rememberPassword = event.target.rememberPassword.checked

      const dataFinal = {
        email: email,
        password: password,
        rememberPassword: rememberPassword
      }

      fetch(`/${pathAdmin}/account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 'error') {
            alert(data.message)
          }

          if (data.code === 'success') {
            window.location.href = `/${pathAdmin}/dashboard`
          }
        })
    })
}
// End JustValidate - Login Form Validation

// JustValidate - Register Form Validation
const registerForm = document.querySelector('#register-form')
if (registerForm) {
  const validator = new JustValidate('#register-form')

  validator
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Please enter your full name!'
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
        errorMessage: 'Please enter your email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Please enter your password!'
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
        validator: (value) => /\d/.test(value),
        errorMessage: 'Password must contain at least one digit!'
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        // validator: (value) => /\W/.test(value),
        errorMessage: 'Password must contain at least one special character!'
      }
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: 'Please agree to our terms!'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value
      const email = event.target.email.value
      const password = event.target.password.value
      const agree = event.target.agree.checked

      if (agree) {
        const dataFinal = {
          fullName: fullName,
          email: email,
          password: password
        }

        fetch(`/${pathAdmin}/account/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataFinal)
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === 'error') {
              alert(data.message)
            }

            if (data.code === 'success') {
              window.location.href = `/${pathAdmin}/account/register-initial`
            }
          })
      }
    })
}
// End JustValidate - Register Form Validation

// JustValidate - Forgot Password Form Validation
const forgotPasswordForm = document.querySelector('#forgot-password-form')
if (forgotPasswordForm) {
  const validator = new JustValidate('#forgot-password-form')

  validator
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Please enter your email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!'
      }
    ])
    .onSuccess((event) => {
      const email = event.target.email.value

      const dataFinal = {
        email: email
      }

      fetch(`/${pathAdmin}/account/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 'error') {
            alert(data.message)
          }

          if (data.code === 'success') {
            window.location.href = `/${pathAdmin}/account/otp-password?email=${email}`
          }
        })
    })
}
// End JustValidate - Forgot Password Form Validation

//JustValidate - OTP Password Form Validation
const otpPasswordForm = document.querySelector('#otp-password-form')
if (otpPasswordForm) {
  const validator = new JustValidate('#otp-password-form')

  validator
    .addField('#otp', [
      {
        rule: 'required',
        errorMessage: 'Please enter the OTP code sent to your email!'
      }
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value

      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email')

      const dataFinal = {
        email: email,
        otp: otp
      }

      fetch(`/${pathAdmin}/account/otp-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 'error') {
            alert(data.message)
          }

          if (data.code === 'success') {
            window.location.href = `/${pathAdmin}/account/reset-password`
          }
        })
    })
}
//End JustValidate - OTP Password Form Validation

// JustValidate - Reset Password Form Validation
const resetPasswordForm = document.querySelector('#reset-password-form')
if (resetPasswordForm) {
  const validator = new JustValidate('#reset-password-form')

  validator
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Please enter your new password!'
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
        validator: (value) => /\d/.test(value),
        errorMessage: 'Password must contain at least one digit!'
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        // validator: (value) => /\W/.test(value),
        errorMessage: 'Password must contain at least one special character!'
      }
    ])
    .addField('#confirm-password', [
      {
        rule: 'required',
        errorMessage: 'Please confirm your new password!'
      },
      {
        validator: (value, fields) => {
          // const password = resetPasswordForm.querySelector('#password').value
          const password = fields['#password'].elem.value
          return value === password
        },
        errorMessage: 'Confirm password does not match!'
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value

      const dataFinal = {
        password: password
      }

      fetch(`/${pathAdmin}/account/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFinal)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 'error') {
            alert(data.message)
          }

          if (data.code === 'success') {
            window.location.href = `/${pathAdmin}/dashboard`
          }
        })
    })
}
// End JustValidate - Reset Password Form Validation
