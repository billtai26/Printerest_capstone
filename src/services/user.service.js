import { BadRequestError } from '../common/helpers/exception.helper.js'
import { prisma } from '../common/prisma/connect.prisma.js'

export const userService = {
  async getProfile(req) {
    const userId = req.user.userId

    const user = await prisma.users.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new BadRequestError('Người dùng không tồn tại')
    }
    return user
  },

  async updateProfile(req) {
    const userId = req.user.userId
    const { full_name, avatar, age } = req.body

    return await prisma.users.update({
      where: { id: userId },
      data: {
        full_name,
        avatar,
        age: age ? Number(age) : undefined,
      },
    })
  },

  async getCreatedImages(req) {
    const userId = req.user.userId
    return await prisma.images.findMany({
      where: { userId },
    })
  },

  async getSavedImages(req) {
    const userId = req.user.userId
    return await prisma.savedImages.findMany({
      where: { userId },
      include: {
        images: true, // Lấy kèm chi tiết thông tin của bức ảnh được lưu
      },
    })
  },
}
