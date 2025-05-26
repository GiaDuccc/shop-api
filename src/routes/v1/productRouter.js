/* eslint-disable no-unused-vars */
import express from 'express'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import cloudinary from '~/utils/cloudinary'
import { Readable } from 'stream'

const Router = express.Router()

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    // Lấy từ query thay vì body vì body chưa parse khi multer gọi destination
    const productName = req.query.productName
    const productColor = req.query.productColor

    let folderPath

    if (productColor) {
      folderPath = path.join(
        __dirname,
        '../../../allProduct',
        productName,
        `${productName}-${productColor}`
      )
    } else {
      folderPath = path.join(
        __dirname,
        '../../../allProduct',
        productName
      )
    }

    // fs.mkdirSync(folderPath, { recursive: true })

    // cb(null, folderPath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Kiểm tra mime type file xem có phải ảnh không
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true) // Chấp nhận file
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp, avif)'))
    }
  }
})

// Router.post('/uploadSingle', (req, res, next) => {
//   upload.single('file')(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({ message: 'Upload thất bại', error: err.message })
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' })
//     }

//     // Lấy productName và productColor từ query param cho đồng bộ với destination
//     const productName = req.query.productName
//     const productColor = req.query.productColor

//     const publicUrl = productColor ?
//       `/allProduct/${productName}/${productName}-${productColor}/${req.file.filename}`
//       : `/allProduct/${productName}/${req.file.filename}`

//     res.json({
//       message: 'Upload success',
//       filePath: publicUrl
//     })
//   })
// })

// Router.post('/uploadArray', (req, res, next) => {
//   upload.array('files', 6)(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({ message: 'Upload failed', error: err.message })
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'No files uploaded' })
//     }

//     const productName = req.query.productName
//     const productColor = req.query.productColor

//     const publicUrls = req.files.map(file => {
//       return `/allProduct/${productName}/${productName}-${productColor}/${file.filename}`
//     })

//     res.json({
//       message: 'Upload success',
//       filePaths: publicUrls
//     })
//   })
// })

const uploadToCloudinary = (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: filename, // không có đuôi mở rộng
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}

Router.post('/uploadSingle', upload.single('file'), async (req, res) => {
  try {
    const { productName, productColor } = req.query

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const folder = productColor
      ? `products/${productName}/${productName}-${productColor}`
      : `products/${productName}`

    const result = await uploadToCloudinary(req.file.buffer, folder, Date.now().toString())

    res.json({
      message: 'Upload thành công',
      filePath: result.secure_url
    })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi upload', error: err.message })
  }
})

Router.post('/uploadArray', upload.array('files', 6), async (req, res) => {
  try {
    const { productName, productColor } = req.query

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No files uploaded' })

    const folder = `products/${productName}/${productName}-${productColor}`

    const uploadResults = await Promise.all(
      req.files.map(file =>
        uploadToCloudinary(file.buffer, folder, `${Date.now()}-${Math.round(Math.random() * 1e5)}`)
      )
    )

    const urls = uploadResults.map(result => result.secure_url)

    res.json({
      message: 'Upload thành công',
      filePaths: urls
    })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi upload', error: err.message })
  }
})


Router.route('/')
  .get(productController.getAllProduct)
  .post(productValidation.createNew, productController.createNew)

Router.route('/sliderType')
  .get(productController.getLimitedProductsController)

Router.route('/typeAndNavbarImageFromBrand')
  .get(productController.getTypeFromNavbar)

Router.route('/filter')
  .get(productController.getAllProductPage)

Router.route('/allProductQuantity')
  .get(productController.getAllProductQuantity)

Router.route('/topBestSeller')
  .get(productController.getTopBestSeller)

Router.route('/:id')
  .get(productController.getDetails)
  .put(productValidation.updateProduct, productController.updateProduct)
Router.route('/:id/delete')
  .put(productController.deleteProduct)

Router.route('/:id/quantitySold')
  .put(productController.updateQuantitySold)


export const productRouter = Router
