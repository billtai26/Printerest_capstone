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
    const userId = req.user.id

    const saved = await prisma.saved_images.findFirst({
      where: {
        image_id: Number(id),
        user_id: userId,
      },
    })

    return { isSaved: !!saved }
  },

  async addComment(req) {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.id

    if (!content) {
      throw new BadRequestError('Nội dung bình luận không được để trống')
    }

    return await prisma.comments.create({
      data: {
        content,
        image_id: Number(id),
        user_id: userId,
      },
    })
  },

  async createImage(req) {
    const { title, description, url } = req.body
    const userId = req.user.id

    if (!url) {
      throw new BadRequestError('Đường dẫn hình ảnh (url) là bắt buộc')
    }

    return await prisma.images.create({
      data: { title, description, url, user_id: userId },
    })
  },

  async toggleSaveImage(req) {
    const { id } = req.params
    const userId = req.user.id
    const image_id = Number(id)

    const exist = await prisma.saved_images.findFirst({
      where: { image_id, user_id: userId },
    })

    if (exist) {
      await prisma.saved_images.delete({ where: { id: exist.id } })
      return { message: 'Đã hủy lưu hình ảnh này' }
    } else {
      await prisma.saved_images.create({ data: { image_id, user_id: userId } })
      return { message: 'Đã lưu hình ảnh này thành công' }
    }
  },

  async deleteImage(req) {
    const { id } = req.params
    const userId = req.user.id 
    const image_id = Number(id)

    const image = await prisma.images.findUnique({ where: { id: image_id } })
    if (!image) {
      throw new BadRequestError('Hình ảnh không tồn tại')
    }

    if (image.user_id !== userId) {
      throw new BadRequestError(
        'Bạn không có quyền xóa hình ảnh của người khác',
      )
    }

    await prisma.images.delete({ where: { id: image_id } })
    return true
  },
}
