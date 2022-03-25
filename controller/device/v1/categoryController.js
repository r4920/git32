/**
 * categoryController.js
 * @description :: exports action methods for category.
 */

const { Op } = require('sequelize');
const Category = require('../../../model/category');
const categorySchemaKey = require('../../../utils/validation/categoryValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');
const deleteDependentService = require('../../../utils/deleteDependent');

/**
 * @description : create record of Category in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Category. {status, message, data}
 */ 
const addCategory = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      categorySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdCategory = await dbService.createOne(Category,dataToCreate);
    return  res.success({ data :createdCategory });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Category from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Category(s). {status, message, data}
 */
const findAllCategory = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundCategory;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      categorySchemaKey.findFilterKeys,
      Category.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundCategory = await dbService.count(Category, query);
      if (!foundCategory) {
        return res.recordNotFound();
      } 
      foundCategory = { totalRecords: foundCategory };
      return res.success({ data :foundCategory });
    }
    if (dataToFind && dataToFind.options !== undefined) {
      options = dataToFind.options;
    }
    if (options && options.select && options.select.length){
      options.attributes = options.select;
    }
    if (options && options.include && options.include.length){
      let include = [];
      options.include.forEach(i => {
        i.model = models[i.model];
        if (i.query) {
          i.where = dbService.queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    if (options && options.sort){
      options.order = dbService.sortParser(options.sort);
      delete options.sort;
    }
    foundCategory = await dbService.findMany( Category,query,options);
            
    if (!foundCategory){
      return res.recordNotFound();
    }
    return res.success({ data:foundCategory });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Category.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getCategoryCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      categorySchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedCategory = await dbService.count(Category,where);
    if (!countedCategory){
      return res.recordNotFound();
    }
    countedCategory = { totalRecords:countedCategory };
    return res.success({ data :countedCategory });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Category from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Category.
 * @return {Object} : number of deactivated documents of Category. {status, message, data}
 */
const softDeleteManyCategory = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    if (!req.params || !req.params.id){
      return res.badRequest();
    }            
    query = { id:{ [Op.in]:dataToUpdate.ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    let updatedCategory = await deleteDependentService.softDeleteCategory(query, updateBody);
    if (!updatedCategory) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Category in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Categorys. {status, message, data}
 */
const bulkInsertCategory = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdCategory = await dbService.createMany(Category,dataToCreate);
      return  res.success({ data :createdCategory });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Category with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Categorys.
 * @return {Object} : updated Categorys. {status, message, data}
 */
const bulkUpdateCategory = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedCategory = await dbService.updateMany(Category,filter,dataToUpdate);
    if (!updatedCategory){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedCategory });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Category in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyCategory = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedCategory = await deleteDependentService.countCategory(query);
      if (!countedCategory) {
        return res.recordNotFound();
      }
      return res.success({ data: countedCategory });            
    }
    let deletedCategory = await deleteDependentService.deleteCategory(query);
    if (!deletedCategory) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedCategory });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Category from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Category.
 * @return {Object} : deactivated Category. {status, message, data}
 */
const softDeleteCategory = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedCategory = await deleteDependentService.softDeleteCategory(query, updateBody);
    if (!updatedCategory){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Category with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Category.
 * @return {Object} : updated Category. {status, message, data}
 */
const partialUpdateCategory = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      categorySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedCategory = await dbService.updateMany(Category, query, dataToUpdate);
    if (!updatedCategory) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedCategory });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Category with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Category.
 * @return {Object} : updated Category. {status, message, data}
 */
const updateCategory = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }          
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      categorySchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedCategory = await dbService.updateMany(Category,query,dataToUpdate);

    return  res.success({ data :updatedCategory });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Category from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Category. {status, message, data}
 */
const getCategory = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundCategory = await dbService.findByPk(Category,id,options);
    if (!foundCategory){
      return res.recordNotFound();
    }
    return  res.success({ data :foundCategory });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Category from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Category. {status, message, data}
 */
const deleteCategory = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedCategory = await deleteDependentService.countCategory(query);
      if (!countedCategory){
        return res.recordNotFound();
      }
      return res.success({ data :countedCategory });

    } 
    let deletedCategory = await deleteDependentService.deleteCategory(query);
    if (!deletedCategory){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedCategory });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addCategory,
  findAllCategory,
  getCategoryCount,
  softDeleteManyCategory,
  bulkInsertCategory,
  bulkUpdateCategory,
  deleteManyCategory,
  softDeleteCategory,
  partialUpdateCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
