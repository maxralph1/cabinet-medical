import asyncHandler from 'express-async-handler'; 
import InventoryCategory from '../../models/inventory/InventoryCategory.js'; 
import InventoryProductCategory from '../../models/inventory/InventoryProductCategory.js'; 


/**
 * Get Inventory Categories
 */
const getInventoryCategories = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const searchQuery = req?.query?.search; 

    let inventoryCategories;

    if (searchQuery) {
        inventoryCategories = await InventoryCategory.find({ name: new RegExp(searchQuery, 'i'), deleted_at: null })
                                            .sort('-created_at')
                                            .lean();
    } else if (!searchQuery) {
        inventoryCategories = await InventoryCategory.find({ deleted_at: null })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .lean();
    }

    if (!inventoryCategories?.length) return res.status(404).json({ message: "No inventory categories found!" }); 

    const total = await InventoryCategory.countDocuments({ deleted_at: null }); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: inventoryCategories });
}); 

/**
 * Create Inventory Category
 */
const createInventoryCategory = asyncHandler(async (req, res) => {
    const { name, description } = req?.body; 

    const inventoryCategory = new InventoryCategory({
        user: req?.user_id,  
        name, 
        description 
    }); 

    inventoryCategory.save()
                    .then(() => {
                        res.status(201).json({ success: `Inventory Category ${inventoryCategory?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Get Inventory Category
 */
const getInventoryCategory = asyncHandler(async (req, res) => {
    const inventoryCategory = await InventoryCategory.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!inventoryCategory) return res.status(404).json({ message: "Inventory Category not found!" }); 

    const products = await InventoryProductCategory.find({ inventory_category: inventoryCategory?._id })
                                                    .sort('-created_at')
                                                    .populate({
                                                        path: 'inventory_product', 
                                                    })
                                                    .lean(); 

    let inventoryCategoryObj = inventoryCategory; 

    inventoryCategoryObj.products = products; 

    res.json({ data: inventoryCategoryObj }); 
}); 

/**
 * Update Inventory Category
 */
const updateInventoryCategory = asyncHandler(async (req, res) => {
    const inventoryCategory = await InventoryCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryCategory) return res.status(404).json({ message: "Inventory Category not found!" }); 

    inventoryCategory.user = req?.body?.user || inventoryCategory?.user; 
    inventoryCategory.name = req?.body?.name || inventoryCategory?.name; 
    inventoryCategory.description = req?.body?.description || inventoryCategory?.description; 

    inventoryCategory.save()
                    .then(() => {
                        res.json({ success: `Inventory Category ${inventoryCategory?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Inventory Category
 */
const deleteInventoryCategory = asyncHandler(async (req, res) => {
    const inventoryCategory = await InventoryCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryCategory) return res.status(404).json({ message: "Inventory Category not found!" }); 

    if (inventoryCategory.deleted_at == '' || inventoryCategory.deleted_at == null) {
        inventoryCategory.deleted_at = new Date().toISOString();
        inventoryCategory.deleted_by = req?.user_id;
    }

    inventoryCategory.save()
                    .then(() => {
                        res.json({ success: `Inventory Category ${inventoryCategory?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Inventory Category
 */
const restoreInventoryCategory = asyncHandler(async (req, res) => {
    const inventoryCategory = await InventoryCategory.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventoryCategory) return res.status(404).json({ message: "Inventory Category not found!" }); 

    inventoryCategory.deleted_at = null;
    inventoryCategory.deleted_by = null;

    inventoryCategory.save()
                    .then(() => {
                        res.json({ success: `Inventory Category ${inventoryCategory?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Inventory Category
 */
const destroyInventoryCategory = asyncHandler(async (req, res) => {
    const inventoryCategory = await InventoryCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryCategory) return res.status(404).json({ message: "Inventory Category not found!" }); 

    inventoryCategory.deleteOne()
                    .then(() => {
                        res.json({ success: `Inventory Category ${inventoryCategory?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getInventoryCategories, 
        createInventoryCategory, 
        getInventoryCategory, 
        updateInventoryCategory, 
        deleteInventoryCategory, 
        restoreInventoryCategory, 
        destroyInventoryCategory }; 