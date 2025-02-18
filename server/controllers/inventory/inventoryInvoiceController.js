import asyncHandler from 'express-async-handler'; 
import InventoryInvoice from '../../models/inventory/InventoryInvoice.js'; 


/**
 * Get Inventory Invoices
 */
const getInventoryInvoices = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const searchQuery = req?.query?.search; 

    let inventoryInvoices;

    if (searchQuery) {
        inventoryInvoices = await InventoryInvoice.find({ name: new RegExp(searchQuery, 'i'), deleted_at: null })
                                            .sort('-created_at')
                                            .lean();
    } else if (!searchQuery) {
        inventoryInvoices = await InventoryInvoice.find({ deleted_at: null })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .lean();
    }

    if (!inventoryInvoices?.length) return res.status(404).json({ message: "No inventory invoices found!" }); 

    const total = await InventoryInvoice.countDocuments({ deleted_at: null }); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: inventoryInvoices });
}); 

/**
 * Create Inventory Invoice
 */
const createInventoryInvoice = asyncHandler(async (req, res) => {
    const { name, description } = req?.body; 

    const inventoryInvoice = new InventoryInvoice({
        user: req?.user_id,  
        name, 
        description 
    }); 

    inventoryInvoice.save()
                    .then(() => {
                        res.status(201).json({ success: `Inventory Invoice ${inventoryInvoice?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Get Inventory Invoice
 */
const getInventoryInvoice = asyncHandler(async (req, res) => {
    // const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    // if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    // const products = await InventoryProductInvoice.find({ inventory_invoice: inventoryInvoice?._id })
    //                                                 .sort('-created_at')
    //                                                 .populate({
    //                                                     path: 'inventory_product', 
    //                                                 })
    //                                                 .lean(); 

    // let inventoryInvoiceObj = inventoryInvoice; 

    // inventoryInvoiceObj.products = products; 

    // res.json({ data: inventoryInvoiceObj }); 
}); 

/**
 * Update Inventory Invoice
 */
const updateInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.user = req?.body?.user || inventoryInvoice?.user; 
    inventoryInvoice.name = req?.body?.name || inventoryInvoice?.name; 
    inventoryInvoice.description = req?.body?.description || inventoryInvoice?.description; 

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Inventory Invoice
 */
const deleteInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    if (inventoryInvoice.deleted_at == '' || inventoryInvoice.deleted_at == null) {
        inventoryInvoice.deleted_at = new Date().toISOString();
        inventoryInvoice.deleted_by = req?.user_id;
    }

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Inventory Invoice
 */
const restoreInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.deleted_at = null;
    inventoryInvoice.deleted_by = null;

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Inventory Invoice
 */
const destroyInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.deleteOne()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getInventoryInvoices, 
        createInventoryInvoice, 
        getInventoryInvoice, 
        updateInventoryInvoice, 
        deleteInventoryInvoice, 
        restoreInventoryInvoice, 
        destroyInventoryInvoice }; 