const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail, validatePermissionDetail } = require('../models/PermissionDetail')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const permissions = await Permission.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ status: 200, data: permissions })
})

router.post('/', [validatePermission], async (req, res) => {
  try {
    const permission = await Permission.create(req.body)
    return res.json({ status: 201, data: permission })
  }
  catch(err) {
    console.log(err)
    return res.json({ 
      status: 400, 
      message: (err.parent) ? err.parent.sqlMessage : err.message 
    })
  }
})

router.post('/details', [validatePermissionDetail], async (req, res) => {
  try {
    const permissionDetail = await PermissionDetail.create(req.body)
    return res.json({ status: 201, data: permissionDetail })
  }
  catch(err) {
    console.log(err)
    return res.json({ 
      status: 400, 
      message: (err.parent) ? err.parent.sqlMessage : err.message 
    })
  }
})

module.exports = router