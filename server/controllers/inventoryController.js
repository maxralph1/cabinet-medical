import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
// import slug from 'slug';
// const slugIt = slug; 
import Inventory from '../models/Inventory.js'; 


/**
 * Get Inventories
 */
const getInventories = asyncHandler (async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const inventories = await Inventory.find({ deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(); 
    if (!inventories?.length) return res.status(404).json({ message: "No inventories found!" }); 

    const total = await Inventory.countDocuments({ deleted_at: null }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: inventories 
            });
}); 

/**
 * Create Inventory
 */
const createInventory = asyncHandler(async (req, res) => {
    const { user, 
            notes, 
            product_code, 
            product_name, 
            product_description, 
            purchase_date, 
            amount_purchased, 
            manufacturer, 
            make_country, 
            manufacture_date, 
            expiration_date } = req?.body; 

    if (expiration_date < manufacture_date) return res.status(400).json({ message: "Expiration date cannot be less than manufacture date" }); 
    
    const inventory = new Inventory({
        user, 
        disbursed_by: disbursed_by ? disbursed_by : req?.user_id, 
        notes, 
        product_code, 
        product_name, 
        product_description, 
        purchase_date, 
        amount_purchased, 
        manufacturer, 
        make_country, 
        manufacture_date, 
        expiration_date
    }); 

    inventory.save()
                .then(() => {
                    res.status(201).json({ success: `Inventory ${inventory?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Get Inventory
 */ 
const getInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!inventory) return res.status(404).json({ message: "Inventory not found!" }); 

    res.json({ data: inventory }); 
}); 

/**
 * Update Inventory
 */ 
const updateInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventory) return res.status(404).json({ message: "Inventory not found!" }); 

    inventory.user = req?.body?.user || inventory?.user; 
    inventory.disbursed_on = req?.body?.disbursed_on || inventory?.disbursed_on; 
    inventory.disbursed_by = req?.body?.disbursed_by || inventory?.disbursed_by; 
    inventory.notes = req?.body?.notes || inventory?.notes; 
    inventory.product_code = req?.body?.product_code || inventory?.product_code; 
    inventory.product_name = req?.body?.product_name || inventory?.product_name; 
    inventory.product_description = req?.body?.product_description || inventory?.product_description; 
    inventory.purchase_date = req?.body?.purchase_date || inventory?.purchase_date; 
    inventory.amount_purchased = req?.body?.amount_purchased || inventory?.amount_purchased; 
    inventory.manufacturer = req?.body?.manufacturer || inventory?.manufacturer; 
    inventory.make_country = req?.body?.make_country || inventory?.make_country; 
    inventory.manufacture_date = req?.body?.manufacture_date || inventory?.manufacture_date; 
    inventory.expiration_date = req?.body?.expiration_date || inventory?.expiration_date; 

    inventory.save()
                .then(() => {
                    res.json({ success: `Inventory ${inventory?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Soft-delete Inventory
 */ 
const deleteInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventory) return res.status(404).json({ message: "Inventory not found!" }); 

    if (inventory.deleted_at == '' || inventory.deleted_at == null) {
        inventory.deleted_at = new Date().toISOString();
        inventory.deleted_by = req?.user_id;
    }

    inventory.save()
                .then(() => {
                    res.json({ success: `Inventory ${inventory?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/** 
 * Restore soft-deleted Inventory
 */ 
const restoreInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventory) return res.status(404).json({ message: "Inventory not found!" }); 

    inventory.deleted_at = null; 
    inventory.deleted_by = null; 

    inventory.save()
                .then(() => {
                    res.json({ success: `Inventory ${inventory?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Inventory
 */ 
const destroyInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventory) return res.status(404).json({ message: "Inventory not found!" }); 

    inventory.remove()
                .then(() => {
                    res.json({ success: `Inventory ${inventory?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 


export { getInventories, 
        createInventory, 
        getInventory, 
        updateInventory, 
        deleteInventory, 
        restoreInventory, 
        destroyInventory };