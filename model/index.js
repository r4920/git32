/**
 * index.js
 * @description :: exports all the models and its relationships among other models
 */

const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

db.Chat_group = require('./Chat_group');
db.Event = require('./Event');
db.Appointment_slot = require('./Appointment_slot');
db.Appointment_schedule = require('./Appointment_schedule');
db.user = require('./user');
db.category = require('./category');
db.task = require('./task');
db.tag = require('./tag');
db.task_tag = require('./task_tag');
db.userAuthSettings = require('./userAuthSettings');
db.userToken = require('./userToken');
db.role = require('./role');
db.projectRoute = require('./projectRoute');
db.routeRole = require('./routeRole');
db.userRole = require('./userRole');

db.Appointment_schedule.belongsTo(db.Appointment_slot, {
  foreignKey: 'slot',
  as: '_slot',
  targetKey: 'id' 
});
db.Appointment_slot.hasMany(db.Appointment_schedule, {
  foreignKey: 'slot',
  sourceKey: 'id' 
});
db.Chat_group.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_group, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Chat_group.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_group, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Event.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Event, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Event.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Event, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'host',
  as: '_host',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'host',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.user.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.user, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.user.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.user, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.category.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.category, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.category.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.category, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.task.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.task, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.task.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.task, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.tag.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.tag, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.tag.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.tag, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.task_tag.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.task_tag, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.task_tag.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.task_tag, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userRole.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userRole, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.category.belongsTo(db.category, {
  foreignKey: 'parentId',
  as: '_parentId',
  targetKey: 'id' 
});
db.category.hasOne(db.category, {
  foreignKey: 'parentId',
  sourceKey: 'id' 
});
db.task.belongsTo(db.category, {
  foreignKey: 'categoryId',
  as: '_categoryId',
  targetKey: 'id' 
});
db.category.hasOne(db.task, {
  foreignKey: 'categoryId',
  sourceKey: 'id' 
});
db.task.belongsTo(db.task, {
  foreignKey: 'parentId',
  as: '_parentId',
  targetKey: 'id' 
});
db.task.hasOne(db.task, {
  foreignKey: 'parentId',
  sourceKey: 'id' 
});
db.task_tag.belongsTo(db.task, {
  foreignKey: 'taskId',
  as: '_taskId',
  targetKey: 'id' 
});
db.task.hasMany(db.task_tag, {
  foreignKey: 'taskId',
  sourceKey: 'id' 
});
db.task_tag.belongsTo(db.tag, {
  foreignKey: 'tagId',
  as: '_tagId',
  targetKey: 'id' 
});
db.tag.hasMany(db.task_tag, {
  foreignKey: 'tagId',
  sourceKey: 'id' 
});
db.routeRole.belongsTo(db.role, {
  foreignKey: 'roleId',
  as: '_roleId',
  targetKey: 'id' 
});
db.role.hasMany(db.routeRole, {
  foreignKey: 'roleId',
  sourceKey: 'id' 
});
db.userRole.belongsTo(db.role, {
  foreignKey: 'roleId',
  as: '_roleId',
  targetKey: 'id' 
});
db.role.hasMany(db.userRole, {
  foreignKey: 'roleId',
  sourceKey: 'id' 
});
db.routeRole.belongsTo(db.projectRoute, {
  foreignKey: 'routeId',
  as: '_routeId',
  targetKey: 'id' 
});
db.projectRoute.hasMany(db.routeRole, {
  foreignKey: 'routeId',
  sourceKey: 'id' 
});

module.exports = db;