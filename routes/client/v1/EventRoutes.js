/**
 * EventRoutes.js
 * @description :: CRUD API routes for Event
 */

const express = require('express');
const router = express.Router();
const EventController = require('../../../controller/client/v1/EventController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/client/api/v1/event/create').post(auth(PLATFORM.CLIENT),checkRolePermission,EventController.addEvent);
router.route('/client/api/v1/event/list').post(auth(PLATFORM.CLIENT),checkRolePermission,EventController.findAllEvent);
router.route('/client/api/v1/event/count').post(auth(PLATFORM.CLIENT),checkRolePermission,EventController.getEventCount);
router.route('/client/api/v1/event/softDeleteMany').put(auth(PLATFORM.CLIENT),checkRolePermission,EventController.softDeleteManyEvent);
router.route('/client/api/v1/event/addBulk').post(auth(PLATFORM.CLIENT),checkRolePermission,EventController.bulkInsertEvent);
router.route('/client/api/v1/event/updateBulk').put(auth(PLATFORM.CLIENT),checkRolePermission,EventController.bulkUpdateEvent);
router.route('/client/api/v1/event/deleteMany').post(auth(PLATFORM.CLIENT),checkRolePermission,EventController.deleteManyEvent);
router.route('/client/api/v1/event/softDelete/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,EventController.softDeleteEvent);
router.route('/client/api/v1/event/partial-update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,EventController.partialUpdateEvent);
router.route('/client/api/v1/event/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,EventController.updateEvent);    
router.route('/client/api/v1/event/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,EventController.getEvent);
router.route('/client/api/v1/event/delete/:id').delete(auth(PLATFORM.CLIENT),checkRolePermission,EventController.deleteEvent);

module.exports = router;
