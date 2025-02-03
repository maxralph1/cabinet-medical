import asyncHandler from 'express-async-handler'; 
import InventoryProductUnit from '../../models/inventory/InventoryProductUnit.js'; 


/**
 * Get Inventory Product Units
 */
const getInventoryProductUnits = asyncHandler(async (req, res) => {
    res.json({ message: "Get all inventory product units" }); 
}); 

/**
 * Create Inventory Product Units
 */
const createInventoryProductUnit = asyncHandler(async (req, res) => {
    const { inventory_product, 
            description, 
            amount_purchased, 
            manufacture_date, 
            expiration_date, 
            purchase_date, 
            make_country } = req?.body; 

    let inventoryProductUnitImageUpload = {};
    if (!req?.files?.image) {
        inventoryProductUnitImageUpload.public_id = ''
        inventoryProductUnitImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        inventoryProductUnitImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_inventory_product_unit_images"); 
        if (!inventoryProductUnitImageUpload) return res.status(400).json({ message: "Image upload failed" }); 
    }; 

    const inventoryProductUnit = new InventoryProductUnit({
        image_path: { 
            public_id: inventoryProductUnitImageUpload.public_id,
            url: inventoryProductUnitImageUpload.secure_url
        }, 
        user: req?.user_id,  
        inventory_product, 
        description, 
        amount_purchased, 
        manufacture_date, 
        expiration_date, 
        purchase_date, 
        make_country
    }); 

    inventoryProductUnit.save()
                    .then(() => {
                        res.status(201).json({ success: `Inventory Product ${inventoryProductUnit?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Get Inventory Product Unit
 */
const getInventoryProductUnit = asyncHandler(async (req, res) => {
    const inventoryProductUnit = await InventoryProductUnit.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!inventoryProductUnit) return res.status(404).json({ message: "Inventory Product Unit not found!" }); 

    res.json({ data: inventoryProductUnit }); 
}); 

const updateInventoryProductUnit = asyncHandler(async (req, res) => {
    const inventoryProductUnit = await InventoryProductUnit.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProductUnit) return res.status(404).json({ message: "Inventory Product Unit not found!" }); 

    let inventoryProductUnitImageUpload = {};
    if (!req?.files?.image) {
        inventoryProductUnitImageUpload.public_id = ''
        inventoryProductUnitImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        inventoryProductUnitImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_inventory_product_unit_images"); 
        if (!inventoryProductUnitImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        inventoryProductUnit.image_path.public_id = inventoryProductUnitImageUpload.public_id
        inventoryProductUnit.image_path.url = inventoryProductUnitImageUpload.secure_url
    };
}); 

/**
 * Soft-delete Inventory Product Unit
 */
const deleteInventoryProductUnit = asyncHandler(async (req, res) => {
    const inventoryProductUnit = await InventoryProductUnit.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProductUnit) return res.status(404).json({ message: "Inventory Product not found!" }); 

    if (inventoryProductUnit.deleted_at == '' || inventoryProductUnit.deleted_at == null) {
        inventoryProductUnit.deleted_at = new Date().toISOString();
        inventoryProductUnit.deleted_by = req?.user_id;
    }

    inventoryProductUnit.save()
                    .then(() => {
                        res.json({ success: `Inventory Product Unit ${inventoryProductUnit?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Inventory Product Unit
 */
const restoreInventoryProductUnit = asyncHandler(async (req, res) => {
    const inventoryProductUnit = await InventoryProductUnit.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventoryProductUnit) return res.status(404).json({ message: "Inventory Product Unit not found!" }); 

    inventoryProductUnit.deleted_at = null;
    inventoryProductUnit.deleted_by = null;

    inventoryProductUnit.save()
                        .then(() => {
                            res.json({ success: `Inventory Product Unit ${inventoryProductUnit?._id} restored` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        }); 
}); 

/**
 * Permanent-delete Inventory Product Unit
 */
const destroyInventoryProductUnit = asyncHandler(async (req, res) => {
    const inventoryProductUnit = await InventoryProductUnit.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryProductUnit) return res.status(404).json({ message: "inventory Product Unit not found!" }); 

    inventoryProductUnit.deleteOne()
                    .then(() => {
                        res.json({ success: `inventory Product Unit ${inventoryProductUnit?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getInventoryProductUnits, createInventoryProductUnit, getInventoryProductUnit, updateInventoryProductUnit, deleteInventoryProductUnit, restoreInventoryProductUnit, destroyInventoryProductUnit };