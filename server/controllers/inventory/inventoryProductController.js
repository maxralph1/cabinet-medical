import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import InventoryProduct from '../../models/inventory/InventoryProduct.js'; 
import InventoryProductUnit from '../../models/inventory/InventoryProductUnit.js'; 
import InventoryProductCategory from '../../models/inventory/InventoryProductCategory.js'; 


/**
 * Get Inventory Products
 */
const getInventoryProducts = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const inventoryProducts = await InventoryProduct.find({ deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean();

    if (!inventoryProducts?.length) return res.status(404).json({ message: "No inventory products found!" }); 

    const total = await InventoryProduct.countDocuments({ deleted_at: null }); 

    let inventoryProductList = []; 

    const updateInventoryProductPromises = inventoryProducts?.map(async inventoryProductItem => { 
        let foundInventoryProductUnits = await InventoryProductUnit.find({ inventory_product: inventoryProductItem?._id })
                                                                    .populate({
                                                                        path: 'user',
                                                                        select: 'first_name last_name username'
                                                                    })
                                                                    .populate({
                                                                        path: 'issued_to',
                                                                        select: 'first_name last_name username'
                                                                    })
                                                                    .populate({
                                                                        path: 'disbursed_by',
                                                                        select: 'first_name last_name username'
                                                                    })
                                                                    .populate({
                                                                        path: 'inventory_product', 
                                                                    })
                                                                    .lean()

        inventoryProductItem['product_units'] = foundInventoryProductUnits; 

        inventoryProductList.push(inventoryProductItem); 
    }); 

    await Promise.all(updateInventoryProductPromises); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: inventoryProductList });
}); 

/**
 * Create Inventory Product
 */
const createInventoryProduct = asyncHandler(async (req, res) => {
    const { name, 
            description, 
            notes, 
            amount_purchased, 
            manufacturer, 
            make_country } = req?.body; 

    let inventoryProductImageUpload = {};
    if (!req?.files?.image) {
        inventoryProductImageUpload.public_id = ''
        inventoryProductImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        inventoryProductImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_inventory_product_images"); 
        if (!inventoryProductImageUpload) return res.status(400).json({ message: "Image upload failed" }); 
    }; 

    const inventoryProduct = new InventoryProduct({
        image_path: { 
            public_id: inventoryProductImageUpload.public_id,
            url: inventoryProductImageUpload.secure_url
        }, 
        user: req?.user_id,  
        name, 
        description, 
        notes, 
        amount_purchased, 
        manufacturer, 
        make_country
    }); 

    inventoryProduct.save()
                    .then(() => {
                        res.status(201).json({ success: `Inventory Product ${inventoryProduct?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Get Inventory Product
 */
const getInventoryProduct = asyncHandler(async (req, res) => {
    const inventoryProduct = await InventoryProduct.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!inventoryProduct) return res.status(404).json({ message: "Inventory Product not found!" }); 

    const categories = await InventoryProductCategory.find({ inventory_product: inventoryProduct?._id })
                                                    .sort('-created_at')
                                                    .populate({
                                                        path: 'inventory_category', 
                                                    })
                                                    .lean(); 

    const product_units = await InventoryProductUnit.find({ inventory_product: inventoryProduct?._id })
                                                    .sort('-created_at')
                                                    .populate({
                                                        path: 'user',
                                                        select: 'first_name last_name username'
                                                    })
                                                    .populate({
                                                        path: 'issued_to',
                                                        select: 'first_name last_name username'
                                                    })
                                                    .populate({
                                                        path: 'disbursed_by',
                                                        select: 'first_name last_name username'
                                                    })
                                                    .populate({
                                                        path: 'inventory_product', 
                                                    })
                                                    .lean(); 

    let inventoryProductObj = inventoryProduct; 

    inventoryProductObj.categories = categories; 
    inventoryProductObj.product_units = product_units; 

    res.json({ data: inventoryProductObj }); 
}); 

/**
 * Update Inventory Product
 */
const updateInventoryProduct = asyncHandler(async (req, res) => {
    const inventoryProduct = await InventoryProduct.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProduct) return res.status(404).json({ message: "Inventory Product not found!" }); 

    let inventoryProductImageUpload = {};
    if (!req?.files?.image) {
        inventoryProductImageUpload.public_id = ''
        inventoryProductImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        inventoryProductImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_inventory_product_images"); 
        if (!inventoryProductImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        inventoryProduct.image_path.public_id = inventoryProductImageUpload.public_id
        inventoryProduct.image_path.url = inventoryProductImageUpload.secure_url
    };

    inventoryProduct.user = req?.body?.user || inventoryProduct?.user; 
    inventoryProduct.name = req?.body?.name || inventoryProduct?.name; 
    inventoryProduct.description = req?.body?.description || inventoryProduct?.description; 
    inventoryProduct.notes = req?.body?.notes || inventoryProduct?.notes; 
    inventoryProduct.amount_purchased = req?.body?.amount_purchased || inventoryProduct?.amount_purchased; 
    inventoryProduct.manufacturer = req?.body?.manufacturer || inventoryProduct?.manufacturer; 
    inventoryProduct.make_country = req?.body?.make_country || inventoryProduct?.make_country; 
    
    inventoryProduct.save()
                    .then(() => {
                        res.json({ success: `Inventory Product ${inventoryProduct?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Inventory Product
 */
const deleteInventoryProduct = asyncHandler(async (req, res) => {
    const inventoryProduct = await InventoryProduct.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProduct) return res.status(404).json({ message: "Inventory Product not found!" }); 

    if (inventoryProduct.deleted_at == '' || inventoryProduct.deleted_at == null) {
        inventoryProduct.deleted_at = new Date().toISOString();
        inventoryProduct.deleted_by = req?.user_id;
    }

    inventoryProduct.save()
                    .then(() => {
                        res.json({ success: `Inventory Product ${inventoryProduct?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Inventory Product
 */
const restoreInventoryProduct = asyncHandler(async (req, res) => {
    const inventoryProduct = await InventoryProduct.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventoryProduct) return res.status(404).json({ message: "Inventory Product not found!" }); 

    inventoryProduct.deleted_at = null;
    inventoryProduct.deleted_by = null;

    inventoryProduct.save()
                    .then(() => {
                        res.json({ success: `Inventory Product ${inventoryProduct?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Inventory Product
 */
const destroyInventoryProduct = asyncHandler(async (req, res) => {
    const inventoryProduct = await InventoryProduct.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProduct) return res.status(404).json({ message: "Inventory Product not found!" }); 

    inventoryProduct.deleteOne()
                    .then(() => {
                        res.json({ success: `inventory Product ${inventoryProduct?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getInventoryProducts, 
        createInventoryProduct, 
        getInventoryProduct, 
        updateInventoryProduct, 
        deleteInventoryProduct, 
        restoreInventoryProduct, 
        destroyInventoryProduct };