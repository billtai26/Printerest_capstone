import { BadRequestError } from '../common/helpers/exception.helper.js'
import { prisma } from '../common/prisma/connect.prisma.js'

export const userService = {
  // GET thông tin user cá nhân dựa vào token nhận diện
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

  // PUT thông tin cá nhân của user
  async updateProfile(req) {
    const userId = req.user.userId
    const { fullName, avatar, age } = req.body

    return await prisma.users.update({
      where: { id: userId },
      data: {
        fullName,
        avatar,
        age: age ? Number(age) : undefined,
      },
    })
  },

  // GET danh sách ảnh đã tạo theo user id
  async getCreatedImages(req) {
    const userId = req.user.userId
    return await prisma.images.findMany({
      where: { userId },
    })
  },

  // GET danh sách ảnh đã lưu theo user id
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
