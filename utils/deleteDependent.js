/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Chat_group = require('../model/Chat_group');
let Event = require('../model/Event');
let Appointment_slot = require('../model/Appointment_slot');
let Appointment_schedule = require('../model/Appointment_schedule');
let User = require('../model/user');
let Category = require('../model/category');
let Task = require('../model/task');
let Tag = require('../model/tag');
let Task_tag = require('../model/task_tag');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');
const { Op } = require('sequelize');

const deleteChat_group = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Chat_group,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEvent = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Event,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_slot = async (filter) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);

      const Appointment_scheduleFilter = { [Op.or]: [{ slot : { [Op.in] : appointment_slot } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);

      let response  = await dbService.deleteMany(Appointment_slot,filter);
      return response;

    } else {
      return 'No Appointment_slot found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_schedule = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Appointment_schedule,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const Chat_groupFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Chat_group,Chat_groupFilter);

      const EventFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Event,EventFilter);

      const Appointment_slotFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Appointment_slot,Appointment_slotFilter);

      const Appointment_scheduleFilter = { [Op.or]: [{ host : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(User,userFilter);

      const categoryFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Category,categoryFilter);

      const taskFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Task,taskFilter);

      const tagFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Tag,tagFilter);

      const task_tagFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Task_tag,task_tagFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(User,filter);
      return response;

    } else {
      return 'No user found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCategory = async (filter) =>{
  try {
    let category = await Category.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (category && category.length){
      category = category.map((obj) => obj.id);

      const categoryFilter = { [Op.or]: [{ parentId : { [Op.in] : category } }] };
      await dbService.deleteMany(Category,categoryFilter);

      const taskFilter = { [Op.or]: [{ categoryId : { [Op.in] : category } }] };
      await dbService.deleteMany(Task,taskFilter);

      let response  = await dbService.deleteMany(Category,filter);
      return response;

    } else {
      return 'No category found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTask = async (filter) =>{
  try {
    let task = await Task.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (task && task.length){
      task = task.map((obj) => obj.id);

      const taskFilter = { [Op.or]: [{ parentId : { [Op.in] : task } }] };
      await dbService.deleteMany(Task,taskFilter);

      const task_tagFilter = { [Op.or]: [{ taskId : { [Op.in] : task } }] };
      await dbService.deleteMany(Task_tag,task_tagFilter);

      let response  = await dbService.deleteMany(Task,filter);
      return response;

    } else {
      return 'No task found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTag = async (filter) =>{
  try {
    let tag = await Tag.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (tag && tag.length){
      tag = tag.map((obj) => obj.id);

      const task_tagFilter = { [Op.or]: [{ tagId : { [Op.in] : tag } }] };
      await dbService.deleteMany(Task_tag,task_tagFilter);

      let response  = await dbService.deleteMany(Tag,filter);
      return response;

    } else {
      return 'No tag found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTask_tag = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Task_tag,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserAuthSettings,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserToken,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(Role,filter);
      return response;

    } else {
      return 'No role found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      let response  = await dbService.deleteMany(ProjectRoute,filter);
      return response;

    } else {
      return 'No projectRoute found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countChat_group = async (filter) =>{
  try {
    const Chat_groupCnt =  await Chat_group.count(filter);
    return { Chat_group : Chat_groupCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countEvent = async (filter) =>{
  try {
    const EventCnt =  await Event.count(filter);
    return { Event : EventCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_slot = async (filter) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);

      const Appointment_scheduleFilter = { [Op.or]: [{ slot : { [Op.in] : appointment_slot } }] };
      const Appointment_scheduleCnt =  await dbService.count(Appointment_schedule,Appointment_scheduleFilter);

      let response = { Appointment_schedule : Appointment_scheduleCnt, };
      return response; 
    } else {
      return {  appointment_slot : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_schedule = async (filter) =>{
  try {
    const Appointment_scheduleCnt =  await Appointment_schedule.count(filter);
    return { Appointment_schedule : Appointment_scheduleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const Chat_groupFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Chat_groupCnt =  await dbService.count(Chat_group,Chat_groupFilter);

      const EventFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const EventCnt =  await dbService.count(Event,EventFilter);

      const Appointment_slotFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Appointment_slotCnt =  await dbService.count(Appointment_slot,Appointment_slotFilter);

      const Appointment_scheduleFilter = { [Op.or]: [{ host : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Appointment_scheduleCnt =  await dbService.count(Appointment_schedule,Appointment_scheduleFilter);

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const categoryFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const categoryCnt =  await dbService.count(Category,categoryFilter);

      const taskFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const taskCnt =  await dbService.count(Task,taskFilter);

      const tagFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const tagCnt =  await dbService.count(Tag,tagFilter);

      const task_tagFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const task_tagCnt =  await dbService.count(Task_tag,task_tagFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userAuthSettingsCnt =  await dbService.count(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userTokenCnt =  await dbService.count(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        Chat_group : Chat_groupCnt,
        Event : EventCnt,
        Appointment_slot : Appointment_slotCnt,
        Appointment_schedule : Appointment_scheduleCnt,
        user : userCnt,
        category : categoryCnt,
        task : taskCnt,
        tag : tagCnt,
        task_tag : task_tagCnt,
        userAuthSettings : userAuthSettingsCnt,
        userToken : userTokenCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countCategory = async (filter) =>{
  try {
    let category = await Category.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (category && category.length){
      category = category.map((obj) => obj.id);

      const categoryFilter = { [Op.or]: [{ parentId : { [Op.in] : category } }] };
      const categoryCnt =  await dbService.count(Category,categoryFilter);

      const taskFilter = { [Op.or]: [{ categoryId : { [Op.in] : category } }] };
      const taskCnt =  await dbService.count(Task,taskFilter);

      let response = {
        category : categoryCnt,
        task : taskCnt,
      };
      return response; 
    } else {
      return {  category : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countTask = async (filter) =>{
  try {
    let task = await Task.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (task && task.length){
      task = task.map((obj) => obj.id);

      const taskFilter = { [Op.or]: [{ parentId : { [Op.in] : task } }] };
      const taskCnt =  await dbService.count(Task,taskFilter);

      const task_tagFilter = { [Op.or]: [{ taskId : { [Op.in] : task } }] };
      const task_tagCnt =  await dbService.count(Task_tag,task_tagFilter);

      let response = {
        task : taskCnt,
        task_tag : task_tagCnt,
      };
      return response; 
    } else {
      return {  task : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countTag = async (filter) =>{
  try {
    let tag = await Tag.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (tag && tag.length){
      tag = tag.map((obj) => obj.id);

      const task_tagFilter = { [Op.or]: [{ tagId : { [Op.in] : tag } }] };
      const task_tagCnt =  await dbService.count(Task_tag,task_tagFilter);

      let response = { task_tag : task_tagCnt, };
      return response; 
    } else {
      return {  tag : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countTask_tag = async (filter) =>{
  try {
    const task_tagCnt =  await Task_tag.count(filter);
    return { task_tag : task_tagCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteChat_group = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Chat_group.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEvent = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Event.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_slot = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);
      const Appointment_scheduleFilter2952 = { 'slot': { [Op.in]: appointment_slot } };
      const Appointment_schedule2646 = await softDeleteAppointment_schedule(Appointment_scheduleFilter2952,updateBody);
      return await Appointment_slot.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No Appointment_slot found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_schedule = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Appointment_schedule.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const Chat_groupFilter1826 = { 'updatedBy': { [Op.in]: user } };
      const Chat_group5944 = await softDeleteChat_group(Chat_groupFilter1826,updateBody);
      const Chat_groupFilter4517 = { 'addedBy': { [Op.in]: user } };
      const Chat_group5195 = await softDeleteChat_group(Chat_groupFilter4517,updateBody);
      const EventFilter4617 = { 'updatedBy': { [Op.in]: user } };
      const Event1707 = await softDeleteEvent(EventFilter4617,updateBody);
      const EventFilter5452 = { 'addedBy': { [Op.in]: user } };
      const Event2856 = await softDeleteEvent(EventFilter5452,updateBody);
      const Appointment_slotFilter5718 = { 'userId': { [Op.in]: user } };
      const Appointment_slot8832 = await softDeleteAppointment_slot(Appointment_slotFilter5718,updateBody);
      const Appointment_slotFilter2846 = { 'updatedBy': { [Op.in]: user } };
      const Appointment_slot4345 = await softDeleteAppointment_slot(Appointment_slotFilter2846,updateBody);
      const Appointment_slotFilter9376 = { 'addedBy': { [Op.in]: user } };
      const Appointment_slot8333 = await softDeleteAppointment_slot(Appointment_slotFilter9376,updateBody);
      const Appointment_scheduleFilter8268 = { 'host': { [Op.in]: user } };
      const Appointment_schedule9696 = await softDeleteAppointment_schedule(Appointment_scheduleFilter8268,updateBody);
      const Appointment_scheduleFilter6196 = { 'updatedBy': { [Op.in]: user } };
      const Appointment_schedule6225 = await softDeleteAppointment_schedule(Appointment_scheduleFilter6196,updateBody);
      const Appointment_scheduleFilter7129 = { 'addedBy': { [Op.in]: user } };
      const Appointment_schedule2470 = await softDeleteAppointment_schedule(Appointment_scheduleFilter7129,updateBody);
      const userFilter7850 = { 'addedBy': { [Op.in]: user } };
      const user8536 = await softDeleteUser(userFilter7850,updateBody);
      const userFilter4495 = { 'updatedBy': { [Op.in]: user } };
      const user0183 = await softDeleteUser(userFilter4495,updateBody);
      const categoryFilter9377 = { 'addedBy': { [Op.in]: user } };
      const category6942 = await softDeleteCategory(categoryFilter9377,updateBody);
      const categoryFilter3373 = { 'updatedBy': { [Op.in]: user } };
      const category8340 = await softDeleteCategory(categoryFilter3373,updateBody);
      const taskFilter5298 = { 'addedBy': { [Op.in]: user } };
      const task6328 = await softDeleteTask(taskFilter5298,updateBody);
      const taskFilter4992 = { 'updatedBy': { [Op.in]: user } };
      const task7077 = await softDeleteTask(taskFilter4992,updateBody);
      const tagFilter8889 = { 'addedBy': { [Op.in]: user } };
      const tag4660 = await softDeleteTag(tagFilter8889,updateBody);
      const tagFilter5427 = { 'updatedBy': { [Op.in]: user } };
      const tag4676 = await softDeleteTag(tagFilter5427,updateBody);
      const task_tagFilter6577 = { 'addedBy': { [Op.in]: user } };
      const task_tag2588 = await softDeleteTask_tag(task_tagFilter6577,updateBody);
      const task_tagFilter3451 = { 'updatedBy': { [Op.in]: user } };
      const task_tag7454 = await softDeleteTask_tag(task_tagFilter3451,updateBody);
      const userAuthSettingsFilter1793 = { 'userId': { [Op.in]: user } };
      const userAuthSettings4137 = await softDeleteUserAuthSettings(userAuthSettingsFilter1793,updateBody);
      const userAuthSettingsFilter4885 = { 'addedBy': { [Op.in]: user } };
      const userAuthSettings2352 = await softDeleteUserAuthSettings(userAuthSettingsFilter4885,updateBody);
      const userAuthSettingsFilter1450 = { 'updatedBy': { [Op.in]: user } };
      const userAuthSettings8251 = await softDeleteUserAuthSettings(userAuthSettingsFilter1450,updateBody);
      const userTokenFilter4835 = { 'userId': { [Op.in]: user } };
      const userToken3185 = await softDeleteUserToken(userTokenFilter4835,updateBody);
      const userTokenFilter4393 = { 'addedBy': { [Op.in]: user } };
      const userToken7399 = await softDeleteUserToken(userTokenFilter4393,updateBody);
      const userTokenFilter3130 = { 'updatedBy': { [Op.in]: user } };
      const userToken7441 = await softDeleteUserToken(userTokenFilter3130,updateBody);
      const userRoleFilter8324 = { 'userId': { [Op.in]: user } };
      const userRole4128 = await softDeleteUserRole(userRoleFilter8324,updateBody);
      return await User.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCategory = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let category = await Category.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (category && category.length){
      category = category.map((obj) => obj.id);
      const categoryFilter0890 = { 'parentId': { [Op.in]: category } };
      const category3622 = await softDeleteCategory(categoryFilter0890,updateBody);
      const taskFilter4435 = { 'categoryId': { [Op.in]: category } };
      const task5760 = await softDeleteTask(taskFilter4435,updateBody);
      return await Category.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No category found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTask = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let task = await Task.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (task && task.length){
      task = task.map((obj) => obj.id);
      const taskFilter2958 = { 'parentId': { [Op.in]: task } };
      const task8199 = await softDeleteTask(taskFilter2958,updateBody);
      const task_tagFilter3904 = { 'taskId': { [Op.in]: task } };
      const task_tag5447 = await softDeleteTask_tag(task_tagFilter3904,updateBody);
      return await Task.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No task found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTag = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let tag = await Tag.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (tag && tag.length){
      tag = tag.map((obj) => obj.id);
      const task_tagFilter2131 = { 'tagId': { [Op.in]: tag } };
      const task_tag5565 = await softDeleteTask_tag(task_tagFilter2131,updateBody);
      return await Tag.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No tag found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTask_tag = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Task_tag.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserAuthSettings.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserToken.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter7249 = { 'roleId': { [Op.in]: role } };
      const routeRole5741 = await softDeleteRouteRole(routeRoleFilter7249,updateBody);
      const userRoleFilter8564 = { 'roleId': { [Op.in]: role } };
      const userRole2322 = await softDeleteUserRole(userRoleFilter8564,updateBody);
      return await Role.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter6219 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9196 = await softDeleteRouteRole(routeRoleFilter6219,updateBody);
      return await ProjectRoute.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteChat_group,
  deleteEvent,
  deleteAppointment_slot,
  deleteAppointment_schedule,
  deleteUser,
  deleteCategory,
  deleteTask,
  deleteTag,
  deleteTask_tag,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countChat_group,
  countEvent,
  countAppointment_slot,
  countAppointment_schedule,
  countUser,
  countCategory,
  countTask,
  countTag,
  countTask_tag,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteChat_group,
  softDeleteEvent,
  softDeleteAppointment_slot,
  softDeleteAppointment_schedule,
  softDeleteUser,
  softDeleteCategory,
  softDeleteTask,
  softDeleteTag,
  softDeleteTask_tag,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
