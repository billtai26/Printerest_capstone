import { BadRequestError } from '../common/helpers/exception.helper.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../common/helpers/jwt.helper.js'
import { prisma } from '../common/prisma/connect.prisma.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const authService = {
  async login(req) {
    const { email, password } = req.body

    const existingUser = await prisma.users.findUnique({
      where: { email: email },
      omit: { password: false },
    })

    if (!existingUser) {
      throw new BadRequestError(`Người dùng không tồn tại, vui lòng đăng ký`)
    }

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password)

    if (!isPasswordValid) {
      throw new BadRequestError(
        `Thông tin người dùng không đúng, vui lòng kiểm tra lại thông tin đăng nhập`,
      )
    }

    const payload = {
      userId: existingUser.id,
      email: existingUser.email,
    }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    return {
      accessToken,
      refreshToken,
      user: {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
      },
    }
  },

  async register(req) {
    const { email, password, fullName } = req.body

    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    })

    if (existingUser) {
      throw new BadRequestError(`Người dùng đã tồn tại, vui lòng đăng nhập`)
    }

    const hashPassword = bcrypt.hashSync(password, 10)

    const newUser = await prisma.users.create({
      data: {
        email: email,
        password: hashPassword,
        fullName: fullName,
      },
    })

    return true
  },

  async forgotPassword(req) {
    const { email } = req.body
    const existingUser = await prisma.users.findUnique({
      where: { email: email },
      omit: { codeChangePass: false },
    })

    if (!existingUser) {
      throw new BadRequestError('Email không tồn tại trong hệ thống')
    }

    const changePassCode = crypto.randomBytes(20).toString('hex')

    await prisma.users.update({
      where: { email: email },
      data: { codeChangePass: changePassCode },
    })

    return changePassCode
  },

  async getInfo(req) {
    return req.user
  },

  async refreshToken(req) {
    const { refreshToken } = req.cookies
    const accessToken = req.accessToken || req.cookies.accessToken

    if (!refreshToken) {
      throw new BadRequestError(
        'Refresh token không tồn tại, vui lòng đăng nhập lại',
      )
    }

    if (!accessToken) {
      throw new BadRequestError(
        'Access token không tồn tại, vui lòng đăng nhập lại',
      )
    }

    const decodedAccessToken = verifyAccessToken(accessToken, {
      ignoreExpiration: true,
    })
    const decodedRefreshToken = verifyRefreshToken(refreshToken)

    if (decodedAccessToken.userId !== decodedRefreshToken.userId) {
      throw new BadRequestError('Token không hợp lệ, vui lòng đăng nhập lại')
    }

    const userExist = await prisma.users.findUnique({
      where: { id: decodedAccessToken.userId },
    })

    const payload = {
      userId: userExist.id,
      email: userExist.email,
    }

    const accessTokenNew = signAccessToken(payload)

    return {
      accessToken: accessTokenNew,
      refreshToken: refreshToken,
    }
  },
}
