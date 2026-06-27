import { BadRequestError } from '../common/helpers/exception.helper.js'
import { prisma } from '../common/prisma/connect.prisma.js'

export const imageService = {
  async getAllImages(req) {
    const { search } = req.query

    return await prisma.images.findMany({
      where: search ? { title: { contains: search } } : {},
      include: {
        users: {
          select: { id: true, full_name: true, avatar: true },
        },
      },
    })
  },

  async getImageDetail(req) {
    const { id } = req.params
    const image = await prisma.images.findUnique({
      where: { id: Number(id) },
      include: {
        users: {
          select: { id: true, full_name: true, avatar: true },
        },
      },
    })

    if (!image) {
      throw new BadRequestError('Không tìm thấy hình ảnh yêu cầu')
    }
    return image
  },

  async getCommentsByImage(req) {
    const { id } = req.params
    return await prisma.comments.findMany({
      where: { image_id: Number(id) },
      include: {
        users: {
          select: { id: true, full_name: true, avatar: true },
        },
      },
      orderBy: { created_at: 'desc' },
    })
  },

  async checkImageSaved(req) {
    const { id } = req.params
    const userId = req.user.userId // Lấy từ token đã qua middleware protect

    const saved = await prisma.savedImages.findFirst({
      where: {
        image_id: Number(id),
        userId: userId,
      },
    })

    return { isSaved: !!saved }
  },

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
        image_id: Number(id),
        userId: userId,
      },
    })
  },

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

  async toggleSaveImage(req) {
    const { id } = req.params
    const userId = req.user.userId
    const image_id = Number(id)

    const exist = await prisma.savedImages.findFirst({
      where: { image_id, userId },
    })

    if (exist) {
      await prisma.savedImages.delete({ where: { id: exist.id } })
      return { message: 'Đã hủy lưu hình ảnh này' }
    } else {
      await prisma.savedImages.create({ data: { image_id, userId } })
      return { message: 'Đã lưu hình ảnh này thành công' }
    }
  },

  async deleteImage(req) {
    const { id } = req.params
    const userId = req.user.userId
    const image_id = Number(id)

    const image = await prisma.images.findUnique({ where: { id: image_id } })
    if (!image) {
      throw new BadRequestError('Hình ảnh không tồn tại')
    }

    if (image.userId !== userId) {
      throw new BadRequestError(
        'Bạn không có quyền xóa hình ảnh của người khác',
      )
    }

    await prisma.images.delete({ where: { id: image_id } })
    return true
  },
}
