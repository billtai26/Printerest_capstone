import { BadRequestError } from '../common/helpers/exception.helper.js'
import { prisma } from '../common/prisma/connect.prisma.js'

export const imageService = {
  // GET danh sách ảnh HOẶC tìm kiếm danh sách ảnh theo tên
  async getAllImages(req) {
    const { search } = req.query

    return await prisma.images.findMany({
      where: search ? { title: { contains: search } } : {},
      include: {
        users: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    })
  },

  // GET thông tin ảnh và người tạo ảnh bằng id ảnh
  async getImageDetail(req) {
    const { id } = req.params
    const image = await prisma.images.findUnique({
      where: { id: Number(id) },
      include: {
        users: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    })

    if (!image) {
      throw new BadRequestError('Không tìm thấy hình ảnh yêu cầu')
    }
    return image
  },

  // GET thông tin bình luận theo id ảnh
  async getCommentsByImage(req) {
    const { id } = req.params
    return await prisma.comments.findMany({
      where: { imageId: Number(id) },
      include: {
        users: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // GET thông tin đã lưu hình này chưa theo id ảnh
  async checkImageSaved(req) {
    const { id } = req.params
    const userId = req.user.userId // Lấy từ token đã qua middleware protect

    const saved = await prisma.savedImages.findFirst({
      where: {
        imageId: Number(id),
        userId: userId,
      },
    })

    return { isSaved: !!saved }
  },

  // POST để lưu thông tin bình luận của người dùng với hình ảnh
  async addComment(req) {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.userId

    if (!content) {
      throw new BadRequestError('Nội dung bình luận không được để trống')
    }

    return await prisma.comments.create({
      data: {
        content,
        imageId: Number(id),
        userId: userId,
      },
    })
  },

  // POST thêm một ảnh của user
  async createImage(req) {
    const { title, description, url } = req.body
    const userId = req.user.userId

    if (!url) {
      throw new BadRequestError('Đường dẫn hình ảnh (url) là bắt buộc')
    }

    return await prisma.images.create({
      data: { title, description, url, userId },
    })
  },

  // POST / POST toggle để lưu ảnh hoặc bỏ lưu ảnh (Tính năng mở rộng cho nút Save)
  async toggleSaveImage(req) {
    const { id } = req.params
    const userId = req.user.userId
    const imageId = Number(id)

    const exist = await prisma.savedImages.findFirst({
      where: { imageId, userId },
    })

    if (exist) {
      await prisma.savedImages.delete({ where: { id: exist.id } })
      return { message: 'Đã hủy lưu hình ảnh này' }
    } else {
      await prisma.savedImages.create({ data: { imageId, userId } })
      return { message: 'Đã lưu hình ảnh này thành công' }
    }
  },

  // DELETE xóa ảnh đã tạo theo id ảnh
  async deleteImage(req) {
    const { id } = req.params
    const userId = req.user.userId
    const imageId = Number(id)

    const image = await prisma.images.findUnique({ where: { id: imageId } })
    if (!image) {
      throw new BadRequestError('Hình ảnh không tồn tại')
    }

    if (image.userId !== userId) {
      throw new BadRequestError(
        'Bạn không có quyền xóa hình ảnh của người khác',
      )
    }

    await prisma.images.delete({ where: { id: imageId } })
    return true
  },
}
