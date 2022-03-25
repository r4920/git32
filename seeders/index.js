/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */
const model = require('../model');
const dbService = require('../utils/dbService');
const bcrypt = require('bcrypt');
const authConstant = require('../constants/authConstant');
const { replaceAll } = require('../utils/common');
const { Op } = require('sequelize');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = await dbService.findOne(model.user,{ 'username':'Neva.Parisian' });
    if (!userToBeInserted) {  
      userToBeInserted = {
        'password':'Tv13D1DJPuuIiDl',
        'username':'Neva.Parisian',
        'isDeleted':false,
        'isActive':true,
        'userType':authConstant.USER_TYPES.User
      };
      await dbService.createOne(model.user,userToBeInserted);
    } else {
      userToBeInserted = {
        'password':'Tv13D1DJPuuIiDl',
        'username':'Neva.Parisian',
        'isDeleted':false,
        'isActive':true,
        'userType':authConstant.USER_TYPES.User
      };
      userToBeInserted.password = await bcrypt.hash(userToBeInserted.password, 8);
      await dbService.updateByQuery(model.user, { 'username':'Neva.Parisian' }, userToBeInserted);
    }
    console.info('User model seeded 🍺');
  } catch (error){
    console.log('User seeder failed due to ', error.message);
  }
}
  
/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'User', 'System_User' ];
    const insertedRoles = await dbService.findAllRecords(model.role, { code: { [Op.in]: roles.map(role => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach(role => {
      if (!insertedRoles.find(insertedRole => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.createMany(model.role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is upto date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes) {
      let routeName = '';
      const dbRoutes = await dbService.findAllRecords(model.projectRoute, {});
      let routeArr = [];
      let routeObj = {};
      routes.forEach(route => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach(method => {
          routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              'uri': route.path.toLowerCase(),
              'method': method,
              'route_name': routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.createMany(model.projectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/category/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/category/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/category/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/category/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/category/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/category/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/category/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/category/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/category/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/category/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/category/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/category/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tag/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tag/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tag/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tag/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/tag/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tag/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tag/partial-update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tag/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tag/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tag/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tag/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/tag/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/task/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/task/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/task/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task_tag/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task_tag/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task_tag/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task_tag/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/task_tag/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/task_tag/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task_tag/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/task_tag/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/task_tag/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/task_tag/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/task_tag/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/task_tag/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/user/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/category/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/category/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/category/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/category/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/category/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/category/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/category/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/category/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tag/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tag/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tag/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/tag/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/tag/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tag/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/device/api/v1/tag/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/device/api/v1/tag/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tag/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tag/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tag/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tag/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/task/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/task/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/task/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/task/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/task/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/task/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/task/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/task/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/task_tag/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/task_tag/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/task_tag/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/task_tag/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/task_tag/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/task_tag/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/task_tag/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/chat_group/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/chat_group/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/chat_group/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/chat_group/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/chat_group/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/chat_group/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/chat_group/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/chat_group/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/chat_group/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/chat_group/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/chat_group/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/chat_group/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/event/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/event/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/event/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/event/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/event/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/event/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/event/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/event/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/event/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/event/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/event/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/event/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_slot/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_slot/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_slot/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_slot/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/appointment_slot/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_slot/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_slot/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_slot/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_slot/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_slot/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_slot/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/appointment_slot/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_schedule/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_schedule/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_schedule/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_schedule/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/appointment_schedule/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/appointment_schedule/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_schedule/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_schedule/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_schedule/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_schedule/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/appointment_schedule/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/appointment_schedule/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userauthsettings/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userauthsettings/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/usertoken/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertoken/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/role/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userrole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/chat_group/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/chat_group/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/chat_group/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/chat_group/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/chat_group/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/chat_group/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/chat_group/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/chat_group/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/chat_group/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/chat_group/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/chat_group/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/chat_group/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/event/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/event/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/event/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/event/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/event/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/event/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/event/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/event/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/event/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/event/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/event/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/event/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_slot/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_slot/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_slot/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_slot/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/appointment_slot/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_slot/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_slot/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_slot/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_slot/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_slot/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_slot/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/appointment_slot/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_schedule/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_schedule/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_schedule/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_schedule/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/appointment_schedule/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/appointment_schedule/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_schedule/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_schedule/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_schedule/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_schedule/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/appointment_schedule/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/appointment_schedule/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/user/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/category/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/category/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/category/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/category/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/category/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/category/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/category/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/category/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/category/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/category/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/category/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/category/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/task/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/task/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/tag/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/tag/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/tag/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/tag/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/tag/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/tag/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/tag/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/tag/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/tag/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/tag/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/tag/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/tag/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task_tag/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task_tag/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task_tag/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task_tag/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/task_tag/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/task_tag/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task_tag/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task_tag/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task_tag/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task_tag/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/task_tag/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/task_tag/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userauthsettings/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userauthsettings/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userauthsettings/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userauthsettings/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/userauthsettings/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userauthsettings/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userauthsettings/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userauthsettings/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userauthsettings/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userauthsettings/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userauthsettings/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/userauthsettings/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertoken/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertoken/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertoken/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertoken/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/usertoken/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertoken/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertoken/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertoken/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertoken/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertoken/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertoken/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/usertoken/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/role/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/userrole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map(routeRole => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map(routeRole => routeRole.method))];
      const roles = [ 'User', 'System_User' ];
      const insertedProjectRoute = await dbService.findAllRecords(model.projectRoute, {
        uri: { [Op.in]: routes },
        method: { [Op.in]: routeMethods },
        'isActive': true,
        'isDeleted': false
      });
      const insertedRoles = await dbService.findAllRecords(model.role, {
        code: { [Op.in]: roles.map(role => role.toUpperCase()) },
        'isActive': true,
        'isDeleted': false
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map(routeRole => {
        projectRouteId = insertedProjectRoute.find(pr => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find(r => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};
    
      await Promise.all(
        createRouteRoles.map(async routeRole => {
          routeRoleObj = await dbService.findOne(model.routeRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        })
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.createMany(model.routeRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    const userRoles = [{
      'username':'Neva.Parisian',
      'password':'Tv13D1DJPuuIiDl'
    }];
    const defaultRole = await dbService.findOne(model.role, { code: 'SYSTEM_USER' });
    const insertedUsers = await dbService.findAllRecords(model.user, { username: { [Op.in]: userRoles.map(userRole => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map(userRole => {
      user = insertedUsers.find(user => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user) {
        userRolesArr.push({
          userId: user.id,
          roleId: defaultRole.id
        });
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async userRole => {
          userRoleObj = await dbService.findOne(model.userRole, {
            userId: userRole.userId,
            roleId: userRole.roleId
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId
            });
          }
        })
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.createMany(model.userRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('UserRole seeder failed due to ', error.message);
  }
}

/* calls of functions to seed mock data into multiple collections */
async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();
};
module.exports = seedData;