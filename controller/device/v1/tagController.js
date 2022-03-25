/**
 * tagController.js
 * @description :: exports action methods for tag.
 */

const { Op } = require('sequelize');
const Tag = require('../../../model/tag');
const tagSchemaKey = require('../../../utils/validation/tagValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');
const deleteDependentService = require('../../../utils/deleteDependent');

/**
 * @description : create record of Tag in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Tag. {status, message, data}
 */ 
const addTag = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      tagSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdTag = await dbService.createOne(Tag,dataToCreate);
    return  res.success({ data :createdTag });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Tag from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Tag(s). {status, message, data}
 */
const findAllTag = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundTag;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      tagSchemaKey.findFilterKeys,
      Tag.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundTag = await dbService.count(Tag, query);
      if (!foundTag) {
        return res.recordNotFound();
      } 
      foundTag = { totalRecords: foundTag };
      return res.success({ data :foundTag });
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
    foundTag = await dbService.findMany( Tag,query,options);
            
    if (!foundTag){
      return res.recordNotFound();
    }
    return res.success({ data:foundTag });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Tag.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getTagCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      tagSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedTag = await dbService.count(Tag,where);
    if (!countedTag){
      return res.recordNotFound();
    }
    countedTag = { totalRecords:countedTag };
    return res.success({ data :countedTag });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Tag from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Tag.
 * @return {Object} : number of deactivated documents of Tag. {status, message, data}
 */
const softDeleteManyTag = async (req, res) => {
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
    let updatedTag = await deleteDependentService.softDeleteTag(query, updateBody);
    if (!updatedTag) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedTag });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Tag in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Tags. {status, message, data}
 */
const bulkInsertTag = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdTag = await dbService.createMany(Tag,dataToCreate);
      return  res.success({ data :createdTag });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Tag with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tags.
 * @return {Object} : updated Tags. {status, message, data}
 */
const bulkUpdateTag = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedTag = await dbService.updateMany(Tag,filter,dataToUpdate);
    if (!updatedTag){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedTag });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Tag in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyTag = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedTag = await deleteDependentService.countTag(query);
      if (!countedTag) {
        return res.recordNotFound();
      }
      return res.success({ data: countedTag });            
    }
    let deletedTag = await deleteDependentService.deleteTag(query);
    if (!deletedTag) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedTag });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Tag from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Tag.
 * @return {Object} : deactivated Tag. {status, message, data}
 */
const softDeleteTag = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedTag = await deleteDependentService.softDeleteTag(query, updateBody);
    if (!updatedTag){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedTag });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Tag with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tag.
 * @return {Object} : updated Tag. {status, message, data}
 */
const partialUpdateTag = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      tagSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedTag = await dbService.updateMany(Tag, query, dataToUpdate);
    if (!updatedTag) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedTag });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Tag with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tag.
 * @return {Object} : updated Tag. {status, message, data}
 */
const updateTag = async (req, res) => {
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
      tagSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedTag = await dbService.updateMany(Tag,query,dataToUpdate);

    return  res.success({ data :updatedTag });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Tag from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Tag. {status, message, data}
 */
const getTag = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundTag = await dbService.findByPk(Tag,id,options);
    if (!foundTag){
      return res.recordNotFound();
    }
    return  res.success({ data :foundTag });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Tag from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Tag. {status, message, data}
 */
const deleteTag = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedTag = await deleteDependentService.countTag(query);
      if (!countedTag){
        return res.recordNotFound();
      }
      return res.success({ data :countedTag });

    } 
    let deletedTag = await deleteDependentService.deleteTag(query);
    if (!deletedTag){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedTag });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addTag,
  findAllTag,
  getTagCount,
  softDeleteManyTag,
  bulkInsertTag,
  bulkUpdateTag,
  deleteManyTag,
  softDeleteTag,
  partialUpdateTag,
  updateTag,
  getTag,
  deleteTag,
};
