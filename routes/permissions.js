const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail, validatePermissionDetail } = require('../models/PermissionDetail')
const sequelize = require('../db/connection')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const permissions = await Permission.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ status: 200, data: permissions })
})

router.post('/', [validatePermission], async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const permission = await Permission.create(req.body, { transaction: transaction })
    await addDetails(permission.id, transaction)

    await transaction.commit()
    return res.json({ status: 201, data: permission })
  }
  catch(err) {
    console.log(err)

    await transaction.rollback()
    return res.json({ 
      status: 400,
      message: (err.parent) ? err.parent.sqlMessage : err.message 
    })
  }
})

router.post('/details', [validatePermissionDetail], async (req, res) => {
  try {
    const permissionDetails = await PermissionDetail.create(req.body)
    return res.json({ status: 201, data: permissionDetails })
  }
  catch(err) {
    console.log(err)
    return res.json({ 
      status: 400, 
      message: (err.parent) ? err.parent.sqlMessage : err.message 
    })
  }
})

async function addDetails(perId, transaction) {
  const actionNames = [
    'CREATE_ORDER',
    'CREATE_USER',
    'VIEW_ORDER',
    'VIEW_USER',
    'EDIT_ORDER',
    'DELETE_ORDER',
    'DELETE_USER'
  ]
  for (const action of actionNames) {
    await PermissionDetail.create(await createDetail(perId, action), { transaction: transaction })
  }
}

async function createDetail(permissionId, actionName) {
  const detailObj = {
    permissionId: permissionId,
    actionCode: actionName.split('_')[0],
    actionName: actionName,
    checkAction: 0
  }
  // create permission detail
  return detailObj
}

module.exports = router