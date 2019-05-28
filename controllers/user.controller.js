const User = require('../models/user.model')

module.exports = {
  getLoginPage: (req, res) => {
    res.status(200).render('user/login', { title: 'Đăng nhập' })
  },

  getRegisterPage: (req, res) => {
    res.status(200).render('user/register', { title: 'Đăng ký tài khoản' })
  },

  registerNewUser: (req, res) => {
    const newUser = new User({
      userID: Date.now(),
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.pass1
    })

    newUser.save((err, newUser) => {
      if (err) console.log(err)
      else res.status(200).redirect('/tai-khoan/dang-nhap')
    })
  },

  clientLogin: async (req, res) => {
    let result = await User.checkPassword(req.body.email, req.body.password)
    if (result) {
      req.session.uid = result.userID
      res.redirect('/')
    } else res.redirect('/tai-khoan/dang-ky')
  },

  getProfilePage: (req, res) => {
    res.status(200).render('user/profile', { title: 'Thông tin tài khoản' })
  }
}
